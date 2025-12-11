@echo off
echo ========================================
echo Starting Booking Service (Port 8081)
echo ========================================
echo.
echo Setting JVM memory options...
set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC

echo Starting Booking Service...
cd booking-service
mvn spring-boot:run

pause
