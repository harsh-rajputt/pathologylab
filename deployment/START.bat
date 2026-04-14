@echo off
title Harsh Diagnostic System - Starting...

:: Check if server is already running on port 5000
netstat -aon | find ":5000" | find "LISTENING" >nul 2>nul
if %errorlevel% equ 0 (
    :: Server already running - just open the browser
    start http://localhost:5000
    exit /b 0
)

:: Set production mode so Express serves the React frontend
set NODE_ENV=production

:: Start server silently via VBScript (no CMD window)
wscript.exe "%~dp0run-server-hidden.vbs"

:: Wait for server to boot
timeout /t 4 /nobreak >nul

:: Open browser
start http://localhost:5000

exit /b 0

