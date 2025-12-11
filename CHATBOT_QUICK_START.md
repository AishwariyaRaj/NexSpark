# 🚀 NexSpark Chatbot - Quick Start

## Get Started in 5 Minutes!

### 1️⃣ Install Backend Dependencies
```bash
cd chatbot-service
npm install
```

### 2️⃣ Configure (Choose One)

**Easy Mode - No AI Required:**
```bash
# In chatbot-service/.env
PORT=8086
AI_PROVIDER=fallback
CORS_ORIGIN=http://localhost:3000
```

**With OpenAI (Best Experience):**
```bash
# In chatbot-service/.env
PORT=8086
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-3.5-turbo
CORS_ORIGIN=http://localhost:3000
```

Get OpenAI key: https://platform.openai.com/api-keys

### 3️⃣ Install Frontend Dependencies
```bash
cd nexspark-frontend
npm install
```

### 4️⃣ Add Frontend Config
```bash
# Create or edit nexspark-frontend/.env
REACT_APP_CHATBOT_URL=http://localhost:8086
```

### 5️⃣ Start Services

**Terminal 1 - Backend:**
```bash
cd chatbot-service
npm start
```

**Terminal 2 - Frontend:**
```bash
cd nexspark-frontend
npm start
```

### ✅ Done!

Open http://localhost:3000 and look for the chat icon at the bottom-right corner! 🎉

---

## Test Messages

Try these:
- "How do I book a vehicle?"
- "What types of vehicles do you have?"
- "Tell me about pricing"
- "Where are you located?"

---

## Troubleshooting

**Can't see chat icon?**
- Refresh the page
- Check browser console for errors
- Verify both services are running

**Service won't start?**
```bash
# Check if port is in use
netstat -ano | findstr :8086
```

**Need help?**
Read the full guide: `CHATBOT_INTEGRATION_GUIDE.md`
