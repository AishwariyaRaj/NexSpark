# 🚀 NexSpark Chatbot - Installation Instructions

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js (version 14 or higher) - [Download](https://nodejs.org)
- ✅ npm (comes with Node.js)
- ✅ Git (optional, for version control)
- ✅ A code editor (VS Code recommended)
- ✅ Terminal/Command Prompt access

Check your versions:
```bash
node --version  # Should show v14+ or higher
npm --version   # Should show 6+ or higher
```

---

## 📥 Step-by-Step Installation

### Step 1: Install Backend Dependencies

Open a terminal in your project root directory and run:

```bash
cd chatbot-service
npm install
```

**What gets installed:**
- express (web framework)
- cors (cross-origin support)
- dotenv (environment variables)
- openai (OpenAI API client)
- axios (HTTP requests)
- nodemon (dev auto-reload)

**Expected output:**
```
added 145 packages in 15s
```

### Step 2: Install Frontend Dependencies

In a new terminal (or same terminal after step 1):

```bash
cd nexspark-frontend
npm install
```

**What gets installed:**
- lucide-react (icons for chat)
- (existing packages updated if needed)

**Expected output:**
```
added 1 package in 5s
```

---

## ⚙️ Configuration

### Option A: Quick Start (No AI - Uses Fallback)

**Best for:** Testing, development without API costs

1. Edit `chatbot-service/.env`:
```env
PORT=8086
AI_PROVIDER=fallback
CORS_ORIGIN=http://localhost:3000
```

2. Edit `nexspark-frontend/.env` (create if doesn't exist):
```env
REACT_APP_CHATBOT_URL=http://localhost:8086
```

✅ **Done!** Skip to "Running the Application"

### Option B: With OpenAI (Recommended for Production)

**Best for:** Production, best AI responses

1. **Get OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Sign up or log in
   - Click "Create new secret key"
   - Copy the key (starts with `sk-...`)
   - ⚠️ Keep it secret! Never commit to git

2. **Configure Backend:**

Edit `chatbot-service/.env`:
```env
PORT=8086
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-3.5-turbo
CORS_ORIGIN=http://localhost:3000
AVAILABILITY_SERVICE_URL=http://localhost:8082
BOOKING_SERVICE_URL=http://localhost:8081
```

3. **Configure Frontend:**

Edit `nexspark-frontend/.env`:
```env
REACT_APP_CHATBOT_URL=http://localhost:8086
```

✅ **Done!** Continue to "Running the Application"

### Option C: With Google Gemini

**Best for:** Free tier, good quality

1. **Get Gemini API Key:**
   - Go to https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key

2. **Configure Backend:**

Edit `chatbot-service/.env`:
```env
PORT=8086
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key-here
GEMINI_MODEL=gemini-pro
CORS_ORIGIN=http://localhost:3000
```

3. **Configure Frontend:**

Edit `nexspark-frontend/.env`:
```env
REACT_APP_CHATBOT_URL=http://localhost:8086
```

✅ **Done!** Continue to "Running the Application"

### Option D: With Local Model (Ollama)

**Best for:** Privacy, offline use, zero cost

1. **Install Ollama:**
   - Download from https://ollama.ai
   - Install the application
   - Open terminal and run:
   ```bash
   ollama pull llama2
   ```
   - Wait for download (about 4GB)

2. **Verify Ollama is running:**
   ```bash
   curl http://localhost:11434
   ```
   Should respond: "Ollama is running"

3. **Configure Backend:**

Edit `chatbot-service/.env`:
```env
PORT=8086
AI_PROVIDER=local
LOCAL_MODEL_URL=http://localhost:11434/api/generate
LOCAL_MODEL_NAME=llama2
CORS_ORIGIN=http://localhost:3000
```

4. **Configure Frontend:**

Edit `nexspark-frontend/.env`:
```env
REACT_APP_CHATBOT_URL=http://localhost:8086
```

✅ **Done!** Continue to "Running the Application"

---

## 🏃 Running the Application

### Method 1: Manual Start (Recommended for Development)

**Terminal 1 - Start Chatbot Backend:**
```bash
cd chatbot-service
npm start
```

Expected output:
```
🤖 NexSpark Chatbot Service
📡 Server running on port 8086
🌐 http://localhost:8086
🔧 AI Provider: openai (or your chosen provider)

Endpoints:
  POST http://localhost:8086/api/chat
  GET  http://localhost:8086/api/health
```

**Terminal 2 - Start Frontend:**
```bash
cd nexspark-frontend
npm start
```

Expected output:
```
Compiled successfully!

You can now view nexspark-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Method 2: Using Batch Script (Windows)

Double-click `start-chatbot.bat` or run:
```bash
start-chatbot.bat
```

This will:
- Open a new terminal for the chatbot service
- Start the service on port 8086

Then manually start the frontend:
```bash
cd nexspark-frontend
npm start
```

### Method 3: Development Mode (Auto-reload)

For backend auto-reload on file changes:
```bash
cd chatbot-service
npm run dev
```

For frontend (already has auto-reload):
```bash
cd nexspark-frontend
npm start
```

---

## ✅ Verification

### 1. Check Backend is Running

Open browser and visit: http://localhost:8086

You should see:
```json
{
  "service": "NexSpark Chatbot Service",
  "version": "1.0.0",
  "status": "running",
  "endpoints": {
    "chat": "POST /api/chat",
    "health": "GET /api/health"
  }
}
```

### 2. Check Health Endpoint

Visit: http://localhost:8086/api/health

You should see:
```json
{
  "status": "healthy",
  "service": "chatbot-service",
  "provider": "openai",
  "timestamp": "2025-12-09T10:30:00.000Z"
}
```

### 3. Test Chat Endpoint

Run the test script:
```bash
cd d:\NM_Task
powershell -ExecutionPolicy Bypass -File test-chatbot.ps1
```

Or manually test:
```bash
curl -X POST http://localhost:8086/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"How do I book a vehicle?\"}"
```

### 4. Check Frontend

1. Open http://localhost:3000
2. Look for chat icon at bottom-right corner (blue circle with message icon)
3. Click the icon
4. Chat window should open
5. Type: "Hello"
6. Press Enter or click send
7. You should receive a response

---

## 🎉 Success!

If all steps above work, your chatbot is successfully installed! 

You should see:
- ✅ Chat icon appears on all pages
- ✅ Chat window opens when clicked
- ✅ Messages send and receive
- ✅ Loading indicator shows
- ✅ Chat history persists after refresh

---

## 🐛 Troubleshooting

### Problem: Port 8086 already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :8086
taskkill /F /PID <process_id>

# Or change port in .env
PORT=8087
```

### Problem: "Cannot find module 'xyz'"

**Solution:**
```bash
# Reinstall dependencies
cd chatbot-service
rm -rf node_modules package-lock.json
npm install
```

### Problem: OpenAI API error

**Check:**
- API key is correct (starts with `sk-`)
- API key has credits/billing enabled
- No typos in .env file
- .env file is in chatbot-service folder

**Temporary fix:** Switch to fallback mode
```env
AI_PROVIDER=fallback
```

### Problem: Chat icon doesn't appear

**Check:**
1. Frontend is running on port 3000
2. No console errors (F12 → Console)
3. lucide-react is installed:
   ```bash
   cd nexspark-frontend
   npm list lucide-react
   ```
4. Hard refresh: Ctrl+Shift+R

### Problem: "Network Error" when sending messages

**Check:**
1. Backend is running on port 8086
2. Frontend .env has correct URL:
   ```env
   REACT_APP_CHATBOT_URL=http://localhost:8086
   ```
3. CORS is configured correctly in backend
4. No firewall blocking connections

### Problem: Messages send but no response

**Check:**
1. Backend console for errors
2. API key is valid (if using AI)
3. Internet connection (if using cloud AI)
4. Try fallback mode to isolate issue

### Problem: Chat history not persisting

**Check:**
1. Browser localStorage is enabled
2. Not in private/incognito mode
3. No browser extensions blocking storage
4. Try different browser

---

## 📝 Post-Installation

### Next Steps

1. **Test thoroughly:**
   - Try different questions
   - Test on mobile view
   - Check all pages

2. **Customize:**
   - Adjust chatbot personality (edit SYSTEM_PROMPT)
   - Change colors (edit Tailwind classes)
   - Add quick reply buttons

3. **Monitor:**
   - Watch backend logs for errors
   - Monitor API costs (if using OpenAI)
   - Track user feedback

4. **Deploy to production:**
   - See deployment section in CHATBOT_INTEGRATION_GUIDE.md
   - Set up proper environment variables
   - Enable HTTPS
   - Configure rate limiting

### Recommended Settings for Production

**Backend (.env):**
```env
PORT=8086
NODE_ENV=production
AI_PROVIDER=openai
OPENAI_API_KEY=your_production_key
OPENAI_MODEL=gpt-3.5-turbo
CORS_ORIGIN=https://yourdomain.com
```

**Frontend (.env):**
```env
REACT_APP_CHATBOT_URL=https://api.yourdomain.com/chatbot
```

---

## 📚 Additional Resources

### Documentation
- **Quick Start:** CHATBOT_QUICK_START.md
- **Integration Guide:** CHATBOT_INTEGRATION_GUIDE.md
- **Technical Reference:** CHATBOT_TECHNICAL_REFERENCE.md
- **Implementation Summary:** CHATBOT_IMPLEMENTATION_SUMMARY.md

### Support
- Check console logs (F12 in browser)
- Review error messages
- Test with fallback mode
- Refer to troubleshooting section

### Learning
- OpenAI Docs: https://platform.openai.com/docs
- Express.js: https://expressjs.com
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com

---

## ✅ Installation Checklist

- [ ] Node.js installed (v14+)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] Backend starts successfully (port 8086)
- [ ] Frontend starts successfully (port 3000)
- [ ] Health endpoint responds
- [ ] Chat endpoint responds
- [ ] Chat icon appears
- [ ] Chat window opens
- [ ] Messages send and receive
- [ ] Loading indicator works
- [ ] Chat history persists
- [ ] No console errors
- [ ] Mobile view works

---

**Installation Complete!** 🎊

Your NexSpark AI Chatbot is ready to help your users! 🤖

**Need help?** Refer to the troubleshooting section or documentation files.
