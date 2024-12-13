const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({ region: process.env.AWS_REGION });

/**
 * Uploads a file to S3
 * @param {Buffer} fileBuffer - The file data
 * @param {string} fileName - The name of the file in S3
 * @returns {Object} Upload result containing the location and ETag
 */
exports.uploadFileToS3 = async (fileBuffer, fileName) => {
  const bucketName = "persona-pal-audio";

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "audio/mpeg", // Adjust ContentType if uploading non-MP3 files
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    return {
      Location: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      ETag: response.ETag,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error.message);
    throw new Error("Failed to upload file to S3");
  }
};

/**
 * Lists all files in the specified S3 bucket
 * @returns {Array} List of file keys in the bucket
 */
exports.listFilesInBucket = async () => {
  const bucketName = "persona-pal-audio";

  try {
    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const data = await s3Client.send(command);
    return data.Contents ? data.Contents.map((file) => file.Key) : [];
  } catch (error) {
    console.error("Error listing files in S3 bucket:", error.message);
    throw new Error("Failed to list files in S3 bucket");
  }
};

/**
 * Fetches a JSON transcript file from S3 and parses it
 * @param {string} bucketName - Name of the S3 bucket
 * @param {string} key - Key of the JSON file in the bucket
 * @returns {Object} Parsed JSON content of the transcript file
 */
exports.fetchTranscriptFromS3 = async (bucketName, key) => {
  const params = { Bucket: bucketName, Key: key };

  try {
    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    // Convert the response stream to a string
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
        stream.on("error", reject);
      });

    const body = await streamToString(response.Body);
    return JSON.parse(body); // Ensure the fetched content is valid JSON
  } catch (error) {
    console.error("Error fetching object from S3:", error.message);
    throw new Error("Failed to fetch object from S3");
  }
};
