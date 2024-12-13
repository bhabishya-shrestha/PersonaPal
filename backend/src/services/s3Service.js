const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: process.env.AWS_REGION });

exports.fetchTranscriptFromS3 = async (bucketName, key) => {
  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const response = await s3.send(command);

  const transcriptData = await new Promise((resolve, reject) => {
    const chunks = [];
    response.Body.on("data", (chunk) => chunks.push(chunk));
    response.Body.on("end", () => {
      try {
        const data = Buffer.concat(chunks).toString();
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    response.Body.on("error", reject);
  });

  return transcriptData;
};
