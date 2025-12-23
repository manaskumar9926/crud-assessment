import fs from "fs";
import csvParser from "csv-parser";
import prisma from "../db";

class BulkUploadService {
  /**
   * Processes a CSV file and inserts valid products in batches.
   * 
   * @param filePath - Path to the uploaded CSV file.
   * @returns A summary object with total, successful, and failed row counts.
   */
  async processBulkUpload(filePath: string) {
    console.log("[BULK-SERVICE] Starting bulk upload processing");
    console.log("[BULK-SERVICE] File path:", filePath);

    const summary = {
      totalRows: 0,
      successfulInserts: 0,
      failedRows: 0,
    };


    console.log("[BULK-SERVICE] Fetching valid category IDs...");
    const categories = await prisma.category.findMany({ select: { id: true } });
    const categoryIdSet = new Set(categories.map((c) => c.id));
    console.log("[BULK-SERVICE] Valid categories:", categoryIdSet.size);

    const batchSize = 100;
    let batch: any[] = [];
    console.log("[BULK-SERVICE] Batch size:", batchSize);

    const stream = fs.createReadStream(filePath).pipe(csvParser());
    console.log("[BULK-SERVICE] CSV stream created, starting to process rows...");

    try {
      for await (const row of stream) {
        summary.totalRows++;

        if (summary.totalRows % 100 === 0) {
          console.log("[BULK-SERVICE] Processed", summary.totalRows, "rows so far...");
        }

        const categoryId = parseInt(row.categoryId);
        const price = parseFloat(row.price);

        if (
          !row.name ||
          isNaN(price) ||
          isNaN(categoryId) ||
          !categoryIdSet.has(categoryId)
        ) {
          summary.failedRows++;
          if (summary.failedRows <= 5) {
            console.log("[BULK-SERVICE] Validation failed for row:", { name: row.name, price, categoryId });
          }
          continue;
        }

        batch.push({
          name: row.name,
          price: price,
          image: row.image || null,
          categoryId: categoryId,
        });

        if (batch.length >= batchSize) {
          console.log("[BULK-SERVICE] Inserting batch of", batch.length, "products...");
          await prisma.product.createMany({ data: batch });
          summary.successfulInserts += batch.length;
          console.log("[BULK-SERVICE] Batch inserted. Total successful:", summary.successfulInserts);
          batch = [];
        }
      }

      if (batch.length > 0) {
        console.log("[BULK-SERVICE] Inserting final batch of", batch.length, "products...");
        await prisma.product.createMany({ data: batch });
        summary.successfulInserts += batch.length;
        console.log("[BULK-SERVICE] Final batch inserted");
      }
    } catch (error) {
      console.log("[BULK-SERVICE] Error during processing:", error);
      throw error;
    }

    console.log("[BULK-SERVICE] Bulk upload completed");
    console.log("[BULK-SERVICE] Summary:", summary);
    return summary;
  }
}

export default new BulkUploadService();
