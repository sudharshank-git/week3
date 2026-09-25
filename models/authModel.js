import {db,schema} from "../db.js"


export const registerNewUser = async(body)=>{
    console.log(body)
    const result = await db.query(`INSERT INTO ${schema}.users (username,email,password) VALUES ($1,$2,$3) RETURNING *`,body)
    return result.rows
}
export const loginUser = async(email)=>{
    const result = await db.query(`SELECT * FROM ${schema}.users WHERE email=$1`,[email])
    return result.rows[0]
}