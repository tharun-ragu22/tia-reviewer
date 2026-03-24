export enum Views {
  Homepage,
  Results,
}

export enum Severity {
  Pass,
  Fail,
  Flag,
}

export interface Finding {
  section: string;
  severity: Severity;
  issue: string;
  detail: string;
  recommendation: string;
}
export interface MethodologyFlags {
  ite_codes_cited: boolean;
  peak_hours_defined: boolean;
  study_area_justified: boolean;
  los_methodology_stated: boolean;
  mitigation_proportional: boolean;
}

export interface TIAReview {
  summary: string;
  overall_rating: Severity;
  findings: Finding[];
  methodology_flags: MethodologyFlags;
}
