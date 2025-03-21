import httpx
import logging
from rich.console import Console
from rich import print as rprint

console = Console()
logger = logging.getLogger(__name__)

async def fetch_pokemon_data(pokemon_url: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            console.print(f"[dim]Fetching data for: {pokemon_url}[/dim]")
            response = await client.get(pokemon_url)
            response.raise_for_status()
            data = response.json()
            
            transformed_data = {
                "name": data["name"],
                "types": [t["type"]["name"] for t in data["types"]],
                "abilities": [a["ability"]["name"] for a in data["abilities"]],
                "stats": {s["stat"]["name"]: s["base_stat"] for s in data["stats"]},
                "sprite": data["sprites"]["front_default"],     
            }
            
            console.print(f"[green]✓[/green] Successfully fetched data for: [bold]{data['name']}[/bold]")
            return transformed_data
    except httpx.HTTPError as e:
        console.print(f"[bold red]Error:[/bold red] Failed to fetch Pokemon data: {str(e)}")
        return {}

def categorize_pokemon_role(stats: dict) -> str:
    # Extract relevant stats
    hp = stats.get("hp", 0)
    defense = stats.get("defense", 0)
    sp_defense = stats.get("special-defense", 0)
    attack = stats.get("attack", 0)
    sp_attack = stats.get("special-attack", 0)
    speed = stats.get("speed", 0)
    
    # Calculate aggregate scores for different roles
    tank_score = (hp + defense + sp_defense) / 3
    attack_score = (attack + sp_attack) / 2
    speed_score = speed
    support_score = (sp_defense + hp) / 2
    
    # Determine role based on highest score
    scores = {
        "Tank": tank_score,
        "Attacker": attack_score,
        "Speedster": speed_score,
        "Support": support_score
    }
    
    role = max(scores.items(), key=lambda x: x[1])[0]
    
    # Print score breakdown
    console.print("[dim]Role scores:[/dim]")
    for role_name, score in scores.items():
        color = "blue" if role_name == role else "dim"
        console.print(f"  [bold {color}]{role_name}:[/bold {color}] {score:.2f}")
    
    return role
