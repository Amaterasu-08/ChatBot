from dotenv import load_dotenv
from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
import os
import json
import requests
import openai

# Load environment variables from .env file (if any)
load_dotenv()


class Response(BaseModel):
    result: str | None


origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8000"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

summeriser = os.getenv('API_TOKEN')
gpt = os.getenv('chatgpt_api_key')


@app.post("/predict", response_model=Response)
async def predict(question: str = Form(...), file: UploadFile = File(...)) -> Any:

    # read the file
    contents = await file.read()
    filename = file.filename
    file_extension = os.path.splitext(filename)[1]

    if file_extension == '.txt':
        text = contents.decode('utf-8')
    elif file_extension == '.csv':
        import pandas as pd
        from io import StringIO
        s = StringIO(contents.decode('utf-8'))
        df = pd.read_csv(s)
        text = df.to_string()
    elif file_extension == '.pdf':
        from PyPDF2 import PdfReader
        from io import BytesIO
        reader = PdfReader(BytesIO(contents))
        text = ""
        num_pages = len(reader.pages)

        for page_number in range(num_pages):
            page = reader.pages[page_number]
            text += page.extract_text()
    else:
        text = 'Unsupported file type'

    API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
    headers = {"Authorization": f"Bearer {summeriser}"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    output = query({
        "inputs": text,
        "parameters": {"min_length": 200, "max_length": 1000}
    })[0]

    # output["summary_text"]
    # pragraph = output["summary_text"]
    # openai.api_key = gpt

    # response = openai.ChatCompletion.create(
    # model="gpt-3.5-turbo",
    # messages=[
    #         {"role": "system", "content": "You are a helpful assistant."},
    #         {"role": "user", "content": f"find the answer to {question} in the paragraph {pragraph} "},
    #     ]
    # )

    # # response['choices'][0]['message']['content']

    # return {"result" : response['choices'][0]['message']['content']}
    return {"result":output["summary_text"]}