import { Views } from "./DataModels";

interface ResultsPageProps {
  setView: (view: Views) => void;
}

export default function ResultsPage({ setView }: ResultsPageProps) {
  return (
    <div>
        <h1>Results</h1>
        <h1>Summary</h1>
        <h1>Findings</h1>
        <h1>Methodology Flags</h1>
        <button onClick={()=>setView(Views.Homepage)}>Upload another file</button>
    </div>
  )
}
