@echo off
echo ========================================
echo Starting API Gateway (Port 8080)
echo ========================================
echo.
echo Setting JVM memory options...
set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m -XX:+UseG1GC

echo Starting API Gateway...
cd api-gateway
mvn spring-boot:run

pause
