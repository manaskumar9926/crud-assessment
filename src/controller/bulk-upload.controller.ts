import { Request, Response } from "express";
import bulkUploadService from "../services/bulk-upload.service";
import { CatchError } from "../util/error";
import fs from "fs";

export const bulkUpload = async (req: Request, res: Response): Promise<void> => {
    console.log(" [BULK-UPLOAD] Bulk upload request received");
    try {
        if (!req.file) {
            console.log(" [BULK-UPLOAD] No file uploaded");
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        const filePath = req.file.path;
        console.log(" [BULK-UPLOAD] File received:", req.file.originalname);
        console.log(" [BULK-UPLOAD] File path:", filePath);
        console.log(" [BULK-UPLOAD] File size:", req.file.size, "bytes");

        console.log(" [BULK-UPLOAD] Starting CSV processing...");
        const result = await bulkUploadService.processBulkUpload(filePath);
        console.log(" [BULK-UPLOAD] Processing completed:", result);

        console.log(" [BULK-UPLOAD] Cleaning up temporary file...");
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(" [BULK-UPLOAD] Error deleting temporary file:", err);
            } else {
                console.log(" [BULK-UPLOAD] Temporary file deleted successfully");
            }
        });

        res.status(200).json({
            message: "Bulk upload completed",
            data: result,
        });
    } catch (error) {
        console.log(" [BULK-UPLOAD] Error during bulk upload:", error);
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error(" [BULK-UPLOAD] Error deleting temporary file after error:", err);
            });
        }
        CatchError(error, res, "Bulk upload failed");
    }
};
