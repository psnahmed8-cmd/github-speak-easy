# Overview

RootPilot is an AI-powered root cause analysis (RCA) platform designed for industrial and operational environments. The application enables users to upload process data, perform automated analysis using artificial intelligence, and generate comprehensive RCA reports with actionable recommendations. The platform features interactive visualizations, what-if scenario modeling, and comprehensive documentation to streamline incident investigation and problem-solving processes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a **React-based single-page application (SPA)** architecture with TypeScript for type safety. The frontend is built using:

- **Vite** as the build tool and development server for fast development and optimized production builds
- **Wouter** for client-side routing, providing a lightweight alternative to React Router
- **React Query** (@tanstack/react-query) for server state management and data fetching
- **Tailwind CSS** with **shadcn/ui** components for consistent, accessible UI design
- **React Hook Form** with Zod validation for form handling and input validation

The component architecture follows a modular approach with:
- Page components for route-level views
- Reusable UI components following the shadcn/ui pattern
- Custom hooks for data fetching and state management
- Context providers for global state (authentication)

## Backend Architecture
The backend follows a **REST API architecture** using:

- **Express.js** as the web framework with TypeScript
- **JWT-based authentication** with bcrypt for password hashing
- **Modular storage interface** pattern allowing for easy database switching
- **In-memory storage implementation** for development with clear migration path to database
- **Middleware-based request/response logging** for debugging and monitoring

The API design separates concerns with:
- Route handlers for HTTP request processing
- Storage layer abstraction for data persistence
- Authentication middleware for protected routes
- Error handling middleware for consistent error responses

## Data Storage Solutions
The application uses **Drizzle ORM** with **PostgreSQL** (Neon serverless) for production data persistence:

- **Schema-first approach** with shared TypeScript types between client and server
- **Database migrations** managed through Drizzle Kit
- **Connection pooling** via Neon serverless for scalability
- **Type-safe database operations** with automated schema inference

The storage architecture includes:
- User management (authentication, profiles, settings)
- Analysis project management with file associations
- JSON storage for flexible analysis results
- Timestamped records for audit trails

## Authentication and Authorization
The system implements **JWT-based stateless authentication**:

- **Registration and login flows** with email/password
- **Password reset functionality** with email verification
- **Protected route middleware** for API endpoints
- **Client-side authentication context** for UI state management
- **Token-based session management** with localStorage persistence

Security considerations include:
- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration and refresh patterns
- Input validation using Zod schemas
- CORS configuration for cross-origin requests

# External Dependencies

## AI/ML Services
- **OpenRouter API** for AI-powered root cause analysis and natural language processing
- Custom prompting system for industrial data interpretation and RCA report generation

## Database and Storage
- **Neon Database** (PostgreSQL) for primary data storage with serverless scaling
- **Supabase** integration for file storage and additional backend services
- **File upload handling** for CSV, Excel, and JSON data files

## UI and Design
- **Radix UI** primitives for accessible, unstyled component foundations
- **Lucide React** for consistent iconography
- **Tailwind CSS** for utility-first styling approach
- **Class Variance Authority** for component variant management

## Development and Build
- **Vite** with React plugin for development server and build optimization
- **Replit-specific plugins** for development environment integration
- **ESBuild** for server-side bundling and optimization
- **TypeScript** compiler for type checking across the entire stack

## Monitoring and Analytics
- **Development-mode logging** with request/response tracking
- **Error boundary handling** with runtime error overlays
- **Performance monitoring** through Vite's built-in tooling

The application is architected for scalability with clear separation of concerns, type safety throughout the stack, and flexible integration points for additional AI services and data sources.