"use client";

import FileUpload from "./FileUpload";
import { useState } from "react";
import { Views } from "./DataModels";
import ResultsPage from "./ResultsPage";

export default function MainComponent() {
  const [view, setView] = useState<Views>(Views.Homepage);
  if (view === Views.Homepage) {
    return <FileUpload setView={setView} />;
  } else {
    return <ResultsPage setView={setView}/>;
  }
}
