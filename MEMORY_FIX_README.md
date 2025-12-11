# Java Memory Error Fix

## Problem
```
insufficient memory for the Java Runtime Environment to continue
Native memory allocation (malloc) failed to allocate bytes
```

## Solution Applied

### 1. JVM Memory Settings Added
All Java services now start with optimized memory settings:

- **Initial Heap Size (Xms)**: 256 MB
- **Maximum Heap Size (Xmx)**: 512 MB  
- **Initial Metaspace**: 128 MB
- **Maximum Metaspace**: 256 MB
- **Garbage Collector**: G1GC (efficient for low memory)

### 2. Files Modified

✅ **start-all-services.bat** - All services start with memory options
✅ **build-all-services.bat** - Build process uses more memory (up to 1GB)

### 3. New Individual Start Scripts
Created for easier debugging:
- `start-api-gateway.bat`
- `start-booking-service.bat`
- `start-availability-service.bat`

### 4. Memory Settings Explanation

**For Starting Services:**
```
-Xms256m          # Start with 256MB heap
-Xmx512m          # Max 512MB heap
-XX:MetaspaceSize=128m    # Initial metaspace 128MB
-XX:MaxMetaspaceSize=256m # Max metaspace 256MB
-XX:+UseG1GC      # Use G1 garbage collector
```

**For Building Services:**
```
-Xms256m          # Start with 256MB
-Xmx1024m         # Max 1GB for compilation
-XX:MetaspaceSize=128m
-XX:MaxMetaspaceSize=512m
```

## Usage

### Start All Services (with fixed memory):
```bash
start-all-services.bat
```

### Build All Services (with fixed memory):
```bash
build-all-services.bat
```

### Start Individual Service:
```bash
start-api-gateway.bat
start-booking-service.bat
start-availability-service.bat
```

## If Error Persists

### Option 1: Increase Memory Further
Edit the batch files and increase values:
```
-Xms512m -Xmx1024m -XX:MaxMetaspaceSize=512m
```

### Option 2: Close Other Applications
Free up system RAM by closing:
- Browsers with many tabs
- IDEs (IntelliJ, Eclipse)
- Other Java applications

### Option 3: Check System Memory
```powershell
# Check available memory
Get-CimInstance Win32_OperatingSystem | Select FreePhysicalMemory, TotalVisibleMemorySize
```

### Option 4: Use Pre-built JARs
Instead of `mvn spring-boot:run`, use built JARs:
```bash
# Build once
mvn clean package -DskipTests

# Run JAR with memory settings
java -Xms256m -Xmx512m -jar target/api-gateway-1.0.0.jar
```

## Recommended System Requirements

- **Minimum RAM**: 4 GB
- **Recommended RAM**: 8 GB or more
- **For all 6 services**: Each needs ~512MB, total ~3GB RAM

## Memory Optimization Tips

1. **Start services one by one** instead of all at once
2. **Use production JARs** instead of Maven runtime
3. **Enable swap/page file** if low on RAM
4. **Monitor memory usage**:
   ```powershell
   # Check Java processes
   Get-Process | Where-Object {$_.ProcessName -like "*java*"} | Select Name, PM, VM
   ```

## Error Prevention

These settings prevent:
- ❌ OutOfMemoryError: Java heap space
- ❌ OutOfMemoryError: Metaspace
- ❌ Native memory allocation failed
- ❌ Chunk::new allocation errors

## Troubleshooting

If you still see memory errors:

1. **Check error log files** in each service directory:
   - `hs_err_pid*.log`
   - `replay_pid*.log`

2. **Reduce concurrent services**:
   ```bash
   # Start only essential services
   start-api-gateway.bat
   start-booking-service.bat
   start-availability-service.bat
   ```

3. **Use Docker** (alternative):
   Docker can better manage memory limits per container.

## Questions?

The memory settings are now configured to prevent the error while keeping resource usage reasonable for most development machines.
