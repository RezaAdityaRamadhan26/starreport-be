import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(conn => {
        console.log('berhasil terhubung ke db');
        conn.release();
    })
    .catch(err => {
        console.error('gagal terhubung ke db', err.message);
    });

export default db;