from src.constants import VALIDATION_PROMPT
from src.datamodels import TIAReview
from google import genai
from google.genai import types
import os

from dotenv import load_dotenv
load_dotenv()  # call this before os.environ["GEMINI_API_KEY"]

def get_insights(presigned_url: str) -> TIAReview:
    

    client = genai.Client(
        vertexai=True,
        project=os.environ["GCP_PROJECT_ID"],
        location="us-central1"
    )

    

    response = client.models.generate_content(
        model="gemini-2.5-pro",
        contents=[
            types.Part.from_uri(
                file_uri=presigned_url,
                mime_type="application/pdf"
            ),
            VALIDATION_PROMPT
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=TIAReview,
        )
    )

    return response.parsed

if __name__ == "__main__":
    print(get_insights('gs://tia-files/tia-uploads/dixie_outlet_mall.pdf'))