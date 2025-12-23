import { Request, Response } from "express";
import categoryService from "../services/category.service";
import { CatchError, TryError } from "../util/error";

export const createCategory = async (req: Request, res: Response) => {
  console.log(" [CATEGORY] Create category request received");
  try {
    const { name } = req.body;
    console.log("[CATEGORY] Category name:", name);

    if (!name) {
      console.log(" [CATEGORY] Create failed: Missing category name");
      throw TryError("Category name required", 400);
    }

    console.log(" [CATEGORY] Creating category in database...");
    const category = await categoryService.createCategory(name);
    console.log("[CATEGORY] Category created:", category);

    res.json(category);
  } catch (err) {
    console.log("[CATEGORY] Create category error:", err);
    CatchError(err, res, "Create category failed");
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  console.log(" [CATEGORY] Get all categories request received");
  try {
    console.log(" [CATEGORY] Fetching categories from database...");
    const categories = await categoryService.getAllCategories();
    console.log(" [CATEGORY] Categories fetched:", categories.length, "categories");

    res.json(categories);
  } catch (err) {
    console.log(" [CATEGORY] Fetch categories error:", err);
    CatchError(err, res, "Fetch categories failed");
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  console.log("[CATEGORY] Update category request received");
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    console.log(" [CATEGORY] Updating category ID:", id, "with name:", name);

    console.log(" [CATEGORY] Updating in database...");
    const category = await categoryService.updateCategory(id, name);
    console.log("[CATEGORY] Category updated:", category);

    res.json(category);
  } catch (err) {
    console.log("[CATEGORY] Update category error:", err);
    CatchError(err, res, "Update category failed");
  }
};
