import pg from 'pg';
const { Client } = pg;
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'library_db',
    password: '123456789',
    port: 5432,
});
async function testConnexion() {
    try {
        await client.connect();
        console.log("Succès ! Le code est lié à PostgresSQL.");
        const res = await client.query('SELECT * FROM "Livre"');
        console.log("\n--- LIVRES DANS PGADMIN ---");
        console.table(res.rows);
    }
    catch (error) {
        console.error("Erreur de connexion :", error);
    }
    finally {
        await client.end();
    }
}
testConnexion();
//# sourceMappingURL=index.js.map