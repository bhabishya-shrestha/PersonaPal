const {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} = require("@aws-sdk/client-transcribe-streaming");
const { PassThrough } = require("stream");

const transcribeClient = new TranscribeStreamingClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.transcribeStreaming = async (audioStream) => {
  const passThrough = new PassThrough();
  audioStream.pipe(passThrough);

  const command = new StartStreamTranscriptionCommand({
    LanguageCode: "en-US", // Adjust as needed for other languages
    MediaSampleRateHertz: 16000,
    MediaEncoding: "pcm", // Ensure the input matches this encoding
    AudioStream: passThrough,
  });

  try {
    console.log("Starting AWS Transcribe Streaming...");
    const response = await transcribeClient.send(command);
    console.log("AWS Transcribe Streaming started successfully.");

    let transcription = "";

    for await (const event of response.TranscriptResultStream) {
      if (event.TranscriptEvent) {
        for (const result of event.TranscriptEvent.Transcript.Results) {
          if (result.IsPartial === false) {
            const chunk = result.Alternatives[0]?.Transcript || "";
            transcription += chunk;
            console.log("Received transcription chunk:", chunk);
          }
        }
      }
    }

    console.log("Streaming transcription completed.");
    return transcription;
  } catch (error) {
    console.error("Error in AWS Transcribe Streaming:", error);
    throw new Error("Streaming transcription failed.");
  }
};
