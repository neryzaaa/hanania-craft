@echo off
echo ========================================================
echo   Menjalankan Hanania Project (Backend & Frontend)
echo ========================================================

start "Hanania Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
start "Hanania Frontend (Vite React)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Backend:  http://localhost:8000 (API & Docs: http://localhost:8000/docs)
echo Frontend: http://localhost:5173
echo.
echo Kedua server telah dijalankan di jendela terpisah!
echo.
pause

