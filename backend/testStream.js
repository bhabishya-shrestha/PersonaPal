const fs = require("fs");

const testStreamTranscription = async () => {
  const audioFilePath = "output.wav"; // Replace with your test WAV file
  const readStream = fs.createReadStream(audioFilePath);

  try {
    const response = await fetch("http://localhost:5000/stream-transcription", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: readStream,
      duplex: "half", // Required for streaming body
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const transcription = await response.text();
    console.log("Transcription Result:", transcription);
  } catch (error) {
    console.error("Error during streaming transcription test:", error.message);
  }
};

testStreamTranscription();
