<div align="center">

# 🚗 NexSpark - Vehicle Rental Platform

### Enterprise-Grade Microservices Architecture for Modern Vehicle Booking

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-3.5-black.svg)](https://kafka.apache.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-key-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Documentation](#-documentation)

</div>

---

## 🌟 Key Features

### 🔐 **Secure Authentication**
- JWT-based authentication & authorization
- User registration and login management
- Role-based access control

### 📅 **Smart Booking System**
- Real-time vehicle availability checking
- Distributed locking with Redis (prevents double-booking)
- Automatic booking confirmation & cancellation
- Multi-day rental support

### 💳 **Payment Processing**
- Integrated payment gateway
- Automatic payment confirmation
- Refund management
- Transaction history tracking

### 🔔 **Real-Time Notifications**
- Event-driven notification system
- WebSocket for instant updates
- Booking status changes
- Payment confirmations

### 🚀 **High Performance**
- Redis caching for faster responses
- Kafka message streaming for async processing
- Microservices architecture for scalability
- Distributed system design

### 🎨 **Modern Frontend**
- React-based responsive UI
- Real-time chat integration
- Interactive booking interface
- Mobile-friendly design

---

## 🏗 Architecture

```
┌─────────────┐
│   React     │ ← Frontend (Port 3000)
│  Frontend   │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────────────┐
│          API Gateway (Port 8080)                     │
│          • Authentication & JWT                      │
│          • Request Routing                           │
└──────┬──────────────────────────────────────────────┘
       │
       ├──────► Booking Service (Port 8081)
       │        • Booking Management
       │        • Redis Distributed Locks
       │
       ├──────► Availability Service (Port 8082)
       │        • Vehicle Search & Availability
       │        • Redis Caching
       │
       ├──────► Payment Service (Port 8083)
       │        • Payment Processing
       │        • Refund Management
       │
       ├──────► Notification Service (Port 8084)
       │        • User Notifications
       │        • Event Handling
       │
       └──────► WebSocket Service (Port 8085)
                • Real-Time Updates
                • Live Booking Status

         ┌────────────────────┐
         │  Apache Kafka      │ ← Event Streaming
         └────────────────────┘
         
         ┌────────────────────┐
         │  PostgreSQL        │ ← Persistent Storage
         └────────────────────┘
         
         ┌────────────────────┐
         │  Redis             │ ← Caching & Locking
         └────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17+ | Backend Services |
| Maven | 3.6+ | Build Tool |
| Docker | Latest | Container Runtime |
| Node.js | 16+ | Frontend Runtime |
| PostgreSQL | 15+ | Database |

### 🐳 One-Command Setup

```bash
# Start all infrastructure services
docker-compose up -d

# Setup databases
.\setup-databases.bat

# Build all services
.\build-all-services.bat

# Start all services
.\start-all-services.bat
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **API Documentation**: See [API_CHEATSHEET.md](API_CHEATSHEET.md)

---

## 🎯 Core Functionalities

### 1️⃣ User Authentication
```http
POST /auth/register
POST /auth/login
```
Register new users and authenticate with JWT tokens for secure API access.

### 2️⃣ Vehicle Search & Availability
```http
GET /availability/search?startDate=2025-12-10&endDate=2025-12-15
GET /availability/vehicles
```
Search available vehicles by date range and location with real-time availability status.

### 3️⃣ Booking Management
```http
POST /bookings
PUT /bookings/{id}/confirm
DELETE /bookings/{id}
GET /bookings/user/{userId}
```
Create, confirm, cancel, and track bookings with automatic vehicle locking mechanism.

### 4️⃣ Payment Processing
```http
POST /payments
POST /payments/{id}/refund
GET /payments/booking/{bookingId}
```
Process secure payments and handle refunds with complete transaction tracking.

### 5️⃣ Real-Time Notifications
```http
GET /notifications/user/{userId}
PUT /notifications/{id}/read
```
Receive instant notifications for booking updates and payment confirmations.

### 6️⃣ WebSocket Live Updates
```javascript
const socket = new WebSocket('ws://localhost:8085/ws/bookings');
```
Get real-time booking status updates through WebSocket connections.

---

## 📊 System Capabilities

<table>
<tr>
<td>

### ⚡ Performance
- Redis caching (< 10ms response)
- Distributed locking
- Async event processing
- Connection pooling

</td>
<td>

### 🔒 Security
- JWT authentication
- Password encryption
- SQL injection prevention
- CORS configuration

</td>
</tr>
<tr>
<td>

### 📈 Scalability
- Microservices architecture
- Horizontal scaling ready
- Load balancing support
- Database replication ready

</td>
<td>

### 🛡️ Reliability
- Event-driven architecture
- Kafka message persistence
- Transaction management
- Error handling & recovery

</td>
</tr>
</table>

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API_CHEATSHEET.md](API_CHEATSHEET.md) | Complete API reference with examples |
| [HOW_TO_RUN.md](HOW_TO_RUN.md) | Detailed setup and running instructions |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Project organization and structure |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Step-by-step setup guide |
| [CHATBOT_README.md](CHATBOT_README.md) | Chatbot integration documentation |

---

## 🛠️ Technology Stack

### Backend Services
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **API**: RESTful APIs
- **WebSocket**: Spring WebSocket

### Data Layer
- **Database**: PostgreSQL 15
- **Caching**: Redis 7
- **Message Broker**: Apache Kafka 3.5

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **HTTP Client**: Axios

### DevOps
- **Build Tool**: Maven
- **Containerization**: Docker
- **Orchestration**: Docker Compose

---

## 🌊 Event Flow Architecture

### Booking Flow
```mermaid
User → Booking Service → Redis Lock (10 min) 
  ↓
Kafka: booking_created event
  ↓
Availability Service → Update Cache
Notification Service → Create Notification
WebSocket Service → Broadcast Update
```

### Payment Flow
```mermaid
User → Payment Service → Process Payment
  ↓
Kafka: payment_completed event
  ↓
Notification Service → Payment Notification
WebSocket Service → Payment Update
```

---

## 📦 Project Structure

```
NexSpark/
├── 🚪 api-gateway/              Authentication & routing
├── 📅 booking-service/          Booking management
├── 🔍 availability-service/     Vehicle availability & search
├── 💰 payment-service/          Payment processing
├── 🔔 notification-service/     User notifications
├── 🌐 websocket-service/        Real-time updates
├── 🤖 chatbot-service/          AI chatbot integration
├── ⚛️  nexspark-frontend/        React frontend application
├── 🐳 docker-compose.yml        Infrastructure setup
└── 📚 Documentation/            Complete guides
```

---

## 🎨 Frontend Features

- ✨ Modern, responsive UI design
- 🔐 Secure user authentication
- 🚗 Interactive vehicle browsing
- 📅 Date-based availability search
- 💳 Integrated payment flow
- 🔔 Real-time notifications
- 💬 AI-powered chatbot assistance
- 📱 Mobile-friendly interface

---

## ⚙️ Configuration Highlights

### Redis Distributed Locking
- Prevents double-booking
- 10-minute lock timeout
- Automatic lock release

### Kafka Event Streaming
- **Topics**: `booking-events`, `payment-events`
- Async processing for better performance
- Event replay capability

### PostgreSQL Databases
- Separate database per service
- Transaction management
- Data isolation

---

## 🚧 Production Readiness

### ✅ Implemented
- [x] Microservices architecture
- [x] JWT authentication
- [x] Event-driven communication
- [x] Distributed caching
- [x] Real-time updates
- [x] Chatbot integration

### 🔄 Recommended for Production
- [ ] API Gateway authentication for inter-service communication
- [ ] Circuit breakers (Resilience4j)
- [ ] Distributed tracing (Zipkin/Jaeger)
- [ ] Monitoring (Prometheus + Grafana)
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] HTTPS/WSS encryption

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aishwariya D (AishwariyaRaj)**
- GitHub: [@AishwariyaRaj](https://github.com/AishwariyaRaj)
- Email: aishwariya229@gmail.com

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ using Spring Boot & React

</div>
