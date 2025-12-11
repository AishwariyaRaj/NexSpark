#!/bin/bash
# PostgreSQL Database Setup Script for Linux/Mac

echo "========================================"
echo "PostgreSQL Database Setup Script"
echo "========================================"
echo ""

# Step 1: Detect the PostgreSQL username from container environment
echo "Step 1: Detecting PostgreSQL username from container..."
POSTGRES_USER=$(docker exec postgres env 2>/dev/null | grep POSTGRES_USER | cut -d'=' -f2 | tr -d '\r')

# If POSTGRES_USER is not set, try to get it from docker inspect
if [ -z "$POSTGRES_USER" ]; then
    echo "POSTGRES_USER not found in environment, checking docker inspect..."
    POSTGRES_USER=$(docker inspect postgres --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null | grep POSTGRES_USER | cut -d'=' -f2)
fi

# If still not found, default to 'postgres'
if [ -z "$POSTGRES_USER" ]; then
    echo "WARNING: Could not detect username, defaulting to 'postgres'"
    POSTGRES_USER="postgres"
fi

# Step 2: Print detected username
echo "✓ Detected PostgreSQL Username: $POSTGRES_USER"
echo ""

# Step 3: Verify connection
echo "Step 2: Verifying connection to PostgreSQL..."
if docker exec postgres psql -U "$POSTGRES_USER" -c "SELECT version();" > /dev/null 2>&1; then
    echo "✓ Successfully connected to PostgreSQL"
    echo ""
else
    echo "✗ Failed to connect to PostgreSQL"
    echo "Please check if the container is running: docker ps | grep postgres"
    exit 1
fi

# Step 4: Create databases
echo "Step 3: Creating databases..."
databases=("auth_db" "booking_db" "availability_db" "payment_db" "notification_db")

for db in "${databases[@]}"; do
    echo -n "Creating database: $db... "
    
    # Check if database already exists
    DB_EXISTS=$(docker exec postgres psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$db'" 2>/dev/null)
    
    if [ "$DB_EXISTS" = "1" ]; then
        echo "✓ Already exists (skipping)"
    else
        # Create the database
        if docker exec postgres psql -U "$POSTGRES_USER" -c "CREATE DATABASE $db;" > /dev/null 2>&1; then
            echo "✓ Created successfully"
        else
            echo "✗ Failed to create"
        fi
    fi
done

echo ""
echo "========================================"
echo "Database Setup Complete!"
echo "========================================"
echo ""
echo "Listing all databases:"
docker exec postgres psql -U "$POSTGRES_USER" -c "\l" | grep -E "(auth_db|booking_db|availability_db|payment_db|notification_db|Name)"
echo ""
echo "Connection string format:"
echo "jdbc:postgresql://localhost:5432/<database_name>?user=$POSTGRES_USER&password=<your_password>"
