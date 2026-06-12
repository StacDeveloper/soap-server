import pool from "../db.js"

export class UserModel{
    static async migrate(){
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
            )
            `)
    }
    static async findAll(){
        const result = await pool.query(`SELECT id, name, email, created_at FROM users ORDER BY created_at DESC`)
        return result.rows
    }
    static async findById(id){
        const result  =  await pool.query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [id])
        return result.rows[0] || null
    }   
    static async create({name, email}){
        const result = await pool.query(`INSERT INTO users (name, email) VAULES ($1 $2) RETURNING id, name, email, created_at`, [name, email])
        return result.rows[0]
    }
    static async update(id,{name,email}){
        const result = await pool.query(`UPDATE users SET name = $1, email = $2, WHERE id = $3 RETURNING id, name, email, created_at`, [name, email, id])
        return result.rows[0] || null
        
    }
    static async delete(id){
        const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING id`,[id])
        return result.rows[0] || null
    }
}