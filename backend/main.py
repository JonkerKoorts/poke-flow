from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
from .common import api_url_build
from backend.helper_functions import (
    fetch_pokemon_data,
    fetch_all_pokemon_of_type,
    categorize_pokemon_role
)
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import print as rprint
import random
from datetime import datetime

console = Console()

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
    console.rule(f"[bold blue]Fetching Pokemon by Gender: {gender_choice}")
    
    gender_url = api_url_build("gender", gender_choice.lower())
    console.print(f"[dim]API URL: {gender_url}[/dim]")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(gender_url)
        if response.status_code != 200:
            console.print("[bold red]Error:[/bold red] Failed to fetch gender data")
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
    console.rule(f"[bold green]Fetching Pokemon by Type: {type_choice}")
    
    type_url = api_url_build("type", type_choice.lower())
    console.print(f"[dim]API URL: {type_url}[/dim]")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(type_url)
        if response.status_code != 200:
            console.print("[bold red]Error:[/bold red] Failed to fetch type data")
            return {"error": "Failed to fetch type data"}
            
        type_data = response.json()
        pokemon_entries = type_data.get("pokemon", [])

        # Create a table for displaying Pokemon data
        table = Table(title=f"Pokemon of Type: {type_choice}")
        table.add_column("Name", style="cyan")
        table.add_column("Types", style="green")
        table.add_column("Abilities", style="yellow")

        pokemon_list = []
        with console.status("[bold green]Fetching Pokemon details...") as status:
            for entry in pokemon_entries[:20]:
                species_name = entry["pokemon"]["name"]
                pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
                
                pokemon_data = await fetch_pokemon_data(pokemon_url)
                if pokemon_data:
                    pokemon_list.append(pokemon_data)
                    table.add_row(
                        pokemon_data["name"],
                        ", ".join(pokemon_data["types"]),
                        ", ".join(pokemon_data["abilities"])
                    )

        console.print(table)
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
    console.rule(f"[bold magenta]Categorizing Pokemon Roles for Gender: {gender_choice}")
    
    gender_url = api_url_build("gender", gender_choice.lower())
    console.print(f"[dim]API URL: {gender_url}[/dim]")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(gender_url)
        if response.status_code != 200:
            console.print("[bold red]Error:[/bold red] Failed to fetch gender data")
            return {"error": "Failed to fetch gender data"}

        gender_data = response.json()
        pokemon_entries = gender_data.get("pokemon_species_details", [])

        role_categories = {
            "Tank": [],
            "Attacker": [],
            "Support": [],
            "Speedster": []
        }

        with console.status("[bold green]Analyzing Pokemon roles...") as status:
            for entry in pokemon_entries[:20]:
                species_name = entry["pokemon_species"]["name"]
                pokemon_url = f"https://pokeapi.co/api/v2/pokemon/{species_name}"
                
                pokemon_data = await fetch_pokemon_data(pokemon_url)
                if pokemon_data:
                    role = categorize_pokemon_role(pokemon_data["stats"])
                    role_categories[role].append({
                        "name": pokemon_data["name"],
                        "sprite": pokemon_data["sprite"],
                        "types": pokemon_data["types"],
                        "stats": pokemon_data["stats"]
                    })
                    console.print(f"[dim]Categorized {pokemon_data['name']} as: [bold]{role}[/bold][/dim]")

        # Display role distribution
        for role, pokemon_list in role_categories.items():
            panel = Panel(
                f"Total Pokemon: {len(pokemon_list)}\n" +
                "\n".join([f"• {p['name']}" for p in pokemon_list[:5]]) +
                ("\n..." if len(pokemon_list) > 5 else ""),
                title=f"[bold]{role}[/bold]",
                border_style={"Tank": "blue", "Attacker": "red", "Support": "green", "Speedster": "yellow"}[role]
            )
            console.print(panel)

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

@app.get("/pokemon-by-time")
async def get_pokemon_by_time():
    """Get Pokemon based on the current time of day with optimized batch processing."""
    try:
        console.rule("[bold purple]Fetching Time-based Random Pokemon")
        
        # Get time period using dict mapping for O(1) lookup
        time_periods = {
            range(6, 12): "morning",
            range(12, 18): "day",
            range(18, 24): "evening",
            range(0, 6): "night"
        }
        current_hour = datetime.now().hour
        time_of_day = next(period for hours, period in time_periods.items() if current_hour in hours)
        
        console.print(f"[dim]Current time period: {time_of_day}[/dim]")
        
        # Map time periods to Pokemon types
        type_pools = {
            "morning": ["normal", "flying", "fairy"],
            "day": ["fire", "grass", "ground"],
            "evening": ["fighting", "poison", "psychic"],
            "night": ["dark", "ghost", "dragon"]
        }
        
        selected_type = random.choice(type_pools[time_of_day])
        pokemon_list = await fetch_all_pokemon_of_type(selected_type, limit=20)
        
        if not pokemon_list:
            console.print("[bold red]Warning:[/bold red] No Pokemon data fetched, using fallback type")
            # Try another type as fallback
            fallback_type = random.choice(type_pools[time_of_day])
            pokemon_list = await fetch_all_pokemon_of_type(fallback_type, limit=20)
        
        # Add time period to each Pokemon
        for pokemon in pokemon_list:
            pokemon["time_period"] = time_of_day
        
        result = {
            "time_period": time_of_day,
            "pokemon": pokemon_list
        }
        
        # Validate response data
        if not result["pokemon"]:
            raise ValueError("No Pokemon data available")
            
        return result
        
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {str(e)}")
        # Return a valid response structure even in case of error
        return {
            "time_period": "day",  # fallback default
            "pokemon": []
        }
    
