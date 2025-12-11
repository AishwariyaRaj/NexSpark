# 🤖 NexSpark Chatbot - Technical Reference

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     NexSpark Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Frontend   │         │   Backend    │                  │
│  │   (React)    │◄───────►│  (Node.js)   │                  │
│  │  Port 3000   │  HTTP   │  Port 8086   │                  │
│  └──────────────┘         └──────┬───────┘                  │
│        │                          │                          │
│        │                          ▼                          │
│        │                  ┌──────────────┐                  │
│        │                  │  AI Provider │                  │
│        │                  ├──────────────┤                  │
│        │                  │   OpenAI     │                  │
│        │                  │   Gemini     │                  │
│        │                  │   Ollama     │                  │
│        │                  │  (Fallback)  │                  │
│        │                  └──────────────┘                  │
│        │                                                     │
│        ▼                                                     │
│  ┌──────────────┐                                           │
│  │ localStorage │                                           │
│  │ Chat History │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
├── ChatBot (Main chat window)
│   ├── Header (Title, minimize, close)
│   ├── Messages Area
│   │   ├── Message Bubble (User)
│   │   ├── Message Bubble (Assistant)
│   │   └── Loading Indicator
│   └── Input Area
│       ├── Text Input
│       ├── Send Button
│       └── Clear Chat Button
└── ChatIcon (Floating button)
```

## State Management

### React State (ChatBot.jsx)
```javascript
const [messages, setMessages] = useState([])      // Chat messages
const [inputMessage, setInputMessage] = useState('') // Current input
const [isLoading, setIsLoading] = useState(false)   // API call state
const [isMinimized, setIsMinimized] = useState(false) // Window state
```

### App State (App.jsx)
```javascript
const [isChatOpen, setIsChatOpen] = useState(false) // Chat visibility
```

### Persistent State
```javascript
// localStorage key: 'nexspark_chat_history'
// Format: Array<{role, content, timestamp}>
```

## Data Flow

### User Sends Message
```
1. User types message and clicks send
2. Message added to state (optimistic update)
3. Input cleared, loading state set to true
4. API request sent with message + history
5. Response received from backend
6. Assistant message added to state
7. Loading state set to false
8. Messages saved to localStorage
9. Auto-scroll to bottom
```

### Backend Processing
```
1. Receive POST /api/chat
2. Validate message
3. Build conversation context
4. Call AI provider (or fallback)
5. Process response
6. Return JSON with reply
7. Handle errors gracefully
```

## API Specification

### POST /api/chat

**Endpoint:** `http://localhost:8086/api/chat`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "string (required)",
  "conversationHistory": [
    {
      "role": "user|assistant",
      "content": "string"
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "reply": "string",
  "timestamp": "ISO 8601 string"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "string",
  "reply": "fallback message (optional)"
}
```

### GET /api/health

**Endpoint:** `http://localhost:8086/api/health`

**Response (200):**
```json
{
  "status": "healthy",
  "service": "chatbot-service",
  "provider": "openai|gemini|local|fallback",
  "timestamp": "ISO 8601 string"
}
```

## AI Provider Integration

### OpenAI (gpt-3.5-turbo)
```javascript
const response = await aiClient.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ],
  temperature: 0.7,
  max_tokens: 300,
});
```

**Cost:** ~$0.002 per request (300 tokens)
**Speed:** ~2-3 seconds
**Quality:** Excellent

### Google Gemini (gemini-pro)
```javascript
const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
  {
    contents: [{ parts: [{ text: context }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300,
    }
  }
);
```

**Cost:** Free tier available
**Speed:** ~2-4 seconds
**Quality:** Very good

### Local Model (Ollama)
```javascript
const response = await axios.post(modelUrl, {
  model: 'llama2',
  prompt: context,
  stream: false,
  options: {
    temperature: 0.7,
    num_predict: 300,
  }
});
```

**Cost:** Free (runs locally)
**Speed:** Varies by hardware (5-10 seconds)
**Quality:** Good

### Fallback System
```javascript
const getFallbackResponse = (userMessage) => {
  // Rule-based pattern matching
  if (message.includes('book')) return "To book a vehicle...";
  if (message.includes('price')) return "Vehicle prices vary...";
  // ... more patterns
  return "I'm here to help..."; // Default
}
```

**Cost:** Free
**Speed:** Instant
**Quality:** Basic but functional

## System Prompt

The chatbot's behavior is defined by this prompt:

```
You are NexSpark AI Assistant, a helpful and friendly 
virtual assistant for NexSpark Vehicle Rental platform.

Your role:
- Help users understand how to use the platform
- Provide information about vehicles and pricing
- Guide through booking (but NOT make bookings)
- Answer questions about locations and policies
- Suggest vehicles based on needs
- Be concise, friendly, and professional

Key Information:
- Vehicle types: cars, SUVs, motorcycles, bikes
- Process: Search → Select → Dates → Payment → Confirmation
- Users must be logged in to book
- Payment is secure
- View bookings in "My Bookings"

Important:
- CANNOT make actual bookings
- CANNOT access user data
- Direct users to features for actions
- Set clear expectations
- Keep responses 2-4 sentences

Tone: Friendly, professional, helpful
Emojis: 1-2 per response max
```

## Frontend Components

### ChatIcon.jsx
**Purpose:** Floating chat button  
**Props:**
- `onClick`: Function to open chat
- `hasUnread`: Boolean for notification dot

**Features:**
- Hover tooltip
- Pulse animation for unread
- Smooth scale on hover
- Accessibility (aria-label)

### ChatBot.jsx
**Purpose:** Main chat interface  
**Props:**
- `isOpen`: Boolean for visibility
- `onClose`: Function to close chat

**Features:**
- Message history display
- Real-time chat
- Loading indicators
- Minimize/maximize
- Clear chat
- Auto-scroll
- Timestamp formatting
- Error handling
- localStorage persistence

## Styling System

### Tailwind Classes Used

**Colors:**
- `bg-primary-600`: Main blue (#3C44B2)
- `bg-primary-700`: Darker blue (hover)
- `bg-gray-50`: Light background
- `bg-gray-300`: Assistant avatar
- `text-white`: White text

**Layout:**
- `fixed`: Positioned absolutely
- `bottom-6 right-6`: Bottom-right corner
- `z-50`: Above other content
- `rounded-2xl`: Very rounded corners
- `shadow-2xl`: Large shadow

**Animations:**
- `transition-all`: Smooth transitions
- `duration-300`: 300ms timing
- `hover:scale-110`: Grow on hover
- `animate-bounce`: Bouncing dots
- `animate-pulse`: Pulsing notification

## Browser Compatibility

**Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Used:**
- localStorage (all modern browsers)
- Flexbox (all modern browsers)
- CSS Grid (all modern browsers)
- Async/await (all modern browsers)

## Performance Considerations

### Frontend
- **Bundle Size:** +50KB (lucide-react icons)
- **Render Time:** <100ms initial render
- **Memory:** ~2MB for 100 messages
- **localStorage Limit:** 5-10MB (varies by browser)

### Backend
- **Memory:** ~50MB idle, ~100MB under load
- **CPU:** Low (<5% on modern systems)
- **Response Time:** 
  - Fallback: <50ms
  - OpenAI: 2-3 seconds
  - Local: 5-10 seconds

### Optimization Tips
1. Limit conversation history to 10 messages
2. Use gpt-3.5-turbo instead of gpt-4
3. Reduce max_tokens for faster responses
4. Implement request caching (future)
5. Add rate limiting (future)

## Security Considerations

### Backend
- ✅ CORS configured for frontend only
- ✅ Input validation on all endpoints
- ✅ API keys in environment variables
- ✅ No user authentication required (public)
- ⚠️ Consider rate limiting for production
- ⚠️ Consider API key rotation

### Frontend
- ✅ No sensitive data stored
- ✅ Chat history stored locally only
- ✅ No authentication tokens in chat
- ✅ HTTPS recommended for production

### API Keys
- ❌ Never commit to git
- ✅ Use .env files
- ✅ .gitignore includes .env
- ⚠️ Rotate keys regularly
- ⚠️ Monitor usage/costs

## Testing Strategy

### Unit Tests (Future)
```javascript
// Backend
describe('chatController', () => {
  it('should return fallback for empty API key', ...);
  it('should validate message input', ...);
  it('should handle AI errors gracefully', ...);
});

// Frontend
describe('ChatBot', () => {
  it('should render when open', ...);
  it('should send message on submit', ...);
  it('should save to localStorage', ...);
});
```

### Integration Tests (Future)
```javascript
describe('Chat Flow', () => {
  it('should complete full conversation', ...);
  it('should persist history across reloads', ...);
  it('should handle network errors', ...);
});
```

### Manual Testing Checklist
- [ ] Chat icon appears
- [ ] Window opens/closes
- [ ] Messages send successfully
- [ ] Loading indicator shows
- [ ] Responses appear
- [ ] History persists
- [ ] Clear chat works
- [ ] Minimize/maximize works
- [ ] Mobile responsive
- [ ] Error handling works

## Deployment Considerations

### Development
```bash
# Backend
cd chatbot-service
npm run dev  # with nodemon

# Frontend
cd nexspark-frontend
npm start  # with hot reload
```

### Production

**Backend:**
```bash
# Install dependencies
npm install --production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name chatbot-service

# Or use Docker
docker build -t nexspark-chatbot .
docker run -p 8086:8086 nexspark-chatbot
```

**Frontend:**
```bash
# Build optimized bundle
npm run build

# Serve static files
npx serve -s build -l 3000
```

### Environment Variables
```env
# Production backend
PORT=8086
NODE_ENV=production
AI_PROVIDER=openai
OPENAI_API_KEY=prod_key_here
CORS_ORIGIN=https://yourdomain.com

# Production frontend
REACT_APP_CHATBOT_URL=https://api.yourdomain.com/chatbot
```

## Monitoring & Logging

### Backend Logging
```javascript
// Current: Console logs
console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);

// Future: Winston or Bunyan
logger.info({ method, path, userId }, 'Request received');
```

### Metrics to Track
- Total requests
- Response times
- Error rates
- AI provider usage
- Cost per conversation
- User satisfaction (future)

### Health Checks
```bash
# Check service
curl http://localhost:8086/api/health

# Expected response
{
  "status": "healthy",
  "service": "chatbot-service",
  "provider": "openai",
  "timestamp": "2025-12-09T10:30:00.000Z"
}
```

## Error Codes

### Backend Errors
- `400` - Invalid request (missing message)
- `500` - Server error (AI failure, network issue)

### Frontend Handling
- Network error → Show fallback message
- Timeout → Show retry option
- 500 error → Show friendly message

## Versioning

**Current Version:** 1.0.0

**Semantic Versioning:**
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes

## License

MIT License - Free to use and modify

---

## Quick Reference

**Ports:**
- Frontend: 3000
- Chatbot: 8086

**Endpoints:**
- Chat: POST /api/chat
- Health: GET /api/health

**Storage:**
- Key: nexspark_chat_history
- Location: localStorage

**Dependencies:**
- Backend: express, cors, dotenv, openai, axios
- Frontend: react, axios, lucide-react

**Files:**
- Backend entry: server.js
- Frontend entry: App.jsx
- Main components: ChatBot.jsx, ChatIcon.jsx
