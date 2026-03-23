"use client";
import { useState } from "react";
import { Views } from "./DataModels";

async function uploadToCloud(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const req = await fetch("api/upload", {
    method: "POST",
    body: formData,
  });
  console.log(await req.json());
}

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  setView: (view: Views) => void;
}

export default function FileUpload({ onFileUpload, setView }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  onFileUpload = onFileUpload ?? uploadToCloud;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (file) {
          onFileUpload(file);
        }
        setView(Views.Results)
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
