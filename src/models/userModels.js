import db from "../config/db.js";

export const findUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

export const createUser = async (username, hashedPassword, role = 'user') => {
    const [result] = await db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role]
    );
    return result.insertId; // return id user yang dibikin
};

export const getAllUsers = async () => {
    const query = `SELECT id, username, role FROM users ORDER BY id DESC`;
    const [rows] = await db.query(query);
    return rows;
};

export const getUserById = async (id) => {
    const query = `SELECT id, username, role FROM users WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

export const updateUserRole = async (id, role) => {
    const query = `UPDATE users SET role = ? WHERE id = ?`;
    const [result] = await db.query(query, [role, id]);
    return result.affectedRows;
};

export const deleteUserById = async (id) => {
    const query = `DELETE FROM users WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
};

export const getUserPasswordById = async (id) => {
    const query = `SELECT password FROM users WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

export const updateUserPassword = async (id, newHashedPassword) => {
const query = `UPDATE users SET password = ? WHERE id = ?`;
    const [result] = await db.query(query, [newHashedPassword, id]);
    return result.affectedRows
};