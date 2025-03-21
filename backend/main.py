from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
from .common import api_url_build
from backend.helper_functions import fetch_pokemon_data

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/pokemon-by-gender/{gender_choice}")
async def get_pokemon_by_gender(gender_choice: str):
    gender_url = api_url_build("gender", gender_choice.lower())

    async with httpx.AsyncClient() as client:
        response = await client.get(gender_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch gender data"}

        gender_data = response.json()
        pokemon_entries = gender_data.get("pokemon_species_details", [])

        categorized = {}
        for entry in pokemon_entries[:20]:  # Limit to 20 for speed
            species_name = entry["pokemon_species"]["name"]
            pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
            
            pokemon_data = await fetch_pokemon_data(pokemon_url)

            for t in pokemon_data.get("types", []):
                categorized.setdefault(t, []).append(pokemon_data["name"])

        return categorized
