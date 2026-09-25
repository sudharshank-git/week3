import Joi from "joi";
import * as Model from "../models/productModel.js";
import * as Schema from "../schemas/productSchema.js"



export const getProducts = async (req, res) => {
    try {
        console.log(req.headers)
        const products = await Model.getAll();
        return res.status(200).json({
            message: "Product data fetched",
            count: products.length,
            products: products,
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
};

export const getProductsById = async (req, res) => {
    const { error, value } = Schema.idSchema.validate(req.params);
    if (error) return res.status(422).json({ message: error.details });
    try {
        const products = await Model.getProduct(value.id);
        return res.status(200).json({
            message: "Product data fetched",
            products: products,
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
};



export const filterProducts = async (req, res) => {
    const { error, value } = Schema.filterSchema.validate(req.query);
    if (error) return res.status(422).json({ message: error.details });
    const condition = []
    const values =[]
    const add = async(cat,v)=>{
        values.push(v)
        condition.push(cat.replace("?",`$${values.length}`))
    }

    if (value.category) add("category = ?", value.category);
    if (value.brand) add("brand = ?", value.brand);
    if (value.name) add("name ILIKE ?", `%${value.name}%`);
    if (value.price !== undefined) add("price <= ?", value.price);
    if (value.stock !== undefined) add("stock >= ?", value.stock);
    if (value.rating !== undefined) add("rating >= ?", value.rating);
    if (value.inStock !== undefined) add("instock = ?", value.inStock);
    const sql = `SELECT * FROM ${schema}.products` +
    (condition.length ? ` WHERE ${condition.join(" AND ")}` : "") +
    " ORDER BY id";
    try {
        const products = await Model.filterProduct(sql,values);
        if (products.length === 0) {
            const body = {
                message: "No products matched your filters",
                products: [],
            };
            if (value.category) {
                const catag = await Model.getCategory()
                console.log(catag)
                body.availableCategories = catag.map((r) => r.category);
            }
            return res.status(404).json(body);
        }
        return res.status(200).json({
            message: "Product data fetched",
            count : products.length,
            products: products,
        });
    } catch (err) {
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
};


export const addProduct = async (req,res)=>{
    const { error, value } = Schema.productSchema.validate(req.body);
    if (error) return res.status(422).json({ message: error.details });
    try {
        const details = [
            value.name,
            value.price,
            value.stock,
            value.inStock,
            value.brand,
            value.category,
            value.rating,
        ]
        const newProduct = await Model.addNewProduct(details)
        if(newProduct.length === 0) return res.status(404).json({ message: "Product not found" });
        return res.status(201).json({ message: "New product added", product: newProduct });
    }catch (err) {
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
}


export const replaceProduct = async (req,res)=>{
    const idVal = Schema.idSchema.validate(req.params)
    if (idVal.error) {
        return res.status(422).json({ message: error.details });
    }
    const { error, value } = Schema.productSchema.validate(req.body);
    if (error) return res.status(422).json({ message: error.details });
    try {
        const details = [
            value.name,
            value.price,
            value.stock,
            value.inStock,
            value.brand,
            value.category,
            value.rating,
            idVal.value.id
        ]
        const newData = await Model.replaceProductData(details)
        if(newData.length === 0) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product replaced successfully", product: newData });
    }catch (err) {
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
}



export const updateProduct = async (req,res)=>{
    const idVal = Schema.idSchema.validate(req.params)
    if (idVal.error) {
        return res.status(422).json({ message: error.details });
    }
    const { error, value } = Schema.patchSchema.validate(req.body);
    if (error) return res.status(422).json({ message: error.details });
    try {

        const row = await Model.getProduct(idVal.value.id)
        const details = [
            value.name ?? row.name,
            value.price ?? row.price,
            value.stock ?? row.stock,
            value.inStock ?? row.instock,
            value.brand ?? row.brand,
            value.category ?? row.category,
            value.rating ?? row.rating,
            idVal.value.id
        ]
        const newData = await Model.updateProductData(details)
        if(newData.length === 0) return res.status(404).json({ message: "Product not found" });
        return res.status(200).json({ message: "Product updated successfully", product: newData });
    }catch (err) {
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
}

export const deleteProduct = async(req,res)=>{
    const {error,value} = Schema.idSchema.validate(req.params)
    if (error) return res.status(422).json({ message: error.details });
    try{
        const deletedRow = await Model.deleteProductData(value.id)
        if(deletedRow.length === 0){
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({"Deleted Product":deletedRow});
    }catch(err){
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
}


export const deleteRecord = async(req,res)=>{
    try{
        const Records = await Model.deleteAllRecord()
        const getProducts = await Model.getAll()
        if(getProducts.length !== 0) return res.status(400).json({message:"The data is not deleted"})
        return res.status(204).send();
    }catch(err){
        console.log(err);
        const error = new Error(err.message);
        error.statusCode = 500;
        return next(error);
    }
}