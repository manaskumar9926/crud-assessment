import { Request, Response } from "express";
import productService from "../services/product.service";
import { CatchError, TryError } from "../util/error";

export const createProduct = async (req: Request, res: Response) => {
  console.log("[PRODUCT] Create product request received");
  try {
    const { name, price, image, categoryId } = req.body;
    console.log("[PRODUCT] Product data:", { name, price, categoryId });

    if (!name || !price || !categoryId) {
      console.log("[PRODUCT] Create failed: Missing required fields");
      throw TryError("Missing required fields", 400);
    }

    console.log("[PRODUCT] Creating product in database...");
    const product = await productService.createProduct({
      name,
      price,
      image,
      categoryId,
    });
    console.log("[PRODUCT] Product created:", product.id);

    res.json(product);
  } catch (err) {
    console.log(" [PRODUCT] Create product error:", err);
    CatchError(err, res, "Create product failed");
  }
};

export const getProducts = async (req: Request, res: Response) => {
  console.log(" [PRODUCT] Get products request received");
  try {
    const { page = 1, limit = 10, search, sort = "asc" } = req.query;
    console.log("[PRODUCT] Query params:", { page, limit, search, sort });

    console.log(" [PRODUCT] Fetching products from database...");
    const result = await productService.getProducts({
      page: Number(page),
      limit: Number(limit),
      search: search ? String(search) : undefined,
      sortOrder: sort === "desc" ? "desc" : "asc",
    });
    console.log("[PRODUCT] Products fetched:", result.products.length, "products, total:", result.meta.total);

    res.json(result);
  } catch (err) {
    console.log(" [PRODUCT] Fetch products error:", err);
    CatchError(err, res, "Fetch products failed");
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  console.log(" [PRODUCT] Update product request received");
  try {
    const id = Number(req.params.id);
    const { name, price, image, categoryId } = req.body;
    console.log(" [PRODUCT] Updating product ID:", id, "with data:", { name, price, categoryId });

    console.log("[PRODUCT] Updating in database...");
    const product = await productService.updateProduct(id, {
      name,
      price,
      image,
      categoryId,
    });
    console.log("[PRODUCT] Product updated:", product.id);

    res.json(product);
  } catch (err) {
    console.log("[PRODUCT] Update product error:", err);
    CatchError(err, res, "Update product failed");
  }
};
