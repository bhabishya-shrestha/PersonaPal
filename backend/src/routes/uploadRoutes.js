const express = require("express");
const multer = require("multer");
const { uploadFileToS3 } = require("../services/s3Service");

const router = express.Router();
const upload = multer(); // Initialize multer without storage to use memory storage

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const file = req.file;
  const fileName = file.originalname;

  try {
    const s3Response = await uploadFileToS3(file.buffer, fileName);
    res.json({ fileUrl: s3Response.Location });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;
