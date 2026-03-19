"use client";
import { useState } from "react";

function uploadToCloud(file: File) {
  // Placeholder function to simulate file upload to cloud storage
  console.log(`Uploading ${file.name} to cloud storage...`);
  return Promise.resolve(`https://cloudstorage.com/${file.name}`);
}

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  onFileUpload = onFileUpload ?? uploadToCloud;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (file) {
          onFileUpload(file);
        }
      }}
    >
      <label htmlFor="file-upload" className="sr-only">
        Choose file
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
