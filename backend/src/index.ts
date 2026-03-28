import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const SECRET_KEY = process.env.SECRET_KEY || 'ma_cle_secrete_super_secure';

const verifierToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Non connecté" });

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = payload; 
        next();
    } catch (error) {
        res.status(403).json({ error: "Session expirée" });
    }
};

async function startServeur() {
    try {
        await pool.query('SELECT NOW()');
        console.log("✅ Base de données connectée");

        // --- AUTH ---
        app.post('/register', async (req, res) => {
            const { username, email, password, role } = req.body;
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const result = await pool.query(
                    'INSERT INTO utilisateurs (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, role',
                    [username, email, hashedPassword, role || 'Emprunteur']
                );
                res.status(201).json(result.rows[0]);
            } catch (e) { res.status(500).json({ error: "Erreur inscription" }); }
        });

        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            try {
                const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
                if (result.rows.length === 0) return res.status(401).json({ error: "Utilisateur inconnu" });
                const user = result.rows[0];
                if (await bcrypt.compare(password, user.password)) {
                    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
                    res.json({ token, role: user.role, username: user.username });
                } else { res.status(401).json({ error: "MDP incorrect" }); }
            } catch (e) { res.status(500).json({ error: "Erreur connexion" }); }
        });

        // --- LIVRES ---
        app.get('/livres', async (req, res) => {
            try {
                const result = await pool.query('SELECT * FROM "Livres" ORDER BY id DESC');
                res.json(result.rows);
            } catch (e) { res.status(500).json({ error: "Erreur de lecture" }); }
        });

        app.get('/livres/auteur', verifierToken, async (req: any, res) => {
            try {
                const result = await pool.query('SELECT * FROM "Livres" WHERE auteur_id = $1 ORDER BY id DESC', [req.user.id]);
                res.json(result.rows);
            } catch (e) { res.status(500).json({ error: "Erreur SQL" }); }
        });

        app.get('/livres/:id', async (req, res) => {
            try {
                const result = await pool.query('SELECT * FROM "Livres" WHERE id = $1', [req.params.id]);
                if (result.rows.length === 0) return res.status(404).json({ error: "Inexistant" });
                res.json(result.rows[0]);
            } catch (e) { res.status(500).json({ error: "Erreur" }); }
        });

                    app.get('/ventes/auteur', verifierToken, async (req: any, res) => {
                try {
                    const result = await pool.query(
                        `SELECT 
                            L.id, 
                            L.titre, 
                            L.prix, 
                            L.image_url, 
                            A.date_achat, 
                            U.username AS acheteur 
                        FROM "Achats" A 
                        JOIN "Livres" L ON A.livre_id = L.id 
                        JOIN utilisateurs U ON A.utilisateur_id = U.id 
                        WHERE L.auteur_id = $1 
                        ORDER BY A.date_achat DESC`,
                        [req.user.id]
                    );
                    res.json(result.rows);
                } catch (e) { 
                    console.error(e);
                    res.status(500).json({ error: "Erreur lors de la récupération des ventes" }); 
                }
            });

        app.post('/livres', verifierToken, async (req: any, res) => {
            const { titre, description, prix, stock, image_url, type } = req.body;
            try {
                const result = await pool.query(
                    'INSERT INTO "Livres" (titre, description, prix, stock, image_url, type, auteur_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                    [titre, description, prix, stock, image_url, type, req.user.id]
                );
                res.status(201).json(result.rows[0]);
            } catch (e) { res.status(500).json({ error: "Erreur ajout" }); }
        });

        app.put('/livres/:id', verifierToken, async (req: any, res) => {
            const { id } = req.params;
            const { titre, description, prix, stock, image_url, type } = req.body;
            try {
                const check = await pool.query('SELECT auteur_id FROM "Livres" WHERE id = $1', [id]);
                if (req.user.role !== 'Admin' && check.rows[0].auteur_id !== req.user.id) return res.status(403).json({ error: "Interdit" });
                const result = await pool.query(
                    'UPDATE "Livres" SET titre=$1, description=$2, prix=$3, stock=$4, image_url=$5, type=$6 WHERE id=$7 RETURNING *',
                    [titre, description, prix, stock, image_url, type, id]
                );
                res.json(result.rows[0]);
            } catch (e) { res.status(500).json({ error: "Erreur modif" }); }
        });

        app.delete('/livres/:id', verifierToken, async (req: any, res) => {
            try {
                const check = await pool.query('SELECT auteur_id FROM "Livres" WHERE id = $1', [req.params.id]);
                if (req.user.role !== 'Admin' && check.rows[0].auteur_id !== req.user.id) return res.status(403).json({ error: "Interdit" });
                await pool.query('DELETE FROM "Livres" WHERE id = $1', [req.params.id]);
                res.json({ message: "Supprimé" });
            } catch (e) { res.status(500).json({ error: "Erreur suppr" }); }
        });

        // --- ACHATS & VENTES ---
        app.post('/achats', verifierToken, async (req: any, res) => {
            const { livre_id } = req.body;
            try {
                await pool.query('INSERT INTO "Achats" (utilisateur_id, livre_id) VALUES ($1, $2)', [req.user.id, livre_id]);
                await pool.query('UPDATE "Livres" SET stock = stock - 1 WHERE id = $1 AND stock > 0', [livre_id]);
                res.status(201).json({ message: "Achat confirmé" });
            } catch (e) { res.status(500).json({ error: "Erreur lors de l'achat" }); }
        });

        app.get('/ventes/auteur', verifierToken, async (req: any, res) => {
            try {
                const result = await pool.query(
                    'SELECT L.*, A.date_achat FROM "Achats" A JOIN "Livres" L ON A.livre_id = L.id WHERE L.auteur_id = $1 ORDER BY A.date_achat DESC',
                    [req.user.id]
                );
                res.json(result.rows);
            } catch (e) { res.status(500).json({ error: "Erreur récupération ventes" }); }
        });

        app.listen(3000, () => console.log("🚀 Serveur sur port 3000"));
    } catch (e) { console.error("Erreur serveur:", e); }
}
startServeur();