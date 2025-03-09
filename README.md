# SiCuan

## Description

**SiCuan** is an app designed to help MSMEs manage their finances. With features such as login, dashboard, COGS, selling price, auto stock, sales, and margin, this app aims to make daily financial management easier for small and medium business owners.

---

## Key Features

- **Transaction Record**: Add income or expenses with customizable categories.
- **Transaction History**: View a complete list of past transactions.
- **Stock Management**: Manage product stock with an automatic feature to update stock quantities based on transactions..
- **Recipe Management**: Set and manage recipes for products, including ingredients used and calculations, for easy production and cost management.

---

## Technologies Used

- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: JWT & Accounts

---

## Installation and Setup

### Prerequisites

1. Make sure you have **Node.js** (v14 or newer) and **npm/yarn** installed on your computer.
2. A configured database.

### Installation Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/username/SiCuan.git
   cd money-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   # or if using yarn
   yarn install
   ```
3. Configure the `.env` file:
   - Copy the `.env.example` to `.env`.
   - Fill in the environment variable values such as database URL, API keys, etc.
4. Run the application:
   ```bash
   npm start
   # or
   yarn start
   ```

---

## API Documentation

## Authentication

### Register

- **Endpoint**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "confirmPassword": "string"
  }
  ```
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one number
  - At least one special character
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Resource created successfully",
    "data": "Registration Successfully"
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "message": "Password and Confirm Password must be the same.",    
  }
  ```
  ```json
  {
    "success": false,
    "message": "Email already exists",    
  }
  ```
  ```json
  {
    "success": false,
    "message": "Invalid email format",    
  }
  ```
  ```json
  {
    "success": false,
    "message": "Password must be at least 8 characters.",    
  }
  ```
  ```json
  {
    "success": false,
    "message": "Password must begin with an uppercase letter.",    
  }
  ```
  ```json
  {
    "success": false,
    "message": "Password must contain at least one number.",    
  }
  ```
  ```json
  {
    "success": false,
    "message": "Password must contain at least one special character.",    
  }
  ```
  ```json
  {
    "success": false,
    "message": "",    
  }
  ```

### Login

- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
        "userID": userId,
        "username": "username",
        "active_token": "expected_token"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "message": "Invalid Password"
  }
  ```
  ```json
  {
    "success": false,
    "message": "User Not Found"
  }
  ```