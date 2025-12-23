import prisma from "../db";
class CategoryService {
    async createCategory(name: string) {
        console.log("[CATEGORY-SERVICE] Creating category:", name);
        const result = await prisma.category.create({
            data: { name },
        });
        console.log("[CATEGORY-SERVICE] Category created with ID:", result.id);
        return result;
    }

    async getAllCategories() {
        console.log("[CATEGORY-SERVICE] Fetching all categories");
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
        });
        console.log("[CATEGORY-SERVICE] Found", categories.length, "categories");
        return categories;
    }

    async updateCategory(id: number, name: string) {
        console.log("[CATEGORY-SERVICE] Updating category ID:", id, "to name:", name);
        const result = await prisma.category.update({
            where: { id },
            data: { name },
        });
        console.log("[CATEGORY-SERVICE] Category updated successfully");
        return result;
    }
}

export default new CategoryService();
