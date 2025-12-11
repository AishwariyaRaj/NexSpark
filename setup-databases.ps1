# PowerShell script for Windows users

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Detect the PostgreSQL username from container environment
Write-Host "Step 1: Detecting PostgreSQL username from container..." -ForegroundColor Yellow

$envOutput = docker exec postgres env 2>$null
$postgresUserLine = $envOutput | Select-String -Pattern "POSTGRES_USER="

if ($postgresUserLine) {
    $POSTGRES_USER = ($postgresUserLine -split "=")[1].Trim()
} else {
    Write-Host "POSTGRES_USER not found in environment, checking docker inspect..." -ForegroundColor Yellow
    $inspectOutput = docker inspect postgres --format '{{range .Config.Env}}{{println .}}{{end}}' 2>$null
    $postgresUserLine = $inspectOutput | Select-String -Pattern "POSTGRES_USER="
    
    if ($postgresUserLine) {
        $POSTGRES_USER = ($postgresUserLine -split "=")[1].Trim()
    } else {
        Write-Host "WARNING: Could not detect username, defaulting to 'postgres'" -ForegroundColor Red
        $POSTGRES_USER = "postgres"
    }
}

# Step 2: Print detected username
Write-Host "✓ Detected PostgreSQL Username: $POSTGRES_USER" -ForegroundColor Green
Write-Host ""

# Step 3: Verify connection
Write-Host "Step 2: Verifying connection to PostgreSQL..." -ForegroundColor Yellow
$connectionTest = docker exec postgres psql -U $POSTGRES_USER -c "SELECT version();" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully connected to PostgreSQL" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✗ Failed to connect to PostgreSQL" -ForegroundColor Red
    Write-Host "Please check if the container is running: docker ps | findstr postgres" -ForegroundColor Yellow
    exit 1
}

# Step 4: Create databases
Write-Host "Step 3: Creating databases..." -ForegroundColor Yellow
$databases = @("auth_db", "booking_db", "availability_db", "payment_db", "notification_db")

foreach ($db in $databases) {
    Write-Host "Creating database: $db... " -NoNewline
    
    # Check if database already exists
    $dbExists = docker exec postgres psql -U $POSTGRES_USER -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" 2>$null
    
    if ($dbExists -eq "1") {
        Write-Host "✓ Already exists (skipping)" -ForegroundColor Yellow
    } else {
        # Create the database
        $createResult = docker exec postgres psql -U $POSTGRES_USER -c "CREATE DATABASE $db;" 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Created successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Listing all databases:" -ForegroundColor Yellow
docker exec postgres psql -U $POSTGRES_USER -c "\l"
Write-Host ""
Write-Host "Connection string format:" -ForegroundColor Yellow
Write-Host "jdbc:postgresql://localhost:5432/<database_name>?user=$POSTGRES_USER&password=<your_password>" -ForegroundColor White
