# SiCuan Backend API

## Description

**SiCuan** is a cloud-native REST API backend for the SiCuan application, a platform designed to help restaurants and culinary businesses manage their menus, recipes, and inventory stock. Built with Express.js, TypeScript, and Google Cloud Platform, this API provides a robust, scalable foundation for restaurant management operations with asynchronous email processing.

---

## Key Features

- **Authentication**: Secure user registration, login, and password reset functionality with OTP verification
- **Menu Management**: Create, read, update, and delete menu items
- **Recipe/COGS Management**: Track ingredients, calculate production costs (HPP), and manage recipes
- **Stock Management**: Monitor stock levels, record stock movements, and manage inventory
- **Profile Management**: View and update user profiles, change passwords securely
- **Asynchronous Email Processing**: Cloud Functions-based email system with Pub/Sub messaging
- **Auto-scaling Infrastructure**: Cloud Run deployment with automatic scaling

---

## Technologies Used

### **Backend Framework**
- **Framework**: Express.js with TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (JSON Web Token)
- **Validation**: Zod schema validation

### **Google Cloud Platform**
- **Cloud Run**: Serverless container deployment
- **Cloud Functions**: Asynchronous email processing
- **Cloud Pub/Sub**: Message queue for email notifications
- **Cloud SQL**: Managed MySQL database (optional)

### **Email & Communication**
- **Email Service**: Mailjet SMTP with Cloud Functions
- **Message Queue**: Google Cloud Pub/Sub
- **Template Engine**: Custom HTML email templates

### **Security & Monitoring**
- **Security**: Helmet, HPP, XSS Protection, Rate Limiting, CORS
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston, Morgan

---

## Architecture Overview


```
                    📱 SiCuan Mobile App                    
                         (Flutter)                         
                            │                              
                            │ HTTPS REST API              
                            ▼                              
    ┌─────────────────────────────────────────────────────┐
    │                 ☁️  Cloud Run                        │
    │                 (Main API)                          │
    │  ┌─────────────────────────────────────────────────┐│
    │  │  • Express.js + TypeScript                      ││
    │  │  • AuthService                                  ││
    │  │  • PubSubService                                ││
    │  │  • Business Logic                               ││
    │  │  • Auto-scaling (0-10 instances)                ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘
                            │                              
                            │ Publish Message             
                            ▼                              
    ┌─────────────────────────────────────────────────────┐
    │                📬 Google Pub/Sub                     │
    │               (Message Queue)                       │
    │  ┌─────────────────────────────────────────────────┐│
    │  │  • Topic: email-notifications                   ││
    │  │  • Asynchronous Processing                      ││
    │  │  • Auto Retry on Failure                        ││
    │  │  • Reliable Message Delivery                    ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘
                            │                              
                            │ Trigger Function            
                            ▼                              
    ┌─────────────────────────────────────────────────────┐
    │               ⚡ Cloud Function                       │
    │             (Email Processor)                       │
    │  ┌─────────────────────────────────────────────────┐│
    │  │  • Node.js 18 Runtime                          ││
    │  │  • HTML Email Templates                        ││
    │  │  • SMTP Integration                             ││
    │  │  • Error Handling & Retry                      ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘
                            │                              
                            │ SMTP Email                  
                            ▼                              
    ┌─────────────────────────────────────────────────────┐
    │                📧 Mailjet                            │
    │              (Email Service)                        │
    │  ┌─────────────────────────────────────────────────┐│
    │  │  • OTP Email Delivery                           ││
    │  │  • Email Templates                              ││
    │  │  • Delivery Tracking                            ││
    │  │  • High Deliverability                          ││
    │  └─────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────┘
                            │                              
                            ▼                              
                    📧 User's Email Inbox                  

      ┌─────────────────────────────────────────────────┐  
      │              🗄️  MySQL Database                  │  
      │              (Cloud SQL)                        │  
      │  ┌─────────────────────────────────────────────┐ │  
      │  │  • Users & Authentication                   │ │  
      │  │  • Menus & Recipes                          │ │  
      │  │  • Stock Management                         │ │  
      │  │  • OTP Storage                              │ │  
      │  └─────────────────────────────────────────────┘ │  
      └─────────────────────────────────────────────────┘  
                            ▲                              
                            │ Database Queries            
                            │ (Connected to Cloud Run)    
```

### Key Benefits:

🚀 **Scalability**: Auto-scaling from 0 to 10 instances based on traffic  
⚡ **Performance**: Asynchronous email processing doesn't block API responses  
🔒 **Reliability**: Pub/Sub ensures message delivery with automatic retry  
💰 **Cost Efficient**: Pay only for actual usage (serverless architecture)  
🛡️ **Security**: Google Cloud Platform enterprise-grade security  
📊 **Monitoring**: Built-in logging and monitoring for all components

---

## Installation and Setup

### Prerequisites

1. **Node.js** (v18.x or newer)
2. **npm** (v9.x or newer)
3. **MySQL** (local or Cloud SQL)
4. **Google Cloud Account** with billing enabled
5. **Mailjet Account** for email service

### Local Development Setup

1. **Clone this repository:**
   ```bash
   git clone https://github.com/username/backend-sicuan.git
   cd backend-sicuan
   ```

2. **Install dependencies:**
   ```bash
   # Main application
   npm install
   
   # Cloud Function dependencies
   cd functions/email-processor
   npm install
   cd ../..
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="mysql://user:password@localhost:3306/sicuan_db"
   
   # JWT
   JWT_SECRET="your_super_secret_jwt_key_minimum_32_characters"
   
   # Google Cloud
   GOOGLE_CLOUD_PROJECT="your-project-id"
   EMAIL_TOPIC_NAME="email-notifications"
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. **Setup the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run locally:**
   ```bash
   # Development mode
   npm run dev
   
   # Build for production
   npm run build
   npm start
   ```

### Cloud Deployment

1. **Set up Google Cloud authentication:**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Set environment variables for deployment:**
   ```bash
   export MAILJET_API_KEY="your_mailjet_api_key"
   export MAILJET_SECRET_KEY="your_mailjet_secret_key"
   export MAILJET_SENDER="noreply@yourdomain.com"
   export DATABASE_URL="your_production_database_url"
   export JWT_SECRET="your_production_jwt_secret"
   ```

3. **Deploy to Google Cloud:**
   ```bash
   # Make deploy script executable
   chmod +x deploy.sh
   
   # Deploy everything (Cloud Function + Cloud Run)
   ./deploy.sh
   ```

---

## API Documentation

### **Local Development**
```bash
http://localhost:5000/api-docs
```

### **Production**
```bash
https://your-cloud-run-url/api-docs
```


---

## Project Structure

```bash
backend-sicuan/
├── src/                          # Main application source
│   ├── config/                   # Application configuration
│   ├── controllers/              # API controllers
│   ├── exceptions/               # Custom error definitions
│   ├── middlewares/              # Express middlewares
│   ├── models/                   # Data models (Prisma)
│   ├── routes/                   # API route definitions
│   ├── services/                 # Business logic
│   │   ├── AuthService.ts        # Authentication with Pub/Sub
│   │   └── PubSubService.ts      # Google Cloud Pub/Sub integration
│   ├── types/                    # TypeScript type definitions
│   ├── utils/                    # Utility functions
│   ├── validators/               # Input validation
│   ├── app.ts                    # Express application
│   └── server.ts                 # Application entry point
├── functions/                    # Cloud Functions
│   └── email-processor/          # Email processing function
│       ├── index.js              # Function entry point
│       └── package.json          # Function dependencies
├── prisma/                       # Prisma ORM configuration
├── build/                         # Compiled JavaScript (generated)
├── logs/                         # Application logs (local dev)
├── deploy.sh                     # Deployment automation script
├── test-pubsub.js               # Pub/Sub testing utility
├── Dockerfile                    # Container configuration
├── .env.example                  # Example environment variables
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## Available Scripts

### **Development**
```bash
npm run dev                # Start development server with hot reload
npm run build              # Build TypeScript to JavaScript
npm run start              # Start production server
npm run clean              # Clean build directory
```

### **Deployment & Monitoring**
```bash
npm run deploy             # Deploy to Google Cloud
npm run deploy:function    # Deploy only Cloud Function
npm run deploy:cloudrun    # Deploy only Cloud Run
npm run logs:function      # View Cloud Function logs
npm run logs:cloudrun      # View Cloud Run logs
npm run setup:gcloud       # Enable required Google Cloud APIs
npm run create:topic       # Create Pub/Sub topic manually
```

---

## Environment Variables

### **Required Variables**

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=your_jwt_secret_minimum_32_characters

# Google Cloud
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
EMAIL_TOPIC_NAME=email-notifications

# Server Configuration
PORT=5000
NODE_ENV=production
```

### **Cloud Function Variables** (Set during deployment)

```env
# Mailjet Email Service
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
MAILJET_SENDER=noreply@yourdomain.com
```

---

## API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/send-otp` - Send OTP via email (uses Cloud Functions)
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/reset-password` - Reset password with OTP

### **Menu Management**
- `GET /api/menus` - Get user menus
- `POST /api/menus` - Create new menu
- `PUT /api/menus/:id` - Update menu
- `DELETE /api/menus/:id` - Delete menu

### **Recipe/HPP Management**
- `GET /api/menus/:menuId/recipes` - Get menu recipes
- `POST /api/menus/:menuId/recipes` - Add recipe ingredient
- `PUT /api/menus/:menuId/recipes/:bahanId` - Update ingredient
- `DELETE /api/menus/:menuId/recipes/:bahanId` - Delete ingredient

### **Stock Management**
- `GET /api/stock` - Get stock items
- `POST /api/stock` - Add stock item
- `PUT /api/stock/:id` - Update stock
- `DELETE /api/stock/:id` - Delete stock

---

## Security Features

This API implements comprehensive security measures:

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevent brute force and DDoS attacks
- **HTTP Security**: Helmet.js for security headers
- **Input Validation**: Zod schema validation for all inputs
- **XSS Protection**: Cross-site scripting prevention
- **HPP Protection**: HTTP Parameter Pollution prevention
- **CORS**: Cross-Origin Resource Sharing configuration
- **Environment Isolation**: Separate development and production configs

---

## Deployment Architecture

### **Cloud Run (Main API)**
- **Runtime**: Node.js 18 with TypeScript
- **Scaling**: 0-10 instances (auto-scaling)
- **Memory**: 1GB per instance
- **CPU**: 1 vCPU per instance
- **Health Checks**: Kubernetes-style probes

### **Cloud Functions (Email Processor)**
- **Runtime**: Node.js 18
- **Trigger**: Pub/Sub topic
- **Memory**: 256MB
- **Timeout**: 9 minutes
- **Retry**: Automatic retry on failure

### **Pub/Sub (Message Queue)**
- **Topic**: email-notifications
- **Delivery**: At-least-once delivery
- **Retention**: 7 days
- **Ordering**: Not required for email

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Write tests for new features
- Follow TypeScript and ESLint rules
- Update documentation for API changes
- Test locally before pushing
- Use semantic commit messages

---

## Performance & Scalability

- **Auto-scaling**: Cloud Run scales from 0 to 10 instances based on traffic
- **Async Processing**: Email processing doesn't block API responses
- **Connection Pooling**: Database connections are pooled for efficiency
- **Caching**: In-memory caching for frequent queries
- **CDN Ready**: Static assets can be served via CDN

---

## Support & Documentation

- **API Documentation**: Available at `/api-docs` endpoint
- **Health Status**: Available at `/health` endpoint
- **Issue Tracking**: GitHub Issues
- **Support**: [WhatsApp Support](https://wa.me/6285947354250)

---

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Author

**Alief Arifin**  
📧 Email: aliefarifin99@gmail.com  
🔗 GitHub: [@aliefarifin](https://github.com/aliefarifin)

---

## Acknowledgments

- Express.js team for the robust framework
- Google Cloud Platform for scalable infrastructure
- Mailjet for reliable email delivery
- Prisma team for excellent database ORM
- TypeScript team for type safety