import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import AuthRouter from "./router/auth.router";
import CategoryRouter from "./router/category.router";
import ProductRouter from "./router/product.router";

import corsConfig from "./util/cors";

console.log("[INIT] Initializing Express application...");
const app = express();

// Middlewares
console.log("[INIT] Registering middlewares...");
app.use(cors(corsConfig));
console.log("CORS middleware registered");
app.use(express.json());
console.log("JSON body parser registered");
app.use(express.urlencoded({ extended: false }));
console.log(" URL-encoded body parser registered");
app.use(cookieParser());
console.log("Cookie parser registered");

// Routes
console.log("[INIT] Mounting routes...");
app.use("/auth", AuthRouter);
console.log(" Auth routes mounted at /auth");
app.use("/categories", CategoryRouter);
console.log("Category routes mounted at /categories");
app.use("/products", ProductRouter);

console.log("Product routes mounted at /products");

const PORT = process.env.PORT || 8080;
console.log(`🔧 [INIT] Starting server on port ${PORT}...`);
app.listen(PORT, () => {
  console.log(`[SERVER] Server running on port ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[SERVER] Ready to accept requests!`);
});
