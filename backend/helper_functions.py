import httpx

async def fetch_pokemon_data(pokemon_url: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(pokemon_url)
        if response.status_code == 200:
            data = response.json()
            return {
                "name": data["name"],
                "types": [t["type"]["name"] for t in data["types"]],
                "abilities": [a["ability"]["name"] for a in data["abilities"]],
                "stats": {s["stat"]["name"]: s["base_stat"] for s in data["stats"]},
                "sprite": data["sprites"]["front_default"],     
            }
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
