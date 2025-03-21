# Poke-Flow

A Pokemon exploration application built with Next.js and FastAPI.

## Project Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a Python virtual environment:
```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install the required Python packages:
```bash
# On Windows
pip install -r requirements.txt

# On macOS/Linux
pip3 install -r requirements.txt
```

4. Start the FastAPI server:
```bash
fastapi dev main.py
```

The backend API will be running at `http://127.0.0.1:8000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install the required Node.js dependencies:
```bash
npm install
```

3. Start the Next.js development server:
```bash
npm run dev
```

The frontend application will be running at `http://localhost:3000`

## Project Structure

- `/backend` - FastAPI backend server
  - `main.py` - Main application entry point
  - `helper_functions.py` - Utility functions
  - `common.py` - Shared constants and helpers
  - `requirements.txt` - Python dependencies

- `/frontend` - Next.js frontend application
  - `/src/app` - Application routes and pages
  - `/src/components` - Reusable React components
  - `/src/lib` - Utility functions and services
  - `/public` - Static assets

## Available Scripts

### Backend

- Start the server: `fastapi dev main.py`

### Frontend

- Development server: `npm run dev`
- Build application: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`

## Technologies Used

- **Frontend**:
  - Next.js 15.2
  - React 19
  - TypeScript
  - Tailwind CSS

- **Backend**:
  - FastAPI
  - Python 3
  - HTTPX for async HTTP requests

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PokeAPI Documentation](https://pokeapi.co/docs/v2)
