# Poke-Flow 🌟

A Pokemon exploration application built with Next.js and FastAPI.

```ascii
                                   ,'\
    _.----.        ____         ,'  _\   ___    ___     ____
_,-'       `.     |    |  /`.   \,-'    |   \  /   |   |    \  |`.
\      __    \    '-.  | /   `.  ___    |    \/    |   '-.   \ |  |
 \.    \ \   |  __  |  |/    ,','_  `.  |          | __  |    \|  |
   \    \/   /,' _`.|      ,' / / / /   |          ,' _`.|     |  |
    \     ,-'/  /   \    ,'   | \/ / ,`.|         /  /   \  |     |
     \    \ |   \_/  |   `-.  \    `'  /|  |    ||   \_/  | |\    |
      \    \ \      /       `-.`.___,-' |  |\  /| \      /  | |   |
       \    \ `.__,'|  |`-._    `|      |__| \/ |  `.__,'|  | |   |
        \_.-'       |__|    `-._ |              '-.|     '-.| |   |
                                `'                            '-._|
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend & set up environment:**
   ```bash
   cd backend
   
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server:**
   ```bash
   fastapi dev main.py
   ```
   🌐 Backend will be running at `http://127.0.0.1:8000`

### Frontend Setup

1. **Set up frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   🎨 Frontend will be running at `http://localhost:3000`

## 📊 Terminal Logging System

The backend uses Rich for beautiful terminal output:

```
╭──── Fetching Pokemon by Type: fire ─────╮
│ [dim]API URL: https://pokeapi.co/...    │
│ ✓ Successfully fetched: Charizard       │
│ ✓ Successfully fetched: Arcanine        │
│                                         │
│ Role scores:                            │
│   [bold blue]Attacker:[/bold blue] 92.5    │
│   [dim]Tank:[/dim] 75.0                    │
│   [dim]Support:[/dim] 65.8                 │
╰─────────────────────────────────────────╯
```

### Logging Features:
- 🎨 Color-coded output for different Pokemon types
- ✨ Progress indicators for API requests
- 📊 Detailed role scoring breakdowns
- ⚠️ Clear error messages with traceback
- 🔄 Real-time request status updates

## 🗂️ Project Structure

```
poke-flow/
├── backend/
│   ├── main.py           # FastAPI server & routes
│   ├── helper_functions.py# Pokemon data processing
│   ├── common.py         # Shared utilities
│   └── requirements.txt  # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── app/         # Next.js pages
    │   ├── components/  # React components
    │   └── lib/        # Utility functions
    └── public/         # Static assets
```

## 🛠️ Available Scripts

### Backend Commands
```bash
fastapi dev main.py     # Start development server
```

### Frontend Commands
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run linter
```

## 🔧 Technologies

### Frontend
- ⚛️ Next.js 15.2
- 📱 React 19
- 🔷 TypeScript
- 🎨 Tailwind CSS

### Backend
- 🚀 FastAPI
- 🐍 Python 3
- 🔄 HTTPX for async requests
- 🎨 Rich for terminal styling

## 🔗 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [PokeAPI Docs](https://pokeapi.co/docs/v2)

## 🎮 Features

- 🔍 Filter Pokemon by gender and type
- 💪 Role-based Pokemon categorization
- 🎯 Ability-based filtering
- 📊 Detailed Pokemon statistics
