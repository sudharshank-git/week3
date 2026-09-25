import Joi from "joi";


export const registerSchema = Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().email(),
    password: Joi.string().min(8),
}).required()


export const loginSchema = Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
})