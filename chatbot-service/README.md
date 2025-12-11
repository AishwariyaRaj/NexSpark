# NexSpark Chatbot Service

AI-powered chatbot service for NexSpark Vehicle Rental platform.

## Features

- 🤖 AI-powered responses using OpenAI, Google Gemini, or local models
- 💬 Real-time chat assistance
- 🚗 Vehicle rental guidance and information
- 📋 Booking process help
- 💰 Pricing information
- 🔄 Fallback responses when AI is not configured

## Setup

### 1. Install Dependencies

```bash
cd chatbot-service
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure your AI provider:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=8086

# Choose AI Provider: 'openai', 'gemini', or 'local'
AI_PROVIDER=openai

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Or use Gemini
# GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-pro

# Or use local model (Ollama)
# LOCAL_MODEL_URL=http://localhost:11434/api/generate
# LOCAL_MODEL_NAME=llama2
```

### 3. Run the Service

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The service will start on `http://localhost:8086`

## API Endpoints

### POST /api/chat
Send a message and receive AI response.

**Request:**
```json
{
  "message": "How do I book a vehicle?",
  "conversationHistory": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "reply": "To book a vehicle, use the search feature...",
  "timestamp": "2025-12-09T10:30:00.000Z"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "chatbot-service",
  "provider": "openai",
  "timestamp": "2025-12-09T10:30:00.000Z"
}
```

## AI Provider Setup

### OpenAI
1. Get API key from https://platform.openai.com/api-keys
2. Set `AI_PROVIDER=openai`
3. Set `OPENAI_API_KEY=your_key`

### Google Gemini
1. Get API key from https://makersuite.google.com/app/apikey
2. Set `AI_PROVIDER=gemini`
3. Set `GEMINI_API_KEY=your_key`

### Local Model (Ollama)
1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama2`
3. Set `AI_PROVIDER=local`
4. Set `LOCAL_MODEL_URL=http://localhost:11434/api/generate`

### Fallback Mode
If no AI provider is configured, the chatbot uses rule-based fallback responses.

## Integration with Frontend

The chatbot service is designed to work with the React frontend. Make sure to:

1. Add the chatbot service URL to frontend environment:
```env
REACT_APP_CHATBOT_URL=http://localhost:8086
```

2. The frontend components are located in:
   - `nexspark-frontend/src/components/Chatbot/`

## Chatbot Capabilities

The AI assistant can help with:
- ✅ Explaining how to use the platform
- ✅ Providing vehicle information
- ✅ Guiding through the booking process
- ✅ Answering pricing questions
- ✅ Location availability inquiries
- ✅ Suggesting suitable vehicles
- ❌ Cannot make actual bookings (guides users only)
- ❌ Cannot access user's personal data

## Development

### Project Structure
```
chatbot-service/
├── server.js              # Express server setup
├── routes/
│   └── chatRoutes.js     # API route definitions
├── controllers/
│   └── chatController.js # Chat logic and AI integration
├── package.json          # Dependencies
├── .env                  # Configuration (not in git)
└── .env.example          # Configuration template
```

### Testing

Test the chatbot endpoint:
```bash
curl -X POST http://localhost:8086/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I book a vehicle?"}'
```

## Troubleshooting

**Service won't start:**
- Check if port 8086 is available
- Verify .env file exists and is configured

**AI responses not working:**
- Verify API key is correct
- Check API key has sufficient credits
- Review console logs for errors
- Service will fall back to rule-based responses

**CORS errors:**
- Verify CORS_ORIGIN matches your frontend URL
- Default is http://localhost:3000

## License

MIT
