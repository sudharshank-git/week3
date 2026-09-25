// routes/products.routes.js
import Joi from "joi";
import express from "express";
import { db, schema } from "../db.js";
import * as Model from "../models/productModel.js"
import * as Schema from "../schemas/productSchema.js"
import { authenticateToken } from "../middlewares/auth.js";
import * as run from "../controllers/productController.js";

const router = express.Router();

const serverError = (res, err) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
};



router.get("/", run.getProducts);


router.get("/filter",run.filterProducts);


router.get("/:id",run.getProductsById);


router.post("/", authenticateToken,run.addProduct);


router.put("/:id",authenticateToken ,run.replaceProduct);


router.patch("/:id",authenticateToken,run.updateProduct);


router.delete("/:id",authenticateToken,run.deleteProduct);


router.delete("/",authenticateToken,run.deleteRecord);

export default router;
