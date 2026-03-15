from pydantic import BaseModel
from google import genai
from google.genai import types
import os

from dotenv import load_dotenv
load_dotenv()  # call this before os.environ["GEMINI_API_KEY"]

def get_insights(presigned_url: str):
    

    client = genai.Client(
        vertexai=True,
        project=os.environ["GCP_PROJECT_ID"],
        location="us-central1"
    )
    VALIDATION_PROMPT = '''
    You are a senior traffic engineer reviewing a Traffic Impact Assessment (TIA) 
    submitted by a development consultant for municipal approval.

    Review this TIA and return a JSON object with exactly this structure:

    {
    "summary": "2-3 sentence plain-language overview of the study quality",
    "overall_rating": "pass" | "flag" | "fail",
    "findings": [
        {
        "section": "Trip Generation",
        "severity": "pass" | "flag" | "fail",
        "issue": "One sentence describing what was checked",
        "detail": "Specific finding with page/table reference where possible",
        "recommendation": "What the consultant should address"
        }
    ],
    "methodology_flags": {
        "ite_codes_cited": true | false,
        "peak_hours_defined": true | false,
        "study_area_justified": true | false,
        "los_methodology_stated": true | false,
        "mitigation_proportional": true | false
    }
    }

    Check specifically for:
    1. Trip generation — are ITE land use codes cited and appropriate? Do rates match 
    the ITE Trip Generation Manual for the cited code and study area context?
    2. Peak hour selection — are AM and PM peaks both analyzed? Is the study period 
    justified relative to the development type?
    3. Level of service — is the HCM methodology stated? Are pre- and post-development 
    LOS compared at all study intersections?
    4. Distribution and assignment — is the methodology explained? Are assumptions 
    reasonable for the road network?
    5. Mitigation measures — are proposed mitigations proportional to projected 
    impacts? Are they specific and enforceable?
    6. Internal consistency — do numbers in the executive summary match the technical 
    appendices? Flag any discrepancies.

    Be specific. Reference table numbers, page numbers, and section headings where 
    possible. A finding with no specific reference is less useful than one that says 
    "Table 3-2 on page 14 shows...".
    '''

    

    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=[
            types.Part.from_uri(
                file_uri=presigned_url,
                mime_type="application/pdf"
            ),
            VALIDATION_PROMPT
        ]
    )

    print(response.text)

if __name__ == "__main__":
    print(get_insights('gs://tia-files/tia-uploads/dixie_outlet_mall.pdf'))