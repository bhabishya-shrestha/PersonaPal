import React from "react";

function FileUploader({ setUploadedAudio }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Generate S3 URL for uploaded file (adjust if you're uploading dynamically)
      const uploadedAudioUrl = `https://persona-pal-audio.s3.us-east-1.amazonaws.com/${file.name}`;
      setUploadedAudio(uploadedAudioUrl);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
    </div>
  );
}

export default FileUploader;
