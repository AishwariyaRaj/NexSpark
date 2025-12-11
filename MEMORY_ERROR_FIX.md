# ⚡ Quick Memory Error Fix - Run This Now!

## 🚨 Your Error:
```
insufficient memory for the Java Runtime Environment to continue
Native memory allocation (malloc) failed
```

## ✅ Solution (Choose One):

### Option 1: Automatic Fix (RECOMMENDED)
```bash
fix-memory-error.bat
```
This will:
- Stop all Java processes
- Clean error logs
- Apply memory settings
- Let you choose to start services

### Option 2: Start All Services (Fixed)
```bash
start-all-services.bat
```
All services now start with proper memory settings automatically.

### Option 3: Start Individual Services
```bash
start-api-gateway.bat
start-booking-service.bat
start-availability-service.bat
```

### Option 4: PowerShell (Better Memory Management)
```powershell
.\start-all-services-memory-fixed.ps1
```

## 📋 What Was Fixed:

### Before (Caused Error):
```
mvn spring-boot:run
# No memory limits → Runs out of memory
```

### After (Fixed):
```
set MAVEN_OPTS=-Xms256m -Xmx512m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m
mvn spring-boot:run
# Proper memory allocation → Works smoothly
```

## 🎯 Memory Settings Applied:

| Setting | Value | Purpose |
|---------|-------|---------|
| Initial Heap (`Xms`) | 256 MB | Starting memory |
| Max Heap (`Xmx`) | 512 MB | Maximum memory |
| Initial Metaspace | 128 MB | Class metadata |
| Max Metaspace | 256 MB | Maximum metadata |
| Garbage Collector | G1GC | Efficient cleanup |

## 🔧 If Error Still Occurs:

### Step 1: Check Available Memory
```powershell
# Check your system RAM
systeminfo | findstr /C:"Available Physical Memory"
```

### Step 2: Close Other Applications
- Close browsers with many tabs
- Close IDEs (IntelliJ, Eclipse)
- Close other memory-heavy apps

### Step 3: Increase Memory Further
Edit `start-all-services.bat` and change:
```
-Xmx512m  →  -Xmx1024m
```

### Step 4: Start Services One by One
Instead of all at once:
```bash
# Start only essential services
start-api-gateway.bat
# Wait for it to fully start (check console)

start-booking-service.bat
# Wait...

start-availability-service.bat
```

## 📊 System Requirements:

- **Minimum RAM**: 4 GB (tight, may have issues)
- **Recommended RAM**: 8 GB or more
- **For All 6 Services**: ~3 GB RAM needed

Each service uses:
- ~512 MB max per service
- 6 services × 512 MB = ~3 GB total

## ❓ FAQ

**Q: Why did this error happen?**
A: Java services were starting without memory limits, trying to use more RAM than available.

**Q: Will this slow down my services?**
A: No! 512 MB per service is plenty for development. You might even see better performance.

**Q: Can I run all services with 4 GB RAM?**
A: Possible but tight. Consider:
- Starting only needed services
- Closing other applications
- Upgrading RAM if possible

**Q: Do I need to rebuild?**
A: No! The memory fix applies to running services. Just restart with the fixed scripts.

## 🎉 Next Steps:

1. **Run the fix**: `fix-memory-error.bat`
2. **Start services**: Choose option 1 from the menu
3. **Verify**: Check each service window - no more memory errors!
4. **Develop**: Services should run smoothly now

## 📝 Files Modified/Created:

✅ `start-all-services.bat` - Fixed with memory settings
✅ `build-all-services.bat` - Fixed for compilation
✅ `start-api-gateway.bat` - New individual startup
✅ `start-booking-service.bat` - New individual startup  
✅ `start-availability-service.bat` - New individual startup
✅ `fix-memory-error.bat` - Quick fix utility
✅ `start-all-services-memory-fixed.ps1` - PowerShell version

## 💡 Pro Tips:

1. **Monitor Memory**: Open Task Manager and watch Java processes
2. **Staggered Start**: Wait 10-15 seconds between each service
3. **Check Logs**: Each service window shows startup progress
4. **Use JARs**: For production, build JARs once and run them (faster startup)

## ⚠️ Still Having Issues?

If memory errors persist after trying all options, you may need to:
1. Upgrade system RAM
2. Use Docker (better resource isolation)
3. Run services on separate machines
4. Use cloud deployment (AWS, Azure)

---

**Ready to fix?** Run: `fix-memory-error.bat`
