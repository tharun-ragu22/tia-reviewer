"use client";

import FileUpload from "./FileUpload";
import { useState } from "react";
import { Views } from "./DataModels";

export default function MainComponent() {
  const [view, setView] = useState<Views>(Views.Homepage);
  if (view === Views.Homepage) {
    return <FileUpload setView={setView} />;
  } else {
    return <div>Results</div>;
  }
}
