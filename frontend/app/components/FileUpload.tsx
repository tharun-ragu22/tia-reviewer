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
    formData.append("file", file);

    const req = await fetch("api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await req.json();
    setOverallResult(data.overall_rating);
    setSummaryText(data.summary);
    setFindings(data.findings);
  }
  onFileUpload = onFileUpload ?? uploadToCloud;
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (file) {
          await onFileUpload(file);
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
