# NexSpark AI Chatbot Integration Guide

## 🎯 Overview

This guide covers the complete setup and integration of the AI chatbot feature for NexSpark Vehicle Rental platform.

## 📋 What Was Added

### Backend (Node.js/Express)
- **Chatbot Service** - Standalone Node.js microservice (Port 8086)
- **AI Provider Support** - OpenAI, Google Gemini, or local models (Ollama)
- **Fallback System** - Rule-based responses when AI is unavailable
- **API Endpoints** - `/api/chat` and `/api/health`

### Frontend (React)
- **ChatBot Component** - Full-featured chat window with message history
- **ChatIcon Component** - Floating chat button with hover effects
- **localStorage Integration** - Persistent chat history
- **Responsive Design** - Mobile-friendly with Tailwind CSS

### Files Created

#### Backend Files
```
chatbot-service/
├── server.js                    # Express server
├── package.json                 # Node.js dependencies
├── .env                         # Configuration file
├── .env.example                 # Configuration template
├── .gitignore                   # Git ignore rules
├── README.md                    # Service documentation
├── controllers/
│   └── chatController.js        # Chat logic & AI integration
└── routes/
    └── chatRoutes.js            # API routes
```

#### Frontend Files
```
nexspark-frontend/
├── package.json                 # Updated with lucide-react
├── .env.chatbot                 # Frontend config example
└── src/
    ├── App.jsx                  # Updated with chatbot integration
    └── components/
        └── Chatbot/
            ├── ChatBot.jsx      # Main chat window component
            └── ChatIcon.jsx     # Floating chat icon
```

#### Configuration Files
```
start-chatbot.bat                # Windows startup script
```

## 🚀 Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd chatbot-service
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin support
- `dotenv` - Environment configuration
- `openai` - OpenAI API client
- `axios` - HTTP client
- `nodemon` - Development auto-reload

### Step 2: Configure AI Provider

Edit `chatbot-service/.env`:

**Option A: OpenAI (Recommended)**
```env
PORT=8086
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-openai-key-here
OPENAI_MODEL=gpt-3.5-turbo
CORS_ORIGIN=http://localhost:3000
```

**Option B: Google Gemini**
```env
PORT=8086
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-pro
CORS_ORIGIN=http://localhost:3000
```

**Option C: Local Model (Ollama)**
```env
PORT=8086
AI_PROVIDER=local
LOCAL_MODEL_URL=http://localhost:11434/api/generate
LOCAL_MODEL_NAME=llama2
CORS_ORIGIN=http://localhost:3000
```

**Option D: No AI (Fallback Mode)**
```env
PORT=8086
AI_PROVIDER=fallback
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Get API Keys

#### For OpenAI:
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and add to `.env`
5. Note: Requires billing/credits (~$0.002 per request)

#### For Google Gemini:
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key and add to `.env`
5. Note: Has free tier available

#### For Local Model (Ollama):
1. Install Ollama from https://ollama.ai
2. Run: `ollama pull llama2`
3. Ollama runs on http://localhost:11434
4. Free and runs offline!

### Step 4: Install Frontend Dependencies

```bash
cd nexspark-frontend
npm install
```

This will install the new `lucide-react` package for icons.

### Step 5: Configure Frontend

Add to `nexspark-frontend/.env` (or create it):

```env
REACT_APP_CHATBOT_URL=http://localhost:8086
```

### Step 6: Start Services

**Option A: Manual Start**

Terminal 1 - Chatbot Service:
```bash
cd chatbot-service
npm start
```

Terminal 2 - Frontend:
```bash
cd nexspark-frontend
npm start
```

**Option B: Using Batch Script (Windows)**
```bash
# From project root
start-chatbot.bat
```

## 🎨 UI Features

### Chat Icon
- Floating button at bottom-right
- Hover tooltip: "Chat with NexSpark AI"
- Smooth animations and transitions
- Matches NexSpark color scheme (primary blue)

### Chat Window
- **Size**: 384px × 600px (responsive)
- **Features**:
  - Minimize/maximize toggle
  - Close button
  - Message history with timestamps
  - User vs Assistant message distinction
  - Loading indicator (animated dots)
  - Clear chat option
  - Auto-scroll to latest message
  - Persistent history (localStorage)

### Design Theme
- Primary color: `#3C44B2` (NexSpark blue)
- Rounded corners: 16px (modern feel)
- Shadows: Subtle elevation
- Typography: Clean sans-serif
- Icons: Lucide React (lightweight)

## 🤖 Chatbot Capabilities

### What It Can Do ✅
- Guide users through booking process
- Explain vehicle types and pricing
- Provide location availability info
- Answer platform usage questions
- Suggest vehicles based on needs
- Explain payment and booking policies
- Friendly, conversational assistance

### What It Cannot Do ❌
- Make actual bookings (guides only)
- Access user's personal booking data
- Process payments
- Modify existing bookings
- Access authentication details

### Chatbot Personality
- **Tone**: Friendly, professional, helpful
- **Style**: Concise (2-4 sentences typically)
- **Emojis**: Used sparingly (1-2 per response)
- **Name**: "NexSpark AI Assistant"
- **Greeting**: Warm and welcoming

## 🔧 Technical Details

### API Endpoints

#### POST /api/chat
Sends user message and receives AI response.

**Request:**
```json
{
  "message": "How do I book a vehicle?",
  "conversationHistory": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "To book a vehicle, use our search feature...",
  "timestamp": "2025-12-09T10:30:00.000Z"
}
```

#### GET /api/health
Health check for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "service": "chatbot-service",
  "provider": "openai",
  "timestamp": "2025-12-09T10:30:00.000Z"
}
```

### Chat History Storage
- **Location**: Browser localStorage
- **Key**: `nexspark_chat_history`
- **Format**: JSON array of message objects
- **Limit**: Browser storage limits (typically 5-10MB)

### Context Window
- Sends last 10 messages for context
- Reduces token usage
- Maintains conversation flow

### Error Handling
- API failures → Fallback responses
- Network errors → User-friendly messages
- Invalid input → Validation errors
- Service down → Graceful degradation

## 🧪 Testing

### Test Backend
```bash
# Terminal 1: Start service
cd chatbot-service
npm start

# Terminal 2: Test endpoint
curl -X POST http://localhost:8086/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"How do I book a vehicle?\"}"
```

### Test Frontend
1. Start frontend: `npm start`
2. Open http://localhost:3000
3. Click chat icon (bottom-right)
4. Send test message
5. Verify response appears

### Common Test Messages
- "How do I book a vehicle?"
- "What types of vehicles do you have?"
- "How much does it cost?"
- "Where are you located?"
- "Can you help me find an SUV?"

## 🛠️ Customization

### Change Chatbot Personality
Edit `chatbot-service/controllers/chatController.js`:
```javascript
const SYSTEM_PROMPT = `You are NexSpark AI Assistant...
// Modify this prompt to change personality
`;
```

### Adjust Response Length
```javascript
max_tokens: 300,  // Change this value
```

### Modify UI Colors
Edit component files to use different Tailwind classes:
```jsx
className="bg-primary-600"  // Change to your color
```

### Add Quick Reply Buttons
Add to `ChatBot.jsx` below input area:
```jsx
<div className="flex gap-2 mt-2">
  <button onClick={() => sendQuickReply("Show me cars")}>
    Cars
  </button>
  <button onClick={() => sendQuickReply("Show me SUVs")}>
    SUVs
  </button>
</div>
```

## 📊 Monitoring

### Check Service Status
```bash
# Health check
curl http://localhost:8086/api/health

# View logs
cd chatbot-service
npm start  # Watch console output
```

### Monitor Costs (OpenAI)
- Visit https://platform.openai.com/usage
- gpt-3.5-turbo: ~$0.002/request
- gpt-4: ~$0.06/request (more expensive)

### Performance Tips
- Use gpt-3.5-turbo for cost efficiency
- Limit conversation history (currently 10 messages)
- Reduce max_tokens for shorter responses
- Consider caching common questions

## 🐛 Troubleshooting

### Chatbot service won't start
```bash
# Check if port 8086 is in use
netstat -ano | findstr :8086

# Kill process if needed
taskkill /F /PID <process_id>
```

### "Failed to get response from AI"
- Verify API key is correct
- Check API credits/quota
- Try fallback mode temporarily
- Check console logs for details

### Frontend can't connect to backend
- Verify chatbot service is running on 8086
- Check CORS_ORIGIN in backend .env
- Verify REACT_APP_CHATBOT_URL in frontend
- Check browser console for errors

### Chat history not persisting
- Check browser localStorage is enabled
- Clear localStorage and try again
- Verify no console errors

### Icons not showing
```bash
# Reinstall dependencies
cd nexspark-frontend
npm install lucide-react
```

## 🔄 Integration with Existing Services

The chatbot is designed as a standalone microservice:
- **Port**: 8086 (doesn't conflict with other services)
- **Independent**: Runs separately from Java services
- **Stateless**: No database required
- **CORS**: Configured for frontend access

### Update Service List
The chatbot is service #7 in your architecture:
1. API Gateway (8080)
2. Booking Service (8081)
3. Availability Service (8082)
4. Payment Service (8083)
5. Notification Service (8084)
6. WebSocket Service (8085)
7. **Chatbot Service (8086)** ← NEW

## 📝 Future Enhancements

Potential improvements:
- [ ] Voice input/output support
- [ ] Multi-language support
- [ ] File upload capability
- [ ] Integration with booking API (check real availability)
- [ ] User authentication context
- [ ] Analytics dashboard
- [ ] A/B testing different prompts
- [ ] Rate limiting
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Read receipts

## 📞 Support

For issues or questions:
1. Check console logs (backend and frontend)
2. Review this documentation
3. Test with fallback mode
4. Check GitHub issues (if using version control)

## 🎉 Success Checklist

- [ ] Chatbot service installed and running
- [ ] AI provider configured (or fallback mode)
- [ ] Frontend dependencies installed
- [ ] Chat icon appears on all pages
- [ ] Chat window opens/closes correctly
- [ ] Messages send and receive successfully
- [ ] Chat history persists after refresh
- [ ] UI matches NexSpark design theme
- [ ] No console errors
- [ ] Tested on mobile view

---

**Congratulations!** Your NexSpark platform now has an AI-powered chatbot! 🎉🤖
