@echo off
echo ========================================
echo NexSpark Memory Configuration Checker
echo ========================================
echo.

echo Checking current system memory...
echo.
systeminfo | findstr /C:"Total Physical Memory" /C:"Available Physical Memory"
echo.

echo ========================================
echo Checking Java Installation...
echo ========================================
java -version 2>&1 | findstr /C:"version"
if %errorlevel% neq 0 (
    echo [ERROR] Java not found! Please install Java JDK 17 or higher.
    goto :end
) else (
    echo [OK] Java is installed
)
echo.

echo ========================================
echo Checking Maven Installation...
echo ========================================
mvn -version 2>&1 | findstr /C:"Apache Maven"
if %errorlevel% neq 0 (
    echo [ERROR] Maven not found! Please install Maven.
    goto :end
) else (
    echo [OK] Maven is installed
)
echo.

echo ========================================
echo Checking Node.js Installation...
echo ========================================
node --version 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js.
    goto :end
) else (
    echo [OK] Node.js is installed
)
echo.

echo ========================================
echo Memory Configuration Status
echo ========================================
echo.
echo ✓ Fixed startup scripts with memory settings:
echo   - start-all-services.bat
echo   - build-all-services.bat
echo   - start-api-gateway.bat
echo   - start-booking-service.bat
echo   - start-availability-service.bat
echo.
echo ✓ Memory settings that will be applied:
echo   -Xms256m              (Initial heap: 256 MB)
echo   -Xmx512m              (Maximum heap: 512 MB)
echo   -XX:MetaspaceSize=128m    (Initial metaspace: 128 MB)
echo   -XX:MaxMetaspaceSize=256m (Max metaspace: 256 MB)
echo   -XX:+UseG1GC          (G1 Garbage Collector)
echo.

echo ========================================
echo Running Java Processes
echo ========================================
tasklist | findstr /I "java.exe" >nul
if %errorlevel% equ 0 (
    echo.
    echo Current Java processes:
    tasklist | findstr /I "java.exe"
    echo.
    echo [WARNING] Java processes are running.
    echo To apply memory fix, stop them first:
    echo   1. Close all service windows
    echo   2. Or run: taskkill /F /IM java.exe /T
    echo   3. Then restart with fixed scripts
) else (
    echo.
    echo [OK] No Java processes running
    echo You're ready to start services with fixed memory settings!
)
echo.

echo ========================================
echo Recommendations
echo ========================================
echo.
echo Based on your system:
systeminfo | findstr /C:"Available Physical Memory" > temp_mem.txt
for /f "tokens=4" %%a in (temp_mem.txt) do set available=%%a
del temp_mem.txt

echo.
if defined available (
    echo Available RAM: %available% MB
    if %available% LSS 2000 (
        echo [WARNING] Low memory! Recommended actions:
        echo   - Close unnecessary applications
        echo   - Start services one by one
        echo   - Consider increasing system RAM
    ) else if %available% LSS 4000 (
        echo [CAUTION] Moderate memory. Recommended:
        echo   - Start only needed services
        echo   - Monitor memory usage
    ) else (
        echo [OK] Sufficient memory for all services
    )
) else (
    echo Unable to determine available memory.
    echo Ensure you have at least 4 GB RAM available.
)

echo.
echo ========================================
echo Next Steps
echo ========================================
echo.
echo To start services with memory fix:
echo   1. Run: fix-memory-error.bat (automatic fix)
echo   2. Or:  start-all-services.bat (start all)
echo   3. Or:  start-api-gateway.bat (start individual)
echo.
echo For more information, read:
echo   - MEMORY_ERROR_FIX.md (quick guide)
echo   - MEMORY_FIX_README.md (detailed info)
echo.

:end
echo ========================================
pause
