import logging
import settings
import uvicorn
from fastapi import FastAPI, HTTPException
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
# from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv  # Import dotenv to load .env file
import os

# Load environment variables from .env file
load_dotenv()

logger=logging.getLogger('uvicorn.error')

# FastAPI and CORS Middleware setup
origins = [
    "http://localhost:5173"  # Adjust based on your frontend origin
]
middleware = [
    Middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
]

app = FastAPI(debug=True, middleware=middleware)

# Input schema for analyzing code snippets
class CodeSnippet(BaseModel):
    snippet: str

# Output schema for the Big-O prediction
class BigOPrediction(BaseModel):
    big_o: str
    explanation: Optional[str] = None  # Explanation of the prediction

# Configure the OpenAI client
OPENAI_KEY = os.getenv("OPENAI_KEY")
print(OPENAI_KEY)
if not OPENAI_KEY:
    raise ValueError("OPENAI_KEY is not set in the environment variables.")

client = OpenAI(
    api_key=OPENAI_KEY
)
# client = OpenAI(
#     api_key="sk-ijklmnopqrstuvwxijklmnopqrstuvwxijklmnop"
# )

@app.post('/analyze', response_model=BigOPrediction)
async def analyze_code_snippet(snippet: CodeSnippet):
    """
    Analyzes a code snippet and predicts the Big-O notation.
    """
    try:
        # Use OpenAI GPT to process the snippet and predict Big-O
        messages = [
            {"role": "user", "content": f"Analyze the following code snippet and predict its Big-O notation with an explanation:\n\n{snippet.snippet}"}
        ]
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Replace with the appropriate model
            store=True,
            messages=messages,
            temperature=0
        )

        # Extract prediction and explanation from the OpenAI response
        prediction_text = response.choices[0].message.content
        logger.info(f'Prediction Text: {prediction_text}')

        # Search for 'Conclusion' and check for 'O(' in the same string
        conclusion_start = prediction_text.lower().find('conclusion')
        if conclusion_start != -1:
            conclusion_text = prediction_text[conclusion_start:]
            if "O(" in conclusion_text:
                # Extract Big-O notation (O(n), O(1), etc.)
                big_o = 'O('+conclusion_text.split('O(')[-1].split(')')[0]+')'
            else:
                big_o = "Unknown"
        else:
            big_o = "Unknown"

        # Return the result with Big-O notation and explanation
        return BigOPrediction(big_o=big_o, explanation=prediction_text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing code: {str(e)}")

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000,log_config=settings.LOGGING_CONFIG)
