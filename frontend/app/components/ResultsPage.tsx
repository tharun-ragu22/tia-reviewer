import { Finding, Views } from "./DataModels";

interface ResultsPageProps {
  setView: (view: Views) => void;
  overallResult: string;
  summaryText: string;
  findings: Finding[];
}

export default function ResultsPage({
  setView,
  overallResult,
  summaryText,
  findings
}: ResultsPageProps) {
  const findingSection = findings.map((finding)=> 
    <div className="finding">
        <p>{finding.section}</p>
        <p>Severity: {finding.severity}</p>
        <p>{finding.detail}</p>
    </div>
  )
    return (
    <div>
      <h1>Results</h1>
      <h1>Overall Result: {overallResult}</h1>
      <h1>Summary</h1>
      <div className="summary-section">{summaryText}</div>
      <h1>Findings</h1>
      {
        findingSection
      }
      <h1>Methodology Flags</h1>
      <button onClick={() => setView(Views.Homepage)}>
        Upload another file
      </button>
    </div>
  );
}
