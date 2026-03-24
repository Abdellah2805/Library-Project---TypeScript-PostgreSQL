import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import pkg from 'pg';

// Initialisation
const { Pool } = pkg;
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuration de la base de données via Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const SECRET_KEY = process.env.SECRET_KEY || 'ma_cle_secrete_super_secure';

// Middleware de vérification du Token JWT
const verifierToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Accès refusé, vous n'êtes pas connecté" });
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        req.user = payload; // Contient l'ID, le rôle et le username
        next();
    } catch (error) {
        res.status(403).json({ error: "Badge invalide ou expiré" });
    }
};

// --- ROUTES ---

async function startServeur() {
    try {
        // Test de connexion à PostgreSQL
        await pool.query('SELECT NOW()');
        console.log("Connecté à PostgreSQL avec succès");

        // 1. INSCRIPTION
        app.post('/register', async (req, res) => {
            const { username, email, password, role } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                const result = await pool.query(
                    'INSERT INTO utilisateurs (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
                    [username, email, hashedPassword, role || 'Emprunteur']
                );
                res.status(201).json(result.rows[0]);
            } catch (error) {
                res.status(400).json({ error: "Email déjà utilisé ou données invalides" });
            }
        });

        // 2. CONNEXION
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            try {
                const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
                if (result.rows.length === 0) return res.status(401).json({ error: "Utilisateur non trouvé" });

                const user = result.rows[0];
                const passwordValide = await bcrypt.compare(password, user.password);
                if (!passwordValide) return res.status(401).json({ error: "Mot de passe incorrect" });

                const token = jwt.sign(
                    { id: user.id, role: user.role, username: user.username },
                    SECRET_KEY,
                    { expiresIn: '24h' }
                );
                res.json({ token });
            } catch (error) {
                res.status(500).json({ error: "Erreur serveur" });
            }
        });

        // 3. RÉCUPÉRER LES LIVRES
        app.get('/livres', async (req, res) => {
            try {
                const result = await pool.query('SELECT * FROM "Livres" ORDER BY id DESC');
                res.json(result.rows);
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la récupération des livres" });
            }
        });

        // 4. AJOUTER UN LIVRE (Version Mise à jour)
        app.post('/livres', verifierToken, async (req: any, res) => {
            if (req.user.role !== 'Auteur' && req.user.role !== 'Admin') {
                return res.status(403).json({ error: "Seuls les auteurs peuvent publier" });
            }

            const { titre, image_url, prix, type, description, stock } = req.body;
            const auteur_id = req.user.id;

            try {
                // Requête sans point-virgule parasite
                const query = `
                    INSERT INTO "Livres" (titre, image_url, prix, type, description, stock, auteur_id) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7) 
                    RETURNING *
                `;
                const values = [
                    titre, 
                    image_url || null, 
                    parseFloat(prix) || 0, 
                    type, 
                    description || null, 
                    parseInt(stock) || 0, 
                    auteur_id
                ];

                const result = await pool.query(query, values);
                res.status(201).json(result.rows[0]);
            } catch (error: any) {
                console.error("ERREUR SQL :", error.message);
                res.status(500).json({ error: "Erreur lors de l'ajout du livre" });
            }
        });

        // 5. ADMIN : LISTER UTILISATEURS
        app.get('/admin/users', verifierToken, async (req: any, res) => {
            if (req.user.role !== 'Admin') return res.status(403).json({ error: "Interdit" });
            const result = await pool.query('SELECT id, username, email, role FROM utilisateurs ORDER BY id DESC');
            res.json(result.rows);
        });

        // 6. ADMIN : SUPPRIMER UTILISATEUR (Corrigé)
        app.delete('/admin/users/:id', verifierToken, async (req: any, res) => {
            if (req.user.role !== 'Admin') return res.status(403).json({ error: "Interdit" });
            try {
                await pool.query('DELETE FROM utilisateurs WHERE id = $1', [req.params.id]);
                res.json({ message: "Utilisateur supprimé" });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la suppression" });
            }
        });

        // 7. ADMIN : SUPPRIMER LIVRE
        app.delete('/admin/livres/:id', verifierToken, async (req: any, res) => {
            if (req.user.role !== 'Admin') return res.status(403).json({ error: "Interdit" });
            try {
                await pool.query('DELETE FROM "Livres" WHERE id = $1', [req.params.id]);
                res.json({ message: "Livre supprimé" });
            } catch (error) {
                res.status(500).json({ error: "Erreur lors de la suppression du livre" });
            }
        });

        // Lancement du serveur
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Serveur lancé sur http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Impossible de démarrer le serveur :", error);
    }
}

startServeur();