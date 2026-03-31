"use client";
import { useState } from "react";
import { Finding, Views } from "./DataModels";


interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  setView: (view: Views) => void;
  setOverallResult: (status: string) => void;
  setSummaryText: (summaryText: string) => void;
  setFindings: (findings: Finding[]) => void;
}

export default function FileUpload({
  onFileUpload,
  setView,
  setOverallResult,
  setSummaryText,
  setFindings,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  async function uploadToCloud(file: File) {
    const formData = new FormData();
    formData.append("file_name", file.name);

    const req = await fetch("api/presigned-url", {
      method: "POST",
      body: formData,
    });
    const data = await req.json();
    const presignedUrl = data.presigned_url;
    const fileUri = data.file_uri;

    await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: file,
    });

    
    

    const backendFormData = new FormData();
    backendFormData.append("file_uri", fileUri);

    const resultReq = await fetch("api/verification", {
      method: "POST",
      body: backendFormData,
    });

    const results = await resultReq.json();

    setOverallResult(results.overall_rating);
    setSummaryText(results.summary);
    setFindings(results.findings);
  }
  onFileUpload = onFileUpload ?? uploadToCloud;
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (file) {
          await onFileUpload(file);
        } else {
          alert("Please select a file!");
        }
        setView(Views.Results);
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
