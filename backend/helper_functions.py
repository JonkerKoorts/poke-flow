import httpx
import logging
import asyncio
import random
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
    """
    Categorizes a Pokemon into a role based on its base stats using weighted calculations.
    
    Args:
        stats (dict): Dictionary containing the Pokemon's base stats
                     (hp, attack, defense, special-attack, special-defense, speed)
    
    Returns:
        str: The determined role ('Tank', 'Attacker', 'Speedster', or 'Support')
    
    Performance Notes:
        - Uses weighted multipliers instead of averages to reduce floating-point operations
        - Avoids redundant dictionary lookups by using .get() with default values
        - Employs single-pass calculation for each role to minimize iterations
    """
    
    # Calculate role scores using weighted stat contributions
    # Weights are normalized (sum to 1.0) for each role to ensure balanced scoring
    role_scores = {
        # Tanks prioritize HP and defense stats
        # - HP (40%): Primary survival metric
        # - Defense (35%): Physical bulk
        # - Sp. Defense (25%): Special bulk
        "Tank": stats.get("hp", 0) * 0.4 + 
                stats.get("defense", 0) * 0.35 + 
                stats.get("special-defense", 0) * 0.25,
        
        # Attackers focus on offensive stats
        # - Attack (60%): Main damage output
        # - Sp. Attack (40%): Secondary damage source
        "Attacker": stats.get("attack", 0) * 0.6 + 
                   stats.get("special-attack", 0) * 0.4,
        
        # Speedsters primarily need speed, with minor attack consideration
        # - Speed (80%): Critical for quick strikes
        # - Combined attacks (20%): Moderate damage potential
        "Speedster": stats.get("speed", 0) * 0.8 + 
                    (stats.get("attack", 0) + stats.get("special-attack", 0)) * 0.1,
        
        # Support roles need balanced defensive stats
        # - Sp. Defense (40%): Important for survival
        # - HP (30%): Base survivability
        # - Defense (30%): Physical protection
        "Support": stats.get("special-defense", 0) * 0.4 + 
                  stats.get("hp", 0) * 0.3 + 
                  stats.get("defense", 0) * 0.3
    }
    
    # Determine the highest scoring role
    # Using max() with key function is more efficient than sorting or manual comparison
    role = max(role_scores, key=role_scores.get)
    
    # Display role scores for debugging and transparency
    # Uses Rich library's console for formatted output
    console.print("[dim]Role scores:[/dim]")
    for role_name, score in role_scores.items():
        # Highlight the winning role in blue, others dimmed
        console.print(
            f"  [bold {'blue' if role_name == role else 'dim'}]{role_name}:"
            f"[/bold {'blue' if role_name == role else 'dim'}] {score:.2f}"
        )
    
    return role

async def fetch_pokemon_batch(urls: list[str], time_period: str = None) -> list[dict]:
    """
    Efficiently fetches multiple Pokemon data in parallel using asyncio.gather
    
    Args:
        urls: List of Pokemon API URLs to fetch
        time_period: Optional time period to add to each Pokemon's data
        
    Returns:
        List of transformed Pokemon data dictionaries
    """
    async with httpx.AsyncClient() as client:
        # Create tasks for all URLs
        tasks = []
        for url in urls:
            tasks.append(
                client.get(url)
            )
        
        # Execute all requests concurrently
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        pokemon_list = []
        for response in responses:
            if isinstance(response, Exception) or response.status_code != 200:
                continue
                
            try:
                data = response.json()
                pokemon_data = {
                    "name": data["name"],
                    "types": [t["type"]["name"] for t in data["types"]],
                    "abilities": [a["ability"]["name"] for a in data["abilities"]],
                    "stats": {s["stat"]["name"]: s["base_stat"] for s in data["stats"]},
                    "sprite": data["sprites"]["front_default"]
                }
                
                if time_period:
                    pokemon_data["time_period"] = time_period
                    
                pokemon_list.append(pokemon_data)
                console.print(f"[green]✓[/green] Fetched: [bold]{data['name']}[/bold]")
            except Exception as e:
                console.print(f"[red]✗[/red] Failed to process Pokemon data: {str(e)}")
                
        return pokemon_list

async def fetch_all_pokemon_of_type(type_name: str, limit: int = 20) -> list[dict]:
    """
    Efficiently fetches all Pokemon of a specific type in a single request.
    
    Args:
        type_name: The type of Pokemon to fetch
        limit: Maximum number of Pokemon to return
        
    Returns:
        List of Pokemon data dictionaries
    """
    try:
        # First get the type data which includes all Pokemon of that type
        type_url = f"https://pokeapi.co/api/v2/type/{type_name}"
        
        async with httpx.AsyncClient() as client:
            console.print(f"[dim]Fetching Pokemon of type: {type_name}[/dim]")
            
            # Get all Pokemon of this type
            type_response = await client.get(type_url)
            type_response.raise_for_status()
            type_data = type_response.json()
            
            # Randomly select Pokemon entries up to the limit
            pokemon_entries = type_data.get("pokemon", [])
            selected_entries = random.sample(pokemon_entries, min(limit, len(pokemon_entries)))
            
            # Create URLs for batch request
            pokemon_urls = [entry["pokemon"]["url"] for entry in selected_entries]
            
            # Fetch all Pokemon data in parallel
            tasks = [client.get(url) for url in pokemon_urls]
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            pokemon_list = []
            for response in responses:
                if isinstance(response, Exception) or response.status_code != 200:
                    continue
                    
                try:
                    data = response.json()
                    pokemon_data = {
                        "name": data["name"],
                        "types": [t["type"]["name"] for t in data["types"]],
                        "abilities": [a["ability"]["name"] for a in data["abilities"]],
                        "stats": {s["stat"]["name"]: s["base_stat"] for s in data["stats"]},
                        "sprite": data["sprites"]["front_default"]
                    }
                    pokemon_list.append(pokemon_data)
                    console.print(f"[green]✓[/green] Processed: [bold]{data['name']}[/bold]")
                except Exception as e:
                    console.print(f"[red]✗[/red] Failed to process Pokemon data: {str(e)}")
            
            return pokemon_list
            
    except httpx.HTTPError as e:
        console.print(f"[bold red]Error:[/bold red] Failed to fetch Pokemon data: {str(e)}")
        return []

async def fetch_pokemon_list(offset: int = 0, limit: int = 20) -> list[dict]:
    """
    Fetches a list of Pokemon in a single request using offset and limit.
    
    Args:
        offset: Starting index
        limit: Maximum number of Pokemon to return
        
    Returns:
        List of Pokemon data dictionaries
    """
    try:
        base_url = "https://pokeapi.co/api/v2/pokemon"
        async with httpx.AsyncClient() as client:
            # Get Pokemon list with limit and offset
            list_url = f"{base_url}?offset={offset}&limit={limit}"
            response = await client.get(list_url)
            response.raise_for_status()
            
            pokemon_list = response.json()["results"]
            
            # Fetch all Pokemon data in parallel
            tasks = [client.get(pokemon["url"]) for pokemon in pokemon_list]
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Process results
            processed_pokemon = []
            for response in responses:
                if isinstance(response, Exception) or response.status_code != 200:
                    continue
                    
                try:
                    data = response.json()
                    pokemon_data = {
                        "name": data["name"],
                        "types": [t["type"]["name"] for t in data["types"]],
                        "abilities": [a["ability"]["name"] for a in data["abilities"]],
                        "stats": {s["stat"]["name"]: s["base_stat"] for s in data["stats"]},
                        "sprite": data["sprites"]["front_default"]
                    }
                    processed_pokemon.append(pokemon_data)
                    console.print(f"[green]✓[/green] Processed: [bold]{data['name']}[/bold]")
                except Exception as e:
                    console.print(f"[red]✗[/red] Failed to process Pokemon data: {str(e)}")
            
            return processed_pokemon
            
    except httpx.HTTPError as e:
        console.print(f"[bold red]Error:[/bold red] Failed to fetch Pokemon list: {str(e)}")
        return []
