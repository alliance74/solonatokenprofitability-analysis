import { RequestHandler } from "express";
import * as path from "path";
import * as fs from "fs";

export const handleDownload: RequestHandler = (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Security: only allow downloading from the data directory and only CSV files
    if (!filename.endsWith(".csv") || filename.includes("..")) {
      return res.status(400).json({ error: "Invalid filename" });
    }

    const filepath = path.join(process.cwd(), "data", filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Download failed",
    });
  }
};
