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

  const handleUpload = onFileUpload ?? uploadToCloud;

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-8 bg-gray-50">
      <form
        className="w-full h-full max-w-5xl flex flex-col items-center justify-center"
        onSubmit={async (e) => {
          e.preventDefault();
          if (file) {
            setView(Views.Loading);
            await handleUpload(file);
            setView(Views.Results);
          } else {
            alert("Please select a file first!");
          }
        }}
      >
        <label
          htmlFor="file-upload"
          className="group relative flex h-[70vh] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-300 bg-white transition-all hover:border-blue-400 hover:bg-blue-50"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5 text-center">
            <svg
              className="mb-4 h-12 w-12 text-gray-400 group-hover:text-blue-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>

            <p className="mb-2 text-xl font-semibold text-gray-700">
              {file ? "File Selected" : "Choose File"}
            </p>

            <p className="text-sm text-gray-500">
              {file ? (
                <span className="font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {file.name}
                </span>
              ) : (
                "PDF (MAX. 10MB)"
              )}
            </p>
          </div>

          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="application/pdf"
          />
        </label>

        {file && (
          <button
            type="submit"
            className="mt-8 rounded-full bg-blue-600 px-10 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Verify Document
          </button>
        )}
      </form>
    </main>
  );
}
