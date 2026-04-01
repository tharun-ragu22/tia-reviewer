"use client";

import FileUpload from "./FileUpload";
import { useState } from "react";
import { Views, Finding } from "./DataModels";
import ResultsPage from "./ResultsPage";
import LoadingPage from "./LoadingPage";

export default function MainComponent() {
  const [view, setView] = useState<Views>(Views.Homepage);
  const [overallResult, setOverallResult] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [findings, setFindings] = useState<Finding[]>([]);

  return (
    <main className="w-full">
      <title>TIA Reviewer</title>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">TIA Reviewer</h1>
      {view === Views.Homepage ? (
        <FileUpload
          setView={setView}
          setOverallResult={setOverallResult}
          setSummaryText={setSummaryText}
          setFindings={setFindings}
        />
      ) : view === Views.Loading ? (
        <LoadingPage />
      ) : (
        <ResultsPage
          setView={setView}
          overallResult={overallResult}
          summaryText={summaryText}
          findings={findings}
        />
      )}
    </main>
  );
}
