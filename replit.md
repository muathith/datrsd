# Diriyah - Saudi Cultural Heritage Website

## Overview

This is a bilingual (Arabic/English) cultural heritage website for Diriyah, a historic district in Saudi Arabia. The application showcases events, experiences, destinations, and news related to Diriyah's history and culture. Built as a full-stack TypeScript application with a React frontend and Express backend, it follows a monorepo structure with shared code between client and server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Build Tool**: Vite with hot module replacement
- **RTL Support**: Built-in right-to-left layout for Arabic language (default)

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Static Serving**: Production builds served from `dist/public`
- **Development**: Vite middleware integration for HMR

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client/server)
- **Validation**: Zod schemas generated from Drizzle schemas via `drizzle-zod`
- **Migrations**: Drizzle Kit for schema migrations (`migrations/` directory)
- **Storage Interface**: Abstracted via `IStorage` interface in `server/storage.ts`

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/ui/  # shadcn/ui components
│       ├── pages/          # Route pages
│       ├── hooks/          # Custom React hooks
│       └── lib/            # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data storage interface
│   └── vite.ts       # Development Vite integration
├── shared/           # Shared code (schemas, types)
└── migrations/       # Database migrations
```

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets/*` → `./attached_assets/*`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for Express sessions

### UI/Styling
- **Google Fonts**: Noto Sans Arabic, Tajawal, Cairo (Arabic typography)
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Replit Plugins**: Development banner, cartographer, and error overlay for Replit environment

### Key Runtime Dependencies
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing
- **zod**: Runtime type validation
- **class-variance-authority**: Component variant styling
- **date-fns**: Date manipulation
- **embla-carousel-react**: Carousel functionality