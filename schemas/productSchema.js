import Joi from "joi"


export const idSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});


export const productSchema = Joi.object({
    name: Joi.string().min(2).required(),
    category: Joi.string().min(2).required(),
    price: Joi.number().integer().min(100).required(),
    brand: Joi.string().min(2).required(),
    stock: Joi.number().integer().min(0).default(1),
    rating: Joi.number().min(0).max(5).default(1),
    inStock: Joi.boolean().default(false),
});


export const patchSchema = Joi.object({
    name: Joi.string().min(2),
    category: Joi.string().min(2),
    price: Joi.number().integer().min(100),
    brand: Joi.string().min(2),
    stock: Joi.number().integer().min(0),
    rating: Joi.number().min(0).max(5),
    inStock: Joi.boolean(),   
}).min(1);


export const filterSchema = Joi.object({
    name: Joi.string(),
    category: Joi.string(),
    brand: Joi.string(),
    price: Joi.number().integer().positive(),
    stock: Joi.number().integer().min(0),
    rating: Joi.number().min(0).max(5), 
    inStock: Joi.boolean(),
});
