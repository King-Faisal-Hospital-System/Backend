import express from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { createProduct, deleteProduct, getProducts, updateProductPrice } from "../controllers/product.controllers.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

const productRouter = express.Router();

productRouter.post("/", authorize, authorizeRole('ADMIN'), createProduct);
productRouter.get("/", authorize, authorizeRole("ADMIN"), getProducts);
productRouter.delete("/:productId", authorize, deleteProduct);
productRouter.patch("/:productId/price", authorize, updateProductPrice);

export default productRouter