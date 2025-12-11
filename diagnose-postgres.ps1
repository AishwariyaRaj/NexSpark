# PowerShell PostgreSQL Connection Diagnostic Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Connection Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking if container is running..." -ForegroundColor Yellow
$containerRunning = docker ps --filter "name=postgres" --format "{{.Names}}" 2>$null

if (-not $containerRunning) {
    Write-Host "[FAIL] PostgreSQL container is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Starting container..." -ForegroundColor Yellow
    docker start postgres
    Write-Host "Waiting 10 seconds for PostgreSQL to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    Write-Host "[OK] Container is running: $containerRunning" -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 2: Checking container environment variables..." -ForegroundColor Yellow
docker exec postgres env | Select-String "POSTGRES"
Write-Host ""

Write-Host "Step 3: Checking PostgreSQL process status..." -ForegroundColor Yellow
$pgProcess = docker exec postgres ps aux 2>$null | Select-String "postgres"
if ($pgProcess) {
    Write-Host "[OK] PostgreSQL process is running" -ForegroundColor Green
} else {
    Write-Host "[WARN] PostgreSQL process not found - may still be initializing" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 4: Checking PostgreSQL logs (last 30 lines)..." -ForegroundColor Yellow
docker logs postgres --tail 30
Write-Host ""

Write-Host "Step 5: Testing connection methods..." -ForegroundColor Yellow
Write-Host ""

# Try with 'postgre' (detected username)
Write-Host "Trying connection with username 'postgre'..." -ForegroundColor Cyan
$result = docker exec postgres psql -U postgre -c "SELECT version();" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Connected with username: postgre" -ForegroundColor Green
    $POSTGRES_USER = "postgre"
    & "$PSScriptRoot\create-databases-helper.ps1" -Username $POSTGRES_USER
    exit 0
}
Write-Host "[FAIL] Could not connect with 'postgre'" -ForegroundColor Red
Write-Host ""

# Try with 'postgres' (default)
Write-Host "Trying connection with username 'postgres'..." -ForegroundColor Cyan
$result = docker exec postgres psql -U postgres -c "SELECT version();" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Connected with username: postgres" -ForegroundColor Green
    $POSTGRES_USER = "postgres"
    & "$PSScriptRoot\create-databases-helper.ps1" -Username $POSTGRES_USER
    exit 0
}
Write-Host "[FAIL] Could not connect with 'postgres'" -ForegroundColor Red
Write-Host ""

# Try listing databases without specific user
Write-Host "Trying to list databases without specifying user..." -ForegroundColor Cyan
docker exec postgres psql -l 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[INFO] Connection successful, checking available users..." -ForegroundColor Yellow
    docker exec postgres psql -c "\du"
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Red
Write-Host "PostgreSQL Connection Failed" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "Possible Issues:" -ForegroundColor Yellow
Write-Host "1. PostgreSQL is still initializing (wait 30-60 seconds)" -ForegroundColor White
Write-Host "2. Database needs initialization" -ForegroundColor White
Write-Host "3. Incorrect username/password" -ForegroundColor White
Write-Host ""
Write-Host "Recommendations:" -ForegroundColor Yellow
Write-Host "1. Wait a minute and try again" -ForegroundColor White
Write-Host "2. Check logs: docker logs postgres" -ForegroundColor White
Write-Host "3. Restart container: docker restart postgres" -ForegroundColor White
Write-Host "4. Recreate container with docker-compose down && docker-compose up -d" -ForegroundColor White
Write-Host ""
