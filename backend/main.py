from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
from .common import api_url_build
from backend.helper_functions import fetch_pokemon_data, categorize_pokemon_role

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
    """
    Fetch Pokemon filtered by gender.
    
    Args:
        gender_choice (str): The gender to filter by ('male' or 'female')
        
    Returns:
        list: List of Pokemon matching the gender criteria
    """
    gender_url = api_url_build("gender", gender_choice.lower())

    async with httpx.AsyncClient() as client:
        response = await client.get(gender_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch gender data"}

        gender_data = response.json()
        pokemon_entries = gender_data.get("pokemon_species_details", [])

        pokemon_list = []
        for entry in pokemon_entries[:20]:  # Limit to 20 for speed
            species_name = entry["pokemon_species"]["name"]
            pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
            
            pokemon_data = await fetch_pokemon_data(pokemon_url)
            if pokemon_data:
                pokemon_list.append(pokemon_data)

        return pokemon_list
    
# refine gender choice by narrowing down via types
@app.get("/pokemon-by-type/{type_choice}")
async def get_pokemon_by_type(type_choice: str):
    type_url = api_url_build("type", type_choice.lower())
    async with httpx.AsyncClient() as client:
        response = await client.get(type_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch type data"}
        type_data = response.json()
        pokemon_entries = type_data.get("pokemon", [])

        pokemon_list = []
        for entry in pokemon_entries[:20]:  # Limit to 20 for speed
            species_name = entry["pokemon"]["name"]
            pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
            
            pokemon_data = await fetch_pokemon_data(pokemon_url)
            if pokemon_data:
                pokemon_list.append(pokemon_data)

        return pokemon_list

@app.get("/pokemon-by-gender/{gender_choice}/filter/{type_choice}")
async def filter_gender_pokemon_by_type(gender_choice: str, type_choice: str):
    # First get the gender-specific pokemon
    gender_url = api_url_build("gender", gender_choice.lower())
    async with httpx.AsyncClient() as client:
        response = await client.get(gender_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch gender data"}

        gender_data = response.json()
        pokemon_entries = gender_data.get("pokemon_species_details", [])

        # Get all pokemon for this gender first
        pokemon_list = []
        for entry in pokemon_entries[:20]:  # Limit to 20 for speed
            species_name = entry["pokemon_species"]["name"]
            pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
            
            pokemon_data = await fetch_pokemon_data(pokemon_url)
            if pokemon_data:
                pokemon_list.append(pokemon_data)

        # Now filter the pokemon_list by type
        filtered_list = [
            pokemon for pokemon in pokemon_list 
            if type_choice.lower() in pokemon["types"]
        ]

        return filtered_list

@app.get("/available-types/{gender_choice}")
async def get_available_types(gender_choice: str):
    # First get the gender-specific pokemon
    gender_url = api_url_build("gender", gender_choice.lower())
    async with httpx.AsyncClient() as client:
        response = await client.get(gender_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch gender data"}

        gender_data = response.json()
        pokemon_entries = gender_data.get("pokemon_species_details", [])

        # Get all pokemon for this gender
        available_types = set()
        for entry in pokemon_entries[:20]:  # Limit to 20 for speed
            species_name = entry["pokemon_species"]["name"]
            pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
            
            pokemon_data = await fetch_pokemon_data(pokemon_url)
            if pokemon_data:
                available_types.update(pokemon_data["types"])

        return list(available_types)

@app.get("/pokemon-roles/{gender_choice}")
async def get_pokemon_roles(gender_choice: str):
    """Get Pokemon categorized by battle roles for a specific gender."""
    gender_url = api_url_build("gender", gender_choice.lower())
    
    async with httpx.AsyncClient() as client:
        response = await client.get(gender_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch gender data"}

        gender_data = response.json()
        pokemon_entries = gender_data.get("pokemon_species_details", [])

        role_categories = {
            "Tank": [],
            "Attacker": [],
            "Support": [],
            "Speedster": []
        }

        # Limit to 20 Pokemon for performance
        for entry in pokemon_entries[:20]:
            species_name = entry["pokemon_species"]["name"]
            pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
            
            pokemon_data = await fetch_pokemon_data(pokemon_url)
            if pokemon_data:
                # Now categorize_pokemon_role is called as a regular function
                role = categorize_pokemon_role(pokemon_data["stats"])
                role_categories[role].append({
                    "name": pokemon_data["name"],
                    "sprite": pokemon_data["sprite"],
                    "types": pokemon_data["types"],
                    "stats": pokemon_data["stats"]
                })

        return role_categories

@app.get("/available-abilities/{type_choice}")
async def get_available_abilities(type_choice: str):
    """Get all available abilities for Pokemon of a specific type."""
    type_url = api_url_build("type", type_choice.lower())
    
    async with httpx.AsyncClient() as client:
        response = await client.get(type_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch type data"}
            
        type_data = response.json()
        pokemon_entries = type_data.get("pokemon", [])

        available_abilities = set()
        for entry in pokemon_entries[:20]:  # Limit to 20 for speed
            pokemon_url = entry["pokemon"]["url"]
            pokemon_data = await fetch_pokemon_data(pokemon_url)
            if pokemon_data:
                available_abilities.update(pokemon_data["abilities"])

        return list(available_abilities)

@app.get("/pokemon-by-type/{type_choice}/filter/{ability}")
async def filter_type_pokemon_by_ability(type_choice: str, ability: str):
    """Filter Pokemon of a specific type by ability."""
    type_url = api_url_build("type", type_choice.lower())
    
    async with httpx.AsyncClient() as client:
        response = await client.get(type_url)
        if response.status_code != 200:
            return {"error": "Failed to fetch type data"}
            
        type_data = response.json()
        pokemon_entries = type_data.get("pokemon", [])

        filtered_pokemon = []
        for entry in pokemon_entries[:20]:  # Limit to 20 for speed
            pokemon_url = entry["pokemon"]["url"]
            pokemon_data = await fetch_pokemon_data(pokemon_url)
            if pokemon_data and ability.lower() in [a.lower() for a in pokemon_data["abilities"]]:
                filtered_pokemon.append(pokemon_data)

        return filtered_pokemon
    
