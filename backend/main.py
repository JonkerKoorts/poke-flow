from typing import Union

from fastapi import FastAPI
from .common import api_url_build
import httpx

app = FastAPI()

# example use
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/pokemon/{pokemon_name}")
async def get_pokemon(pokemon_name: str):
    url = api_url_build("pokemon", pokemon_name.lower())
    print(f"Requesting URL: {url}")  # Debug print
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        print(f"Status code: {response.status_code}")  # Debug print
        
        if response.status_code == 200:
            return response.json()
        return {
            "error": "Failed to fetch Pokemon data",
            "status_code": response.status_code,
            "url": url,
            "detail": response.text
        }
