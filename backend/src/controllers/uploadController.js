const multer = require("multer");
const { uploadToS3 } = require("../services/s3Service");

const upload = multer();

exports.uploadFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const bucketName = "persona-pal-audio";
  const key = file.originalname;

  try {
    console.log("Uploading file to S3:", { bucketName, key });
    const s3Response = await uploadToS3(bucketName, key, file.buffer);
    res.json({
      fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.error("Error uploading file to S3:", error.message);
    res.status(500).json({ error: "Failed to upload file to S3" });
  }
};
