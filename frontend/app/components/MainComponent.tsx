"use client";

import FileUpload from "./FileUpload";
import { useState } from "react";
import { Views, Finding } from "./DataModels";
import ResultsPage from "./ResultsPage";

export default function MainComponent() {
  const [view, setView] = useState<Views>(Views.Homepage);
  const [overallResult, setOverallResult] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [findings, setFindings] = useState<Finding[]>([])
  if (view === Views.Homepage) {
    return <FileUpload setView={setView} setOverallResult={setOverallResult} setSummaryText={setSummaryText} setFindings={setFindings}/>;
  } else {
    return <ResultsPage setView={setView} overallResult={overallResult} summaryText={summaryText} findings={findings}/>;
  }
}
