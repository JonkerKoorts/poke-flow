from typing import Union

from fastapi import FastAPI
from .common import api_url_build
import httpx

app = FastAPI()

@app.get("/gender/{gender_choice}")
async def get_pokemon(gender_choice: str):
    url = api_url_build("gender", gender_choice.lower())
    print(f"Requesting URL: {url}")  # Debug print
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        print(f"Status code: {response.status_code}")  # Debug print
        
        if response.status_code == 200:
            return response.json()
        return {
            "error": "Failed to fetch Gender data",
            "status_code": response.status_code,
            "url": url,
            "detail": response.text
        }
