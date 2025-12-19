# NexSpark Deployment Guide

## 🚀 Quick Deploy to Render

This repository is configured for one-click deployment to Render using the render.yaml blueprint.

### Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- OpenAI API key (for chatbot service)

### Deployment Steps

#### Option 1: Blueprint Deploy (Recommended)
1. Go to https://render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select `AishwariyaRaj/NexSpark`
5. Review services and click "Apply"

All services will be deployed automatically!

#### Option 2: Manual Deploy Each Service

##### 1. Deploy PostgreSQL
- Go to Render Dashboard
- Click "New" → "PostgreSQL"
- Name: `nexspark-postgres`
- Plan: Free
- Click "Create Database"
- Save the connection string

##### 2. Deploy Redis
- Click "New" → "Redis"
- Name: `nexspark-redis`
- Plan: Free
- Click "Create Redis"

##### 3. Deploy API Gateway
- Click "New" → "Web Service"
- Connect your repository
- Name: `nexspark-api-gateway`
- Region: Choose closest
- Branch: `main`
- Root Directory: `api-gateway`
- Runtime: Docker
- Instance Type: Free
- Add Environment Variables:
  ```
  SPRING_DATASOURCE_URL=<postgres-connection-string>
  SPRING_DATASOURCE_USERNAME=<postgres-user>
  SPRING_DATASOURCE_PASSWORD=<postgres-password>
  SERVER_PORT=8080
  ```
- Click "Create Web Service"

##### 4. Repeat for other services:
- **Booking Service** (port 8081)
- **Availability Service** (port 8082)
- **Payment Service** (port 8083)
- **Notification Service** (port 8084)
- **WebSocket Service** (port 8085)
- **Chatbot Service** (port 8086 - add OPENAI_API_KEY)

### Service URLs
After deployment, your services will be available at:
```
https://nexspark-api-gateway.onrender.com
https://nexspark-booking.onrender.com
https://nexspark-availability.onrender.com
https://nexspark-payment.onrender.com
https://nexspark-notification.onrender.com
https://nexspark-websocket.onrender.com
https://nexspark-chatbot.onrender.com
```

### Update Frontend
Update your Vercel environment variables:
```
REACT_APP_API_URL=https://nexspark-api-gateway.onrender.com
```

### Important Notes
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep will take 30-50 seconds
- PostgreSQL free tier has 90-day limit
- Redis free tier has 25MB storage limit

### Troubleshooting
- Check service logs in Render dashboard
- Verify environment variables are set correctly
- Ensure health check endpoints are responding
- Check database connection strings

### Health Checks
All services expose health check at:
```
GET /actuator/health
```

### Support
For issues, check:
1. Service logs in Render dashboard
2. Database connectivity
3. Environment variable configuration
