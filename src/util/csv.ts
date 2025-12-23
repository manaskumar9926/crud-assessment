import * as fastcsv from "fast-csv";
import { Writable } from "stream";

export const PRODUCT_REPORT_HEADERS = [
    "ID",
    "Product Name",
    "Price",
    "Category Name",
    "Created At",
];

/**
 * Helper to create a CSV stream writer.
 * 
 * @param writableStream - The stream to write the CSV data to (e.g., Express response)
 * @returns A fast-csv formater stream
 * 
 * WHY: Using streams prevents memory overflow when generating large reports,
 * which is critical for production-grade Node.js servers.
 */
export const createCsvStream = (writableStream: Writable) => {
    console.log("[CSV] Creating CSV stream");
    const csvStream = fastcsv.format({ headers: true });
    csvStream.pipe(writableStream);
    console.log("[CSV] CSV stream created and piped to writable stream");
    return csvStream;
};
