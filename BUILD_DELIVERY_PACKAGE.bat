@echo off
title Building Deployment Package...
color 0B
cls

echo.
echo  =====================================================
echo   HARSH DIAGNOSTIC - BUILD DELIVERY PACKAGE
echo   (Run this on YOUR developer laptop before delivery)
echo  =====================================================
echo.

set DEPLOY_DIR=%~dp0deployment
set OUTPUT_DIR=%~dp0DELIVERY_PACKAGE

:: ── Step 1: Build React app ────────────────────────────────────────────────
echo  [1/4] Building React frontend...
cd /d "%~dp0client"
call npm run build
if %errorlevel% neq 0 (
    echo  [ERROR] React build failed! Fix errors before packaging.
    pause
    exit /b 1
)
echo  [OK] React built successfully.

echo  [2/4] Obfuscating server source code (protecting your IP)...
cd /d "%~dp0server"
call node obfuscate.js
if %errorlevel% neq 0 (
    echo  [ERROR] Obfuscation failed!
    pause
    exit /b 1
)
echo  [OK] Server code protected.

:: ── Step 3: Prepare delivery folder ───────────────────────────────────────────────
echo  [3/4] Preparing delivery folder...
if exist "%OUTPUT_DIR%" rd /S /Q "%OUTPUT_DIR%"
mkdir "%OUTPUT_DIR%"
mkdir "%OUTPUT_DIR%\software\client\dist"
mkdir "%OUTPUT_DIR%\software\server"

:: Copy batch files
copy "%DEPLOY_DIR%\1_INSTALL.bat"       "%OUTPUT_DIR%\1_INSTALL.bat"
copy "%DEPLOY_DIR%\START.bat"           "%OUTPUT_DIR%\START.bat"
copy "%DEPLOY_DIR%\2_UPDATE.bat"        "%OUTPUT_DIR%\2_UPDATE.bat"
copy "%DEPLOY_DIR%\UPDATE_EXCLUDE.txt"  "%OUTPUT_DIR%\UPDATE_EXCLUDE.txt"
copy "%DEPLOY_DIR%\run-server-hidden.vbs" "%OUTPUT_DIR%\run-server-hidden.vbs"

:: Copy React build
xcopy /E /Y /I "%~dp0client\dist" "%OUTPUT_DIR%\software\client\dist"

:: Copy OBFUSCATED server code (not the original source!)
xcopy /E /Y /I "%~dp0server\dist-obfuscated" "%OUTPUT_DIR%\software\server"

:: Copy pre-configured .env
copy "%DEPLOY_DIR%\software\server\.env" "%OUTPUT_DIR%\software\server\.env"

echo  [OK] Files assembled.

:: ── Step 3: Done ──────────────────────────────────────────────────────────
echo  [3/3] Package ready!
echo.
echo  =====================================================
echo   DELIVERY PACKAGE CREATED!
echo   Location: %OUTPUT_DIR%
echo.
echo   ZIP this folder and send it to the client.
echo   It is approximately 15-20 MB in size.
echo  =====================================================
echo.

:: Open the output folder
explorer "%OUTPUT_DIR%"
pause
