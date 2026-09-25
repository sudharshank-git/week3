import "dotenv/config";
import pg from "pg";

export const db = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});


db.on("error", (err) => {
    res.status(503).json({ Message :"Service Unavailable", Error: err.message});
});

export const schema = process.env.DB_SCHEMA;