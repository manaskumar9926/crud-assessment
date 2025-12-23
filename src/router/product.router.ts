import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
} from "../controller/product.controller";
import { bulkUpload } from "../controller/bulk-upload.controller";
import AuthMiddleware from "../middleware/auth.middleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
console.log("[MULTER] File upload middleware configured - destination: uploads/");

const ProductRouter = Router();
console.log(" [PRODUCT-ROUTER] Initializing product routes");

// Product CRUD
ProductRouter.post("/", AuthMiddleware, createProduct);
console.log(" [PRODUCT-ROUTER] POST / registered (protected)");
ProductRouter.get("/", AuthMiddleware, getProducts);
console.log(" [PRODUCT-ROUTER] GET / registered (protected)");
ProductRouter.put("/:id", AuthMiddleware, updateProduct);
console.log(" [PRODUCT-ROUTER] PUT /:id registered (protected)");

// Bulk Upload
ProductRouter.post(
  "/bulk-upload",
  AuthMiddleware,
  upload.single("file"),
  bulkUpload
);
console.log(" [PRODUCT-ROUTER] POST /bulk-upload registered (protected, with file upload)");

console.log("[PRODUCT-ROUTER] All product routes registered");

export default ProductRouter;
