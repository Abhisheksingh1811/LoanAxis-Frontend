# LoanAxis Frontend

**LoanAxis — Secure Loan Origination & Servicing Platform**

A modern role-based fintech frontend built with **React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, Axios, Recharts, and Radix UI**.

This repository contains the frontend application for LoanAxis. It connects to the LoanAxis backend through the API Gateway and provides separate dashboards for customers, credit officers, and admins.

---

## Project Overview

LoanAxis Frontend is the user interface for a secure loan origination and servicing platform.

It supports customer onboarding, loan applications, application tracking, loan tracking, officer review workflows, admin user security controls, audit log monitoring, and login history views.

The frontend is maintained as a separate repository from the backend.

---

## Architecture

```text
LoanAxis Frontend
React + TypeScript + Vite
        |
        v
LoanAxis API Gateway
http://localhost:8085
        |
        v
LoanAxis Backend
Spring Boot + PostgreSQL + Redis + RabbitMQ + Docker Compose
```

The frontend communicates only with the API Gateway. The gateway routes requests to the main backend services.

---

## Backend Repository

The backend is maintained in a separate repository.

Backend stack:

* Java 21
* Spring Boot
* Spring Security
* Spring Cloud API Gateway
* PostgreSQL
* Redis
* RabbitMQ
* Docker Compose
* JWT Authentication
* Transactional Outbox
* Notification Microservice

Backend repository:

```text
https://github.com/Abhisheksingh1811/LoanAxis-Backend
```

---

## Tech Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS 4
* shadcn/ui
* Radix UI
* React Router DOM
* Axios
* Recharts
* TanStack React Table
* Lucide React
* Sonner
* next-themes

---

## Features

### Public Module

* Landing page
* Login page
* Register page
* LoanAxis branding
* Responsive UI
* Form validation feedback

---

### Authentication

* Login with backend JWT authentication
* Register as customer
* Protected routes
* Role-based route guarding
* Role-based redirect after login
* Token-based API requests
* Logout flow

---

### Customer Module

Customers can:

* View customer dashboard
* Apply for a loan
* View submitted loan applications
* View application details
* Track application status
* View active loans
* View loan details
* Track installments
* View login history
* Access settings

---

### Officer Module

Credit officers can:

* View officer dashboard
* View loan applications assigned to their district
* Filter/review loan applications
* View application details
* Approve pending applications
* Reject pending applications with reason
* View officer login history

The backend enforces officer-district authorization, so officers cannot approve or reject applications outside their assigned district.

---

### Admin Module

Admins can:

* View admin dashboard
* View security audit logs
* Filter audit logs
* Search users
* Filter users by role
* Filter users by district
* Filter users by lock status
* Lock suspicious users
* Unlock users
* Manage user security actions

---

## Folder Structure

```text
LoanAxis-Frontend/
│
├── public/
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## API Gateway Configuration

The frontend should call the backend through the API Gateway.

For local development:

```env
VITE_API_BASE_URL=http://localhost:8085
```

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8085
```

Do not commit `.env` to GitHub.

Recommended `.gitignore` entries:

```gitignore
.env
.env.local
```

For deployment, update the environment variable to the deployed gateway URL:

```env
VITE_API_BASE_URL=https://your-deployed-gateway-url
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone <frontend-repository-url>
cd LoanAxis-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8085
```

### 4. Start the development server

```bash
npm run dev
```

The frontend runs locally at:

```text
http://localhost:5173
```

---

## Available Scripts

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run linting

```bash
npm run lint
```

### Preview production build

```bash
npm run preview
```

---

## Required Backend Setup

Before using the frontend, start the backend services.

From the backend repository:

```bash
docker compose up -d --build
```

Expected backend containers:

```text
loanaxis-api-postgres
loanaxis-api-redis
loanaxis-api-rabbitmq
loanaxis-api-app
loanaxis-api-gateway
loanaxis-notification-service
```

Backend gateway should be available at:

```text
http://localhost:8085
```

The frontend should use this gateway URL as `VITE_API_BASE_URL`.

---

## Application Flow

### Customer Flow

```text
Register/Login
      |
      v
Customer Dashboard
      |
      v
Apply for Loan
      |
      v
Track Application Status
      |
      v
View Loan Details
      |
      v
Track Installments
```

---

### Officer Flow

```text
Officer Login
      |
      v
Officer Dashboard
      |
      v
View District Applications
      |
      v
Review Application
      |
      v
Approve / Reject
```

---

### Admin Flow

```text
Admin Login
      |
      v
Admin Dashboard
      |
      v
Audit Logs / User Directory
      |
      v
Lock / Unlock Users
```

---

## UI Highlights

* Clean fintech dashboard interface
* Role-based navigation
* Responsive page layout
* Reusable UI components
* shadcn/ui based component styling
* Lucide icons
* Dashboard cards and tables
* Smooth user search and filtering
* Admin-focused audit and user security screens

---

## Deployment Plan

Recommended deployment setup:

```text
Frontend: Vercel / Netlify
Backend: VPS or Cloud VM with Docker Compose
API URL: Deployed API Gateway URL
```

For a free demo setup:

```text
Frontend: Vercel
Backend: Local Docker Compose
Public backend URL: Cloudflare Tunnel / ngrok pointing to API Gateway
```

In production or hosted frontend environments, configure:

```env
VITE_API_BASE_URL=https://your-public-api-gateway-url
```

---

## Project Notes

Current frontend package name should be updated from:

```json
"secureloan-frontend"
```

to:

```json
"loanaxis-frontend"
```

After changing the package name, run:

```bash
npm install
```

This updates `package-lock.json`.

---

## Future Improvements

* Add deployed frontend link
* Add screenshots to README
* Add demo credentials section
* Add UI walkthrough GIF
* Add architecture diagram image
* Add CI/CD deployment workflow
* Add automated frontend tests
* Add improved error boundary handling
* Add loading skeletons across all pages

---

## Author

**Abhishek Singh**

LoanAxis Frontend is part of a full-stack fintech loan origination platform built to demonstrate secure frontend architecture, role-based dashboards, API integration, and production-style user workflows.
