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
