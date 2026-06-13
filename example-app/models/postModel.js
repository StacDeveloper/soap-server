import pool from "../db.js"

export class PostModel {
    static async migrate() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS posts(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) on DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            body TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
            )
            `)
    }
    static async findAll() {
        const result = await pool.query(`
            SELECT p.id, p.title, p.body, p.created_at, u.id AS user_id, u.name AS user_name FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC
            `)
        return result.rows
    }
    static async findById(id) {
        const results = await pool.query(`SELECT p.id,p.title, p.body, p.created_at, u.id AS user_id, u.name AS user_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id =$1`, [id])
        return results.rows[0] || null
    }
    static async findByUserId(userId) {
        const results = await pool.query(`SELECT p.id, p.title, p.body, p.created_at FROM posts p WHERE user_id = $1 ORDER BY created_at DESC`[userId])
        return results.rows
    }
    static async search(keyword) {
        const result = await pool.query(`SELECT p.id, p.title, p.body, p.created_at, u.name AS user_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.title ILIKE $1 OR p.body ILIKE $1 ORDER BY p.created_at DESC`, [`%${keyword}%`])
        return result.rows[0] || null
    }
    static async delete(id) {
        const result = await pool.query(`DELETE FROM posts WHERE id = $1 RETURNING id`, [id])
        return result.rows[0] || null
    }
    static async update(id, { title, body }) {
        const result = await pool.query(`UPDATE posts SET title = $1, body = $2 WHERE id =  $3 RETURNING id, user_id, title, body, created_at`,[title, body, id])
        return result.rows[0] || null
    }
    static async create({ userId, title, body }) {
        const result = await pool.query(`INSERT INTO posts (user_id, title, body) VALUES ($1, $2, $3) RETURNING id, user_id, title, body, created_at`, [userId, title, body])
        return result.rows[0] || null
    }
}