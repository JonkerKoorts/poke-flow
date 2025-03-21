import httpx
import logging

logger = logging.getLogger(__name__)

async def fetch_pokemon_data(pokemon_url: str) -> dict:
    """
    Fetch and transform Pokemon data from the PokeAPI.
    
    Args:
        pokemon_url (str): The API URL for the Pokemon
        
    Returns:
        dict: Transformed Pokemon data or empty dict if request fails
        
    Raises:
        HTTPException: If the API request fails
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(pokemon_url)
            response.raise_for_status()
            data = response.json()
            return {
                "name": data["name"],
                "types": [t["type"]["name"] for t in data["types"]],
                "abilities": [a["ability"]["name"] for a in data["abilities"]],
                "stats": {s["stat"]["name"]: s["base_stat"] for s in data["stats"]},
                "sprite": data["sprites"]["front_default"],     
            }
    except httpx.HTTPError as e:
        logger.error(f"Failed to fetch Pokemon data: {str(e)}")
        return {}

def categorize_pokemon_role(stats: dict) -> str:
    """
    Categorize Pokemon into battle roles based on their stats.
    Note: This is a synchronous function since it doesn't need to be async
    """
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
    
    return max(scores.items(), key=lambda x: x[1])[0]
