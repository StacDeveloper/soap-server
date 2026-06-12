import pg from "pg"
import { config } from "./config.js"

const { Pool } = pg

const pool = new Pool({
    connectionString: config.dburl,
    ssl: { rejectUnauthorized: false }
})

pool.connect((err,client,relese)=>{
    if(err){
        console.error("Database error " + err.message)
        return
    }
    relese()
    console.log("Connected to Neon DB")
})

export default pool
