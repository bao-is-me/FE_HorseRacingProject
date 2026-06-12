# FE Horse Racing Project

React/Vite frontend for the Horse Racing Tournament Management System.

## Run

```bash
cd "C:\Users\Admin\OneDrive\Máy tính\Group_SWP\FE_HorseRacingProject"
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Do not open `index.html` directly by double-clicking. Vite must serve the app so React modules can load.

## Backend API

By default the frontend calls:

```text
http://localhost:5035/api/Auth/login
http://localhost:5035/api/Auth/register
```

To change it, create `.env`:

```text
VITE_API_BASE_URL=http://localhost:5035
```
