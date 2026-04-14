@echo off
title Harsh Diagnostic System - First Time Setup
color 0A
cls

echo.
echo  =====================================================
echo   HARSH DIAGNOSTIC SYSTEM - INSTALLATION WIZARD
echo  =====================================================
echo.

:: ── Step 1: Check Node.js ──────────────────────────────────────────────────
echo  [1/5] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] Node.js is NOT installed on this computer!
    echo  Opening the download page now...
    echo  Please install Node.js LTS version and run this setup again.
    echo.
    pause
    start https://nodejs.org/en/download
    exit /b 1
)
echo  [OK] Node.js found.

:: ── Step 2: Check MongoDB ──────────────────────────────────────────────────
echo  [2/5] Checking MongoDB installation...
sc query MongoDB >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] MongoDB is NOT installed or not running as a service!
    echo  Opening the download page now...
    echo  Please install MongoDB Community Server and run this setup again.
    echo  IMPORTANT: During MongoDB install, check the option "Install MongoDB as a Service"
    echo.
    pause
    start https://www.mongodb.com/try/download/community
    exit /b 1
)
echo  [OK] MongoDB service found.

:: ── Step 3: Install Node packages ─────────────────────────────────────────
echo  [3/5] Installing server packages (this may take a minute)...
cd /d "%~dp0software\server"
call npm install --omit=dev >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Failed to install packages. Check your internet connection.
    pause
    exit /b 1
)
echo  [OK] Server packages installed successfully.

:: ── Step 4: Register server to start silently on Windows startup ───────────
echo  [4/5] Registering background service (no windows will appear)...
set VBS_PATH=%~dp0run-server-hidden.vbs
schtasks /create /tn "HarshDiagnosticServer" /tr "wscript.exe \"%VBS_PATH%\"" /sc onlogon /rl HIGHEST /f >nul 2>nul
echo  [OK] Server registered as silent background service.

:: ── Step 5: Create Desktop shortcut ───────────────────────────────────────
echo  [5/5] Creating Desktop shortcut...
set BAT_PATH=%~dp0START.bat
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $desktop = [Environment]::GetFolderPath('Desktop'); $s = $ws.CreateShortcut($desktop + '\Harsh Diagnostic System.lnk'); $s.TargetPath = '%BAT_PATH%'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'shell32.dll,44'; $s.Description = 'Harsh Diagnostic System'; $s.Save()"
echo  [OK] Shortcut created on Desktop.

echo.
echo  =====================================================
echo   INSTALLATION COMPLETE!
echo  =====================================================
echo.
echo  Double-click "Harsh Diagnostic System" on your Desktop
echo  to launch the software. No other windows will appear.
echo.
echo  The server starts automatically every time Windows starts.
echo.
pause

