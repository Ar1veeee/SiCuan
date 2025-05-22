# SiCuan

## Description

**SiCuan** is the REST API backend for the SiCuan application, a platform designed to help restaurants and culinary businesses manage their menus, recipes, and inventory stock. Built with Express.js and TypeScript, this API provides a robust foundation for restaurant management operations.

---

## Key Features

- **Authentication**: Secure user registration, login, and password reset functionality.
- **Menu Management**: Create, read, update, and delete menu items.
- **Recipe/COGS Management**: Track ingredients, calculate production costs, and manage recipes.
- **Stock Management**: Monitor stock levels, record stock movements, and manage inventory.
- **Profile Management**: View and update user profiles, change passwords securely.

---

## Technologies Used

- **Framework**: Express.js with TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT (JSON Web Token)
- **Email** Service: Nodemailer with Mailjet
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, HPP, XSS Protection, Rate Limiting
- **Logging**: Winston, Morgan

---

## Installation and Setup

### Prerequisites

1. Node.js (v18.x or newer)
2. npm (v9.x or newer)
3. MySQL

### Installation Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/username/backend-sicuan.git
   cd backend-sicuan
   ```
2. Install dependencies:
   ```bash
   npm install
   # or if using yarn
   yarn install
   ```
3. Configure the `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Setup the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Run the application:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm run prod
   ```

---

## API Documentation
  ```bash
  http://localhost:5000/api-docs
  ```

---

## Project Structure

  ```bash
  backend-sicuan/
  ├── src/                    # Source code
  │   ├── config/             # Application configuration
  │   ├── controllers/        # API controllers
  │   ├── exceptions/         # Custom error definitions
  │   ├── middlewares/        # Express middlewares
  │   ├── models/             # Data models (Prisma)
  │   ├── routes/             # API route definitions
  │   ├── services/           # Business logic and integrations
  │   ├── types/              # TypeScript type definitions
  │   ├── utils/              # Utility functions
  │   ├── validators/         # Input validation
  │   ├── app.ts              # Express application
  │   └── server.ts           # Application entry point
  ├── prisma/                 # Prisma ORM configuration
  ├── logs/                   # Application logs
  ├── .env                    # Environment variables
  ├── .env.example            # Example environment variables
  ├── package.json            # Node.js dependencies
  └── tsconfig.json           # TypeScript configuration
  ```

---

## Security Features
This API implements various security features:
- Helmet for HTTP security headers
- Rate limiting to prevent brute force attacks
- XSS protection
- HPP protection
- Input validation with Zod
- JWT for authentication

## Author
Aliefarifin
