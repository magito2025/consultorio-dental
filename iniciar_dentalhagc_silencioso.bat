@echo off
cd /d C:\dentalhagc

:: 1) Lanza Vite sin ventana
wscript "servidor_oculto.vbs"

:: 2) Espera a que el puerto esté activo
:espera
timeout /t 2 >nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (start http://localhost:3000 & goto fin)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (start http://localhost:3001 & goto fin)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (start http://localhost:3002 & goto fin)
goto espera

:fin
:: 3) Cierra esta ventana
exit