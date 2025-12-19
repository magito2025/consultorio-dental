@echo off
cd /d C:\dentalhagc
echo Arrancando Vite...
start "Ventana Vite" cmd /k "npm run dev"
:espera
timeout /t 2 >nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    start http://192.168.43.31:3000
    goto fin
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    start http://192.168.43.31:3001
    goto fin
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    start http://192.168.43.31:3002
    goto fin
)
goto espera
:fin
:: 3) Cierra esta ventana
exit