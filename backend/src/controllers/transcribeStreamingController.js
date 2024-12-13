const {
  transcribeStreaming,
} = require("../services/transcribeStreamingService");

exports.handleStreamingTranscription = async (req, res) => {
  try {
    console.log("Streaming transcription request received.");
    const transcriptionResult = await transcribeStreaming(req);
    res.send(transcriptionResult);
  } catch (error) {
    console.error("Error in streaming transcription:", error.message);
    res.status(500).send("Streaming transcription failed.");
  }
};
