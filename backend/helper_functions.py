import httpx
import logging
import asyncio
import random
from rich.console import Console
from rich import print as rprint
import json
import subprocess

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
    Categorizes a Pokemon into a role using the Zig executable.
    
    Args:
        stats (dict): Raw Pokemon stats from the API
    
    Returns:
        str: The determined role ('Tank', 'Attacker', 'Speedster', or 'Support')
    """
    try:
        # Transform the stats into the format expected by the Zig program
        formatted_stats = []
        for stat_name, base_stat in stats.items():
            formatted_stats.append({
                "base_stat": base_stat,
                "effort": 0,
                "stat": {
                    "name": stat_name,
                    "url": f"https://pokeapi.co/api/v2/stat/{stat_name}"
                }
            })
        
        stats_json = json.dumps({"stats": formatted_stats})
        
        result = subprocess.run(
            ["./pokemon_categorizer"],
            input=stats_json.encode(),
            capture_output=True,
            check=True
        )
        role = result.stdout.decode().strip()
        
        console.print(f"[dim]Role determined by Zig: [bold]{role}[/bold][/dim]")
        return role
        
    except subprocess.CalledProcessError as e:
        console.print(f"[bold red]Error:[/bold red] Zig categorizer failed: {str(e)}")
        return "Support"

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
