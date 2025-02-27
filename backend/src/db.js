const waitPort = require('wait-port');
const fs = require('fs');
const { Client } = require('pg');

const {
    POSTGRES_HOST: HOST,
    POSTGRES_HOST_FILE: HOST_FILE,
    POSTGRES_USER: USER,
    POSTGRES_USER_FILE: USER_FILE,
    POSTGRES_PASSWORD: PASSWORD,
    POSTGRES_PASSWORD_FILE: PASSWORD_FILE,
    POSTGRES_DB: DB,
    POSTGRES_DB_FILE: DB_FILE,
} = process.env;

let client;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE, 'utf8') : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

    await waitPort({
        host,
        port: 5432,
        timeout: 10000,
        waitForDns: true,
    });

    client = new Client({
        host,
        user,
        password,
        database
    });

    return client.connect().then(async () => {
        console.log(`Connected to postgres db at host ${HOST}`);
        await client.query(`
            CREATE TABLE IF NOT EXISTS words (
                word VARCHAR(255) UNIQUE NOT NULL
            )
        `);
        console.log('Connected to db and created table words if it did not exist');
    });
}

async function insert(word) {
    await client.query(
        'INSERT INTO words (word) VALUES ($1) ON CONFLICT (word) DO NOTHING RETURNING *',
        [word]
    );
}

async function getAllWords() {
    const res = await client.query('SELECT * FROM words');
    return res.rows;
}

async function deleteWord(word) {
    const result = await client.query('DELETE FROM words WHERE word = $1 RETURNING *', [word]);
    return result.rowCount > 0;
}

module.exports = {
    init,
    insert,
    getAllWords,
    deleteWord
};
