const { synthesizeText } = require("../services/pollyService");

exports.synthesizeSpeech = async (req, res) => {
  const { text } = req.body;

  try {
    if (!text) {
      throw new Error("Text parameter is required");
    }

    const audioStream = await synthesizeText(text);

    // Set headers for audio content
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=output.mp3",
    });

    // Pipe the audio stream directly to the response
    audioStream.pipe(res);
  } catch (error) {
    console.error("Error synthesizing speech:", error);
    res.status(500).json({ error: error.message }); // Send error message only
  }
};
