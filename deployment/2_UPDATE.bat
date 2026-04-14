@echo off
title Harsh Diagnostic System - Software Update
color 0E
cls

echo.
echo  =====================================================
echo   HARSH DIAGNOSTIC SYSTEM - SOFTWARE UPDATER
echo  =====================================================
echo.
echo  This will update your software to the latest version.
echo  Your patient data and reports are SAFE.
echo  Only the software files will be updated.
echo.
echo  Press any key to start the update, or close this
echo  window to cancel.
echo.
pause

:: ── Step 1: Stop any running server ───────────────────────────────────────
echo.
echo  [1/3] Stopping any running server...
taskkill /f /im node.exe >nul 2>nul
timeout /t 2 /nobreak >nul
echo  [OK] Server stopped.

:: ── Step 2: Copy new software files ───────────────────────────────────────
echo  [2/3] Installing updated files...

:: The UPDATE folder is placed next to this bat by the developer
set UPDATE_SOURCE=%~dp0UPDATE_FILES

if not exist "%UPDATE_SOURCE%" (
    echo.
    echo  [ERROR] No update files found!
    echo  Please make sure the UPDATE_FILES folder is next to this file.
    echo.
    pause
    exit /b 1
)

:: Update server code (overwrites old files, keeps .env and node_modules)
xcopy /E /Y /I "%UPDATE_SOURCE%\server" "%~dp0software\server" /EXCLUDE:%~dp0UPDATE_EXCLUDE.txt >nul

:: Update client build (whole dist folder replaced)
rd /S /Q "%~dp0software\client\dist" >nul 2>nul
xcopy /E /Y /I "%UPDATE_SOURCE%\client\dist" "%~dp0software\client\dist" >nul

echo  [OK] Files updated.

:: ── Step 3: Install any new packages ──────────────────────────────────────
echo  [3/3] Checking for new server packages...
cd /d "%~dp0software\server"
call npm install --omit=dev >nul 2>nul
echo  [OK] Packages up to date.

echo.
echo  =====================================================
echo   UPDATE COMPLETE!
echo  =====================================================
echo.
echo  Double-click START.bat to launch the updated software.
echo.
pause
