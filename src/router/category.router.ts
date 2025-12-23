import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../controller/category.controller";
import AuthMiddleware from "../middleware/auth.middleware";

const CategoryRouter = Router();

console.log("  [CATEGORY-ROUTER] Initializing category routes");

CategoryRouter.post("/", createCategory); 
CategoryRouter.get("/", getCategories); 
CategoryRouter.put("/:id", AuthMiddleware, updateCategory);

console.log(" [CATEGORY-ROUTER] All category routes registered");

export default CategoryRouter;
