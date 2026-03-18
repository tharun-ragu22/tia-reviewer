from pydantic import BaseModel
from enum import Enum

class Severity(str, Enum):
    PASS = "pass"
    FLAG = "flag"
    FAIL = "fail"

class Finding(BaseModel):
    section: str
    severity: Severity
    issue: str
    detail: str
    recommendation: str

class MethodologyFlags(BaseModel):
    ite_codes_cited: bool
    peak_hours_defined: bool
    study_area_justified: bool
    los_methodology_stated: bool
    mitigation_proportional: bool

class TIAReview(BaseModel):
    summary: str
    overall_rating: Severity
    findings: list[Finding]
    methodology_flags: MethodologyFlags