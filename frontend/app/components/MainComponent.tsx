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
  if (view === Views.Homepage) {
    return (
      <FileUpload
        setView={setView}
        setOverallResult={setOverallResult}
        setSummaryText={setSummaryText}
        setFindings={setFindings}
      />
    );
  } else if (view === Views.Loading) {
    return <LoadingPage />;
  } else {
    return (
      <ResultsPage
        setView={setView}
        overallResult={overallResult}
        summaryText={summaryText}
        findings={findings}
      />
    );
  }
}
