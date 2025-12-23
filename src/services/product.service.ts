import prisma from "../db";
import { getPagination } from "../util/pagination";

class ProductService {

    async createProduct(data: {
        name: string;
        price: number;
        image?: string;
        categoryId: number;
    }) {
        console.log("[PRODUCT-SERVICE] Creating product:", data.name, "in category:", data.categoryId);
        const result = await prisma.product.create({
            data,
            include: { category: true },
        });
        console.log("[PRODUCT-SERVICE] Product created with ID:", result.id);
        return result;
    }

    async getProducts(params: {
        page?: number;
        limit?: number;
        search?: string;
        sortOrder?: "asc" | "desc";
    }) {
        console.log("[PRODUCT-SERVICE] Getting products with params:", params);
        const { page, limit, search, sortOrder = "asc" } = params;
        const { skip, take } = getPagination(page, limit);
        console.log("[PRODUCT-SERVICE] Pagination - skip:", skip, "take:", take);

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" as const } },
                    {
                        category: {
                            name: { contains: search, mode: "insensitive" as const },
                        },
                    },
                ],
            }
            : {};

        if (search) {
            console.log("[PRODUCT-SERVICE] Searching for:", search);
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { price: sortOrder },
                include: { category: true },
            }),
            prisma.product.count({ where }),
        ]);

        console.log("[PRODUCT-SERVICE] Found", products.length, "products out of", total, "total");

        return {
            products,
            meta: {
                total,
                page: page || 1,
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    async updateProduct(
        id: number,
        data: {
            name?: string;
            price?: number;
            image?: string;
            categoryId?: number;
        }
    ) {
        console.log("[PRODUCT-SERVICE] Updating product ID:", id, "with data:", data);
        const result = await prisma.product.update({
            where: { id },
            data,
            include: { category: true },
        });
        console.log("[PRODUCT-SERVICE] Product updated successfully");
        return result;
    }
}

export default new ProductService();
