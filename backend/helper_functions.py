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
            }
        return {}
