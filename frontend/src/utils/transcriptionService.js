export const startTranscriptionJob = async (audioUrl) => {
  const response = await fetch("http://localhost:5000/transcribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audioUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to start transcription job.");
  }

  const data = await response.json();
  return data.transcriptionJobName;
};

export const fetchTranscriptionResult = async (jobName) => {
  const response = await fetch(
    `http://localhost:5000/transcription-result/${jobName}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transcription result.");
  }

  const data = await response.json();
  return data.transcript;
};
