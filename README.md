## DevMatch: A Developer-Focused Dating Application

## Project Overview

**DevMatch** is a full-stack dating application built specifically for software developers to connect, discover matches, and collaborate based on shared technical interests and professional backgrounds. Developed as a **WC Launchpad Builder Round** project, it is a minimal viable product (MVP) completed within a five-day sprint (October 27-31, 2025), designed to showcase technical skills, product sense, and full-stack development capabilities.

The application enables users to create comprehensive developer profiles, browse and swipe through potential matches, establish mutual connections, and engage in real-time messaging with matched users.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture \& Design](#architecture--design)
- [Project Structure](#project-structure)
- [Authentication System](#authentication-system)
- [Core Modules](#core-modules)
- [Database Schema](#database-schema)
- [Setup \& Installation](#setup--installation)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Key Implementation Details](#key-implementation-details)

## Key Features

### User Authentication \& Profiles

- **Multi-provider authentication** via credentials, Google OAuth, and GitHub OAuth
- **Email verification** with token-based secure links
- **Password reset functionality** via email tokens
- **Two-step registration process** with profile completion
- **Profile completion flow** for social login users

### Matching \& Discovery

- **Swipe interface** for discovering other developers with intuitive card-based browsing
- **Like/Unlike functionality** to express interest in other profiles
- **Mutual matching logic** to identify when two users have liked each other
- **Member discovery** with pagination and filtering

### Real-Time Messaging

- **Matched member chat** using Pusher for real-time message synchronization
- **Message history** with read receipts and timestamps
- **Unread message tracking** with client-side state management
- **Message notifications** via Pusher channels

### Profile Management

- **Profile editing** with ability to update bio, location, and personal details
- **Photo uploads** to Cloudinary with signed image URLs
- **Member photo gallery** display for enhanced profile viewing
- **Presence indicators** showing online/offline status

### User Interface

- **Responsive design** using Tailwind CSS and Lucide icons
- **Light/dark mode** support with theme toggle
- **Component-based architecture** using shadcn/ui components
- **Smooth animations** via Framer Motion for interactive CTAs and transitions

## Tech Stack

### Frontend

| Technology                  | Purpose                                                                       |
| :-------------------------- | :---------------------------------------------------------------------------- |
| **Next.js 16** (App Router) | React meta-framework with server/client components, routing, and optimization |
| **React 19.2**              | UI component library and state management                                     |
| **TypeScript 5**            | Type-safe JavaScript for robust development                                   |
| **Tailwind CSS 4**          | Utility-first CSS framework for responsive styling                            |
| **shadcn/ui**               | Pre-built, customizable Radix UI components                                   |
| **Lucide React**            | Icon library for UI elements                                                  |
| **React Hook Form 7.65**    | Form state management and validation                                          |
| **Zod 4.1**                 | TypeScript-first schema validation                                            |
| **Framer Motion 12.23**     | Animation library for smooth transitions and interactions                     |
| **Zustand 5**               | Lightweight state management for client-side stores                           |
| **next-themes 0.4**         | Dark/light mode theme management                                              |
| **Pusher.js 8.4**           | Real-time WebSocket messaging                                                 |

### Backend

| Technology             | Purpose                                  |
| :--------------------- | :--------------------------------------- |
| **Next.js API Routes** | Serverless backend endpoints             |
| **NextAuth 5 (Beta)**  | Authentication and session management    |
| **Prisma 6.18**        | TypeScript ORM for database interactions |
| **PostgreSQL** (Neon)  | Relational database                      |
| **Bcryptjs 3**         | Password hashing and encryption          |
| **Pusher 5.2**         | Real-time messaging and presence         |
| **Cloudinary 2.8**     | Image storage and CDN                    |
| **Resend 6.4**         | Email delivery service                   |

### Development Tools

| Tool                     | Purpose                               |
| :----------------------- | :------------------------------------ |
| **ESLint 9 \& Prettier** | Code linting and formatting           |
| **PostCSS 4**            | CSS processing with Tailwind          |
| **tsx 4.20**             | TypeScript execution for seed scripts |

## Architecture \& Design

### Full-Stack Architecture

DevMatch follows a **modern full-stack Next.js architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │ React Components, TypeScript, Tailwind UI        │   │
│  │ (Next.js App Router, Client/Server Components)  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────────────────────┐
│                  Next.js Backend                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Server Actions, API Routes, Middleware (Auth)    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ Database Queries
┌────────────────────▼────────────────────────────────────┐
│  PostgreSQL (Neon) + Prisma ORM                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Users, Members, Messages, Likes, Tokens, Accounts   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Input
    ↓
[Login Form / Social Redirect]
    ↓
NextAuth Credentials/OAuth Provider
    ↓
[Token Validation & JWT Generation]
    ↓
Session Storage (JWT in Cookies)
    ↓
Middleware Redirect Check (proxy.ts)
    ↓
[Profile Complete? → Yes/No]
    ↓
Authenticated Session Access
```

### Real-Time Messaging Architecture

- **Pusher Integration**: Enables WebSocket-based real-time message delivery
- **Server Actions**: Server-side functions for mutations (sendMessage, likeUser)
- **Zustand Stores**: Client-side state for message history and unread counts
- **Hooks**: Custom React hooks (useMessages, usePresenceChannel, useNotificatioChannel) for data binding

## Project Structure

```
zzelif-builder-round-devmatch/
├── README.md                          # Overview and setup guide
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript configuration
├── next.config.ts                     # Next.js configuration (Cloudinary images)
├── components.json                    # shadcn/ui configuration
├── postcss.config.mjs                 # PostCSS and Tailwind setup
├── eslint.config.mjs                  # ESLint configuration
├── prisma.config.ts                   # Prisma configuration
│
├── prisma/
│   ├── schema.prisma                  # Database schema (models, relations)
│   ├── seed.ts                        # Database seeding script
│   └── membersData.ts                 # Test member data for seeding
│
└── src/
    ├── auth.ts                        # NextAuth initialization and callbacks
    ├── auth.config.ts                 # Auth providers configuration
    ├── proxy.ts                       # Auth middleware and route protection
    ├── routes.ts                      # Public/auth route definitions
    │
    ├── actions/                       # Server Actions (mutations)
    │   ├── authActions.ts             # Auth operations (signIn, register, etc.)
    │   ├── likeActions.ts             # Like/unlike operations
    │   ├── memberActions.ts           # Member profile operations
    │   ├── messageActions.ts          # Message operations
    │   └── userActions.ts             # User profile operations
    │
    ├── app/                           # Next.js App Router
    │   ├── layout.tsx                 # Root layout with providers
    │   ├── page.tsx                   # Home page
    │   ├── error.tsx                  # Error boundary
    │   ├── global-not-found.tsx       # 404 page
    │   ├── globals.css                # Global styles
    │   │
    │   ├── (auth)/                    # Auth route group
    │   │   ├── login/
    │   │   │   ├── page.tsx
    │   │   │   ├── LoginForm.tsx
    │   │   │   └── SocialLogin.tsx    # OAuth buttons
    │   │   ├── register/              # Multi-step registration
    │   │   │   ├── page.tsx
    │   │   │   ├── RegisterForm.tsx
    │   │   │   ├── UserDetailsStep.tsx
    │   │   │   ├── ProfileDetailsStep.tsx
    │   │   │   └── success/
    │   │   ├── complete-profile/      # Profile completion for social users
    │   │   ├── verify-email/          # Email verification page
    │   │   ├── forgot-password/       # Password reset request
    │   │   └── reset-password/        # Password reset form
    │   │
    │   ├── api/                       # API Routes
    │   │   ├── auth/[...nextauth]/    # NextAuth handler
    │   │   ├── pusher-auth/           # Pusher authentication
    │   │   └── sign-image/            # Cloudinary image signing
    │   │
    │   ├── components/                # Global components and UI library
    │   │   ├── navbar/
    │   │   │   ├── TopNav.tsx
    │   │   │   ├── TopNavClient.tsx
    │   │   │   ├── Menu.tsx
    │   │   │   └── logo.tsx
    │   │   ├── ui/                    # shadcn/ui components
    │   │   │   ├── button.tsx
    │   │   │   ├── card.tsx
    │   │   │   ├── input.tsx
    │   │   │   ├── avatar.tsx
    │   │   │   ├── badge.tsx
    │   │   │   ├── tabs.tsx
    │   │   │   ├── dropdown-menu.tsx
    │   │   │   ├── select.tsx
    │   │   │   ├── dialog.tsx
    │   │   │   ├── popover.tsx
    │   │   │   ├── skeleton.tsx
    │   │   │   ├── spinner.tsx
    │   │   │   └── [other UI components]
    │   │   ├── Providers.tsx          # Context providers wrapper
    │   │   ├── ThemeToggle.tsx        # Dark/light mode toggle
    │   │   ├── MemberImage.tsx        # Image display component
    │   │   ├── MemberPhotos.tsx       # Photo gallery
    │   │   ├── ImageUploadButton.tsx  # Image upload UI
    │   │   ├── PresenceAvatar.tsx     # Online status indicator
    │   │   └── [other global components]
    │   │
    │   ├── networks/                  # Matching & discovery module
    │   │   ├── page.tsx               # Swipe interface
    │   │   ├── SwipeInterface.tsx     # Card-based swipe UI
    │   │   ├── MemberCard.tsx         # Individual member card
    │   │   ├── MemberSidebar.tsx      # Sidebar with member list
    │   │   │
    │   │   ├── [userId]/              # Dynamic member detail routes
    │   │   │   ├── page.tsx           # Member profile view
    │   │   │   ├── layout.tsx
    │   │   │   ├── loading.tsx        # Loading skeleton
    │   │   │   │
    │   │   │   ├── chat/              # DM chat interface
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── ChatForm.tsx
    │   │   │   │   ├── MessageBox.tsx
    │   │   │   │   └── MessageList.tsx
    │   │   │   │
    │   │   │   └── photos/            # Member photo gallery
    │   │   │       └── page.tsx
    │   │   │
    │   │   └── edit/                  # Profile editing
    │   │       ├── page.tsx           # Edit form page
    │   │       ├── EditForm.tsx
    │   │       └── photos/
    │   │           ├── page.tsx
    │   │           └── MemberPhotoUpload.tsx
    │   │
    │   ├── messages/                  # Messaging/inbox module
    │   │   ├── page.tsx               # Messages list
    │   │   ├── MessageTable.tsx       # Conversation table
    │   │   ├── MessageTableCell.tsx
    │   │   ├── MessageSidebar.tsx
    │   │   └── SyncUnreadStore.tsx    # Unread sync logic
    │   │
    │   └── lists/                     # Lists module (favorites, likes received)
    │       ├── page.tsx
    │       └── ListsTab.tsx
    │
    ├── components/                    # Root component exports
    │   └── [duplicates from app/components]
    │
    ├── hooks/                         # Custom React hooks
    │   ├── useMessages.ts             # Fetch and cache messages
    │   ├── useMessageStore.ts         # Message state (Zustand)
    │   ├── useNotificationChannel.ts  # Pusher notifications
    │   ├── usePresenceChannel.ts      # Pusher presence tracking
    │   └── usePresenceStore.ts        # Presence state
    │
    ├── lib/                           # Utility functions & configs
    │   ├── prisma.ts                  # Prisma client singleton
    │   ├── pusher.ts                  # Pusher server configuration
    │   ├── cloudinary.ts              # Cloudinary image config
    │   ├── mail.ts                    # Email sending logic
    │   ├── tokens.ts                  # Token generation & validation
    │   ├── utils.ts                   # General utilities
    │   ├── mappings.ts                # Data mappings
    │   └── schemas/                   # Zod validation schemas
    │       ├── LoginSchema.ts
    │       ├── RegisterSchema.ts
    │       ├── ForgotPasswordSchema.ts
    │       ├── MessagesSchema.ts
    │       └── EditSchema.ts
    │
    └── types/                         # TypeScript type definitions
        ├── index.d.ts                 # Global types (ActionResult, MessageDto)
        └── next-auth.d.ts             # NextAuth type extensions
```

## Authentication System

### Providers \& Strategies

**NextAuth v5 (Beta)** provides multi-authentication support:

1. **Credentials Provider**
   - Email/password authentication
   - Credentials validated via `loginSchema` (Zod)
   - Password verified using bcryptjs comparison
2. **Google OAuth**
   - Client ID/Secret from Google Cloud Console
   - User profile mapped with `profileComplete: false`
3. **GitHub OAuth**
   - Separate credentials for dev and production
   - Ideal for developer-focused platform

### Session \& JWT Flow

The `auth.ts` file orchestrates authentication with custom callbacks:

- **JWT Callback**: Updates token with user data and profile completion status
- **Session Callback**: Enriches session with JWT payload for client access
- **Adapter**: Uses `@auth/prisma-adapter` for user/account persistence
- **Strategy**: JWT-based sessions with 30-day expiration

### Email Verification \& Password Reset

- **Token Generation**: Creates unique, time-bound tokens for email verification and password reset
- **Email Delivery**: Uses Resend service for transactional emails
- **Token Expiration**: Tokens expire after configurable duration, enforced at verification

### Middleware \& Route Protection

`proxy.ts` implements middleware logic:

- Protects routes via auth middleware
- Redirects unauthenticated users to `/login`
- Forces profile completion for social login users
- Differentiates public vs. auth-only routes

## Core Modules

### 1. Authentication Module

**File**: `src/actions/authActions.ts`

**Key Functions**:

- `signInUser(data)` - Credentials-based login with email verification check
- `registerUser(data)` - Multi-step registration with profile and photo creation
- `verifyEmail(token)` - Confirms email ownership via token
- `resetPassword(password, token)` - Updates password with token validation
- `completeSocialLoginProfile(data)` - Finalizes social login with profile details
- `generateResetPasswordEmail(email)` - Initiates password reset flow

### 2. Matching \& Like System

**File**: `src/actions/likeActions.ts`

**Functionality**:

- **Like User**: Records unidirectional interest
- **Unlike User**: Removes previous like
- **Check Mutual Likes**: Identifies two-way matches
- **Fetch Likes**: Retrieves outgoing/incoming likes with pagination
- **Discover Members**: Returns list of non-liked users for swiping

**Database Model**:

```prisma
model Like {
  id           String   @id @default(cuid())
  sourceUserId String
  targetUserId String
  createdAt    DateTime @default(now())
  sourceMember Member   @relation("sourceLikes", ...)
  targetMember Member   @relation("targetLikes", ...)
  @@unique([sourceUserId, targetUserId])
}
```

This ensures each user can like another only once.

### 3. Messaging System

**File**: `src/actions/messageActions.ts`

**Core Features**:

- **Send Message**: Creates message record with Pusher notification
- **Fetch Conversations**: Retrieves unique conversations with latest message
- **Get Messages**: Fetches message history between two members
- **Mark as Read**: Updates `dateRead` timestamp
- **Delete Message**: Soft-delete for sender/recipient separately

**Real-Time Integration**:

- Pusher channels notify matched users of new messages
- Message store (Zustand) caches and syncs in real-time
- Custom hooks (useMessages, useNotificationChannel) bind data to components

### 4. Member Profile Management

**File**: `src/actions/memberActions.ts`

**Capabilities**:

- **Fetch Member**: Retrieves user profile with photos and member details
- **Update Member**: Modifies bio, location, and profile info
- **Upload Photos**: Handles Cloudinary integration for image storage
- **Delete Photo**: Removes image from profile
- **Get All Members**: Returns paginated list with filtering

## Database Schema

### Core Models

**User Model**

```prisma
model User {
  id              String    @id @default(cuid())
  name            String?
  email           String    @unique
  emailVerified   DateTime?
  passwordHash    String?
  image           String?
  profileComplete Boolean   @default(false)
  created         DateTime  @default(now())
  updated         DateTime  @updatedAt
  accounts        Account[]
  member          Member?
}
```

- Stores authentication credentials and basic info
- One-to-one relation with Member model
- Tracks profile completion status

**Member Model**

```prisma
model Member {
  id                String    @id @default(cuid())
  userId            String    @unique
  name              String
  age               Int
  gender            Gender
  dateOfBirth       DateTime
  bio               String
  city              String
  country           String
  image             String?
  sourceLikes       Like[]    @relation("sourceLikes")
  targetLikes       Like[]    @relation("targetLikes")
  user              User      @relation(...)
  recipientMessages Message[] @relation("recipient")
  senderMessages    Message[] @relation("sender")
  photos            Photo[]
}

enum Gender {
  MALE
  FEMALE
  NON_BINARY
  PREFER_NOT_TO_SAY
}
```

- Extends User with dating profile details
- Supports many-to-many relationships via Like model
- Maintains message relationships (sender/recipient)

**Like Model**

```prisma
model Like {
  id           String   @id @default(cuid())
  sourceUserId String
  targetUserId String
  createdAt    DateTime @default(now())
  sourceMember Member   @relation("sourceLikes", ...)
  targetMember Member   @relation("targetLikes", ...)
  @@unique([sourceUserId, targetUserId])
}
```

- Records directional interest between members
- Unique constraint prevents duplicate likes

**Message Model**

```prisma
model Message {
  id               String    @id @default(cuid())
  text             String
  created          DateTime  @default(now())
  senderId         String?
  recipientId      String?
  dateRead         DateTime?
  senderDeleted    Boolean   @default(false)
  recipientDeleted Boolean   @default(false)
  recipient        Member?   @relation("recipient", ...)
  sender           Member?   @relation("sender", ...)
}
```

- Stores chat messages between matched members
- Read receipts via `dateRead`
- Soft-delete flags for privacy

**Photo Model**

```prisma
model Photo {
  id       String  @id @default(cuid())
  url      String
  publicId String?
  memberId String
  member   Member  @relation(...)
}
```

- Associates images with member profiles
- Stores Cloudinary public ID for management

**Token Model**

```prisma
model Token {
  id      String    @id @default(cuid())
  email   String
  token   String
  expires DateTime
  type    TokenType
  @@unique([email, token])
}

enum TokenType {
  VERIFICATION
  PASSWORD_RESET
}
```

- Temporary tokens for email verification and password resets

**Account Model**

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(...)
  @@unique([provider, providerAccountId])
}
```

- NextAuth adapter model for OAuth accounts

## Setup \& Installation

### Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, or **pnpm** package manager
- **PostgreSQL** database (local or cloud via Neon)
- **Git** for version control

### Clone \& Install

```bash
# Clone repository
git clone https://github.com/zzelif/builder-round-devmatch.git
cd zzelif-builder-round-devmatch

# Install dependencies
npm install
# or
yarn install
```

### Database Operations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations on prod
npx prisma migrate deploy

# Create and apply new database migration
npx prisma migrate dev

# Seed database with test data
npx prisma db seed

# Open Prisma Studio for database inspection
npx prisma studio
```

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the project root with:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/devmatch"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-32+ chars"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (Development)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# GitHub OAuth (Production/Vercel)
GITHUB_CLIENT_ID_DEP="your-github-prod-client-id"
GITHUB_CLIENT_SECRET_DEP="your-github-prod-client-secret"

# Pusher (Real-time messaging)
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-app-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"

# Cloudinary (Image storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"
```

### Setup Steps

1. **PostgreSQL Database**: Create database and set `DATABASE_URL`
2. **NextAuth Secrets**: Generate via `openssl rand -base64 32`
3. **OAuth Credentials**: Register apps at Google Cloud Console and GitHub
4. **Pusher Account**: Create at pusher.com for real-time features
5. **Cloudinary Account**: Sign up for image storage
6. **Resend Account**: Register for transactional email

## Development Workflow

### Key npm Scripts

| Script                 | Purpose                                                                 |
| :--------------------- | :---------------------------------------------------------------------- |
| `npm run dev`          | Start development server on port 3000                                   |
| `npm run build`        | Build production bundle                                                 |
| `npm run start`        | Start production server                                                 |
| `npm run lint`         | Run ESLint checks                                                       |
| `npm run vercel-build` | Build script for Vercel deployment (includes DB migrations and seeding) |

### Code Organization Best Practices

- **Server Actions** in `src/actions/` for mutations and database queries
- **Components** split into UI components (`/ui`), feature components, and pages
- **Hooks** in `src/hooks/` for reusable stateful logic
- **Lib** utilities isolated in `src/lib/` for configuration and helpers
- **Schemas** in `src/lib/schemas/` for Zod validation

### Type Safety with TypeScript

- Custom type definitions in `src/types/`
- NextAuth types extended for `profileComplete` status
- Action results wrapped in `ActionResult<T>` type for consistent error handling

## Deployment

### Vercel Deployment

**Automatic via Vercel CLI or Git Integration**:

```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
# Run build process from package.json: npm run vercel-build
```

**Build Process**:

The `vercel-build` script automates:

1. Prisma client generation
2. Database migrations
3. Database seeding
4. Next.js build

### Environment Variables on Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy to apply

### Production Considerations

- **Database**: Use managed PostgreSQL (Neon, AWS RDS, Vercel Postgres)
- **NEXTAUTH_URL**: Set to production domain
- **NEXTAUTH_SECRET**: Use strong, 32+ character secret
- **Image Optimization**: Enabled via Next.js with Cloudinary CDN

## Key Implementation Details

### Real-Time Messaging with Pusher

Pusher enables instant message delivery and presence tracking:

```typescript
// Server: Send message via Pusher
await pusher.trigger(`private-chat-${conversationId}`, "message", { message });

// Client: Subscribe to Pusher channel
const channel = pusher.subscribe(`private-chat-${conversationId}`);
channel.bind("message", (data) => {
  // Update UI with new message
});
```

**Custom Hooks**:

- `useNotificationChannel()` listens for new messages
- `usePresenceChannel()` tracks online members
- `useMessages()` fetches and caches message history

### Image Management with Cloudinary

Images are uploaded to Cloudinary for storage and CDN delivery:

- **Client-Side Upload**: Uses CldUploadWidget or direct API
- **Server-Side Signing**: Signs URLs for secure image access
- **Public ID Storage**: Saved in database for future management

### Form Validation with Zod

All forms validated server-side using Zod schemas:

```typescript
// Example: RegisterSchema
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  age: z.number().min(18),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]),
  // ... more fields
});
```

Client-side integration via React Hook Form and resolvers.

### State Management

- **Zustand Stores**: Message and presence state for real-time sync
- **React Query Integration**: Optional for server state (can be added)
- **Context API**: For theme and authentication context

### UI/UX with Tailwind \& shadcn

- **Responsive Design**: Mobile-first Tailwind utilities
- **Dark Mode**: Managed via `next-themes` with CSS variables
- **Component Library**: Pre-built, accessible shadcn components
- **Icons**: Lucide React for consistent icon set
- **Animations**: Framer Motion for smooth transitions on CTAs

### Seed Data

`prisma/membersData.ts` includes 10 test members with:

- Diverse backgrounds (engineers, designers, wellness coaches)
- Realistic bios and locations (Vancouver area)
- Sample profile images

Run `npx prisma db seed` to populate the database.

---

## Conclusion

**DevMatch** demonstrates a production-ready full-stack dating application built with modern technologies. It combines **robust authentication**, **real-time messaging**, **intuitive UI design**, and **scalable architecture** to create an engaging platform for developers to connect and collaborate.

The modular structure, TypeScript type safety, and comprehensive use of industry-standard libraries make it an excellent foundation for further features such as advanced filtering, recommendation algorithms, verification systems, and in-app notifications.

---

This README provides a comprehensive foundation for understanding, developing, and deploying the DevMatch application. For questions or contributions, refer to the repository structure and inline code documentation.
<span style="display:none"></span>
