@echo off
echo ========================================
echo Starting Availability Service (Port 8082)
echo ========================================
echo.
echo Setting JVM memory options...
set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC

echo Starting Availability Service...
cd availability-service
mvn spring-boot:run

pause
