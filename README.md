# Monitoring – social tension charts

Простое full-stack-приложение на FastAPI + React (Vite) для визуализации социального напряжения в Сербии и Грузии.

## Структура проекта

```
.
├── backend          # FastAPI backend (Python)
│   ├── main.py      # приложение FastAPI
│   └── requirements.txt
└── frontend         # React + Vite (JavaScript)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## Запуск

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API будет доступен по адресу `http://localhost:8000/api/protests`.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install   # установит зависимости из package.json
npm run dev   # dev-сервер на http://localhost:5173
```

---