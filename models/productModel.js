import express from "express"
import {db , schema} from "../db.js"

export const getAll = async () =>{
    const result = await db.query(`SELECT * FROM ${schema}.products ORDER BY id ASC;`)
    return result.rows
}

export const getProduct = async (id) => {
    const result = await db.query(
        `SELECT * FROM ${schema}.products WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

export const filterProduct = async (filter,query) => {
    const result = await db.query(filter,query);
    return result.rows;
};

export const getCategory = async()=>{
    const result = await db.query(`SELECT DISTINCT category FROM ${schema}.products ORDER BY category`,);
    return result.rows
} 

export const addNewProduct = async(data)=>{
    const result = await 
    db.query(`INSERT INTO ${schema}.products
            (name, price, stock, instock, brand, category, rating)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,data)
    return result.rows
}
export const replaceProductData = async (data) => {

    const result = await db.query(
        `UPDATE ${schema}.products
        SET name = $1,
        price = $2,
        stock = $3,
        instock = $4,
        brand = $5,
        category = $6,
        rating = $7
        WHERE id = $8
        RETURNING *`,
        data
    );
    console.log(result)
    return result.rows;
};


export const updateProductData = async (data) => {
    const result = await db.query( `UPDATE ${schema}.products SET name = $1, price = $2, stock = $3, instock = $4, brand = $5, category = $6, rating = $7 WHERE id = $8 RETURNING *`, data
    );
    return result.rows;
};

export const deleteProductData = async (id)=>{
    const result = await db.query(
      `DELETE FROM ${schema}.products WHERE id = $1 RETURNING *`,[id]);
    return result.rows;
}
export const deleteAllRecord = async ()=>{
    const result = await db.query(`TRUNCATE TABLE ${schema}.products RESTART IDENTITY`)
    return result.rows;
}

