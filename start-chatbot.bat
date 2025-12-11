@echo off
REM Start NexSpark Chatbot Service
echo Starting NexSpark Chatbot Service...
cd chatbot-service
start "Chatbot Service" cmd /k "npm start"
echo Chatbot service started on port 8086
timeout /t 2 >nul
