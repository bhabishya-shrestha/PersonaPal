import React, { useState } from "react";

function TextToSpeech() {
  const [text, setText] = useState("Hello from the AI voice!");
  const [audioUrl, setAudioUrl] = useState(null);

  const handleSpeak = async () => {
    try {
      const response = await fetch("http://localhost:5000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Allow user to download the generated audio
      const link = document.createElement("a");
      link.href = url;
      link.download = "output.mp3";
      link.click();

      setAudioUrl(url);
    } catch (error) {
      console.error("Error generating speech:", error);
      alert("Failed to generate voice. See console for details.");
    }
  };

  return (
    <div className="text-to-speech">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Type text to convert to speech"
      />
      <br />
      <button onClick={handleSpeak}>Generate Voice</button>
      {audioUrl && <audio controls src={audioUrl}></audio>}
    </div>
  );
}

export default TextToSpeech;
