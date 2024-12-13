const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION });

exports.uploadFileToS3 = async (fileBuffer, fileName) => {
  const bucketName = "persona-pal-audio";

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "audio/mpeg", // Ensure this matches your file type
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    return {
      Location: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      ETag: response.ETag,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
