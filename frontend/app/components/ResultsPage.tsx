import { Finding, Views, Severity } from "./DataModels";

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
  findings,
}: ResultsPageProps) {
  function toStringValue(s?: string | Severity) {
    if (s === undefined || s === null) return "";
    if (typeof s === "string") return s;
    // Severity is an enum; map numeric value back to its name
    return Severity[s] ?? "";
  }

  function capitalize(s?: string | Severity) {
    const raw = toStringValue(s);
    if (!raw) return "";
    const lower = raw.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  function severityColor(s?: string | Severity) {
    const key = toStringValue(s).toLowerCase();
    if (key === "pass") return "bg-green-100 text-green-800";
    if (key === "flag") return "bg-yellow-100 text-yellow-800";
    if (key === "fail") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-extrabold text-center mb-6">Results</h1>

      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-xl font-semibold">Overall Result:</div>
        <div
          className={`px-3 py-1 rounded-full font-medium ${severityColor(overallResult)}`}
        >
          {capitalize(overallResult)}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <div className="prose max-w-none text-gray-700">{summaryText}</div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Findings</h2>
        <div className="space-y-4">
          {findings.map((finding, idx) => (
            <div key={idx} className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-900">
                  {finding.section}
                </div>
                <div
                  className={`px-2 py-0.5 text-sm rounded ${severityColor(finding.severity)}`}
                >
                  {capitalize(finding.severity)}
                </div>
              </div>
              <div className="text-gray-700">{finding.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setView(Views.Homepage)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-95"
        >
          Upload another file
        </button>
      </div>
    </div>
  );
}
