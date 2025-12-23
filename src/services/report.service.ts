import { Writable } from "stream";
import * as ExcelJS from "exceljs";
import prisma from "../db";
import { createCsvStream } from "../util/csv";

class ReportService {
    /**
     * Generates a CSV report and streams it to the provided writable stream.
     * 
     * @param outputStream - The stream where the CSV data will be written.
     */
    async generateCsvReport(outputStream: Writable) {
        console.log("[REPORT-SERVICE] Starting CSV report generation");
        const csvStream = createCsvStream(outputStream);

        let lastId: number | undefined;
        const batchSize = 500;
        console.log("[REPORT-SERVICE] Batch size:", batchSize);

        let totalProducts = 0;
        while (true) {
            const products: any[] = await prisma.product.findMany({
                take: batchSize,
                skip: lastId ? 1 : 0,
                cursor: lastId ? { id: lastId } : undefined,
                include: { category: true },
                orderBy: { id: "asc" },
            });

            if (products.length === 0) {
                console.log("[REPORT-SERVICE] No more products to process");
                break;
            }

            totalProducts += products.length;
            console.log("[REPORT-SERVICE] Processing batch of", products.length, "products. Total so far:", totalProducts);

            products.forEach((p) => {
                csvStream.write({
                    ID: p.id,
                    "Product Name": p.name,
                    Price: p.price.toFixed(2),
                    "Category Name": p.category.name,
                    "Created At": p.createdAt.toISOString(),
                });
            });

            lastId = products[products.length - 1].id;
        }

        csvStream.end();
        console.log("[REPORT-SERVICE] CSV report generation completed. Total products:", totalProducts);
    }

    /**
     * Generates an XLSX report and streams it to the provided writable stream.
     * 
     * @param outputStream 
     */
    async generateXlsxReport(outputStream: Writable) {
        console.log("[REPORT-SERVICE] Starting XLSX report generation");
        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: outputStream,
        });
        const worksheet = workbook.addWorksheet("Products");
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Product Name", key: "name", width: 30 },
            { header: "Price", key: "price", width: 15 },
            { header: "Category Name", key: "categoryName", width: 25 },
            { header: "Created At", key: "createdAt", width: 25 },
        ];
        console.log("[REPORT-SERVICE] Worksheet columns configured");

        let lastId: number | undefined;
        const batchSize = 500;
        console.log("[REPORT-SERVICE] Batch size:", batchSize);

        let totalProducts = 0;
        while (true) {
            const products: any[] = await prisma.product.findMany({
                take: batchSize,
                skip: lastId ? 1 : 0,
                cursor: lastId ? { id: lastId } : undefined,
                include: { category: true },
                orderBy: { id: "asc" },
            });

            if (products.length === 0) {
                console.log("[REPORT-SERVICE] No more products to process");
                break;
            }

            totalProducts += products.length;
            console.log("[REPORT-SERVICE] Processing batch of", products.length, "products. Total so far:", totalProducts);

            products.forEach((p) => {
                worksheet.addRow({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    categoryName: p.category.name,
                    createdAt: p.createdAt.toISOString(),
                }).commit(); 
            });

            lastId = products[products.length - 1].id;
        }

        console.log(" [REPORT-SERVICE] Committing workbook...");
        await workbook.commit();
        console.log(" [REPORT-SERVICE] XLSX report generation completed. Total products:", totalProducts);
    }
}

export default new ReportService();
