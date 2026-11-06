@echo off
cd /d "%~dp0"
where node >nul 2>nul
if not errorlevel 1 (
  start "" "http://127.0.0.1:4173"
  node server.mjs
  exit /b
)
where py >nul 2>nul
if not errorlevel 1 (
  start "" "http://127.0.0.1:4173"
  py -3 -m http.server 4173 --bind 127.0.0.1
  exit /b
)
start "" "index.html"
