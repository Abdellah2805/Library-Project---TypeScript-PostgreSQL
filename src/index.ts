import pg from 'pg';
const { Client} = pg;
 
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'library_db',
    password: '123456789',
    port: 5432,
});

async function executionSecurisee() {
    try {
        await client.connect();
        await client.query('BEGIN');

        const updateLivre = 'Update "Livre" SET statut = $1 WHERE id = $2';
        await client.query(updateLivre, ['EMPRUNTE', 1]);

        const logEmprunt = 'INSERT INTO "Emprunter" (nom_utilisateur) VALUES ($1)';
        await client.query(logEmprunt, ['Abdullah']);

        await client.query('COMMIT');
        console.log("Transaction réussie !");
        
    } catch (error) {
        await client.query('ROLLEBACK');
        console.error("Erreur de transaction annulée :", error);
    } finally {
        await client.end();
    }
}

executionSecurisee();


