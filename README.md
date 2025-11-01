---

# DevMatch: A Developer-Focused Dating Application[^1]

## Project Overview

**DevMatch** is a full-stack dating application built specifically for software developers to connect, discover matches, and collaborate based on shared technical interests and professional backgrounds. Developed as a **WC Launchpad Builder Round** project, it is a minimal viable product (MVP) completed within a five-day sprint (October 27-31, 2025), designed to showcase technical skills, product sense, and full-stack development capabilities.[^1]

The application enables users to create comprehensive developer profiles, browse and swipe through potential matches, establish mutual connections, and engage in real-time messaging with matched users.[^1]

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

### User Authentication \& Profiles[^1]

- **Multi-provider authentication** via credentials, Google OAuth, and GitHub OAuth[^1]
- **Email verification** with token-based secure links[^1]
- **Password reset functionality** via email tokens[^1]
- **Two-step registration process** with profile completion
- **Profile completion flow** for social login users[^1]

### Matching \& Discovery[^1]

- **Swipe interface** for discovering other developers with intuitive card-based browsing[^1]
- **Like/Unlike functionality** to express interest in other profiles[^1]
- **Mutual matching logic** to identify when two users have liked each other[^1]
- **Member discovery** with pagination and filtering[^1]

### Real-Time Messaging[^1]

- **Matched member chat** using Pusher for real-time message synchronization[^1]
- **Message history** with read receipts and timestamps[^1]
- **Unread message tracking** with client-side state management[^1]
- **Message notifications** via Pusher channels[^1]

### Profile Management[^1]

- **Profile editing** with ability to update bio, location, and personal details[^1]
- **Photo uploads** to Cloudinary with signed image URLs[^1]
- **Member photo gallery** display for enhanced profile viewing[^1]
- **Presence indicators** showing online/offline status[^1]

### User Interface[^1]

- **Responsive design** using Tailwind CSS and Lucide icons[^1]
- **Light/dark mode** support with theme toggle[^1]
- **Component-based architecture** using shadcn/ui components[^1]
- **Smooth animations** via Framer Motion for interactive CTAs and transitions[^1]

## Tech Stack

### Frontend[^1]

| Technology                       | Purpose                                                                       |
| :------------------------------- | :---------------------------------------------------------------------------- |
| **Next.js 16** (App Router) [^1] | React meta-framework with server/client components, routing, and optimization |
| **React 19.2** [^1]              | UI component library and state management                                     |
| **TypeScript 5** [^1]            | Type-safe JavaScript for robust development                                   |
| **Tailwind CSS 4** [^1]          | Utility-first CSS framework for responsive styling                            |
| **shadcn/ui** [^1]               | Pre-built, customizable Radix UI components                                   |
| **Lucide React** [^1]            | Icon library for UI elements                                                  |
| **React Hook Form 7.65** [^1]    | Form state management and validation                                          |
| **Zod 4.1** [^1]                 | TypeScript-first schema validation                                            |
| **Framer Motion 12.23** [^1]     | Animation library for smooth transitions and interactions                     |
| **Zustand 5** [^1]               | Lightweight state management for client-side stores                           |
| **next-themes 0.4** [^1]         | Dark/light mode theme management                                              |
| **Pusher.js 8.4** [^1]           | Real-time WebSocket messaging                                                 |

### Backend[^1]

| Technology                  | Purpose                                  |
| :-------------------------- | :--------------------------------------- |
| **Next.js API Routes** [^1] | Serverless backend endpoints             |
| **NextAuth 5 (Beta)** [^1]  | Authentication and session management    |
| **Prisma 6.18** [^1]        | TypeScript ORM for database interactions |
| **PostgreSQL** (Neon) [^1]  | Relational database                      |
| **Bcryptjs 3** [^1]         | Password hashing and encryption          |
| **Pusher 5.2** [^1]         | Real-time messaging and presence         |
| **Cloudinary 2.8**          | Image storage and CDN                    |
| **Resend 6.4**              | Email delivery service                   |

### Development Tools[^1]

| Tool                          | Purpose                               |
| :---------------------------- | :------------------------------------ |
| **ESLint 9 \& Prettier** [^1] | Code linting and formatting           |
| **PostCSS 4** [^1]            | CSS processing with Tailwind          |
| **tsx 4.20** [^1]             | TypeScript execution for seed scripts |

## Architecture \& Design

### Full-Stack Architecture

DevMatch follows a **modern full-stack Next.js architecture** with clear separation of concerns:[^1]

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

### Authentication Flow[^1]

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

### Real-Time Messaging Architecture[^1]

- **Pusher Integration**: Enables WebSocket-based real-time message delivery[^1]
- **Server Actions**: Server-side functions for mutations (sendMessage, likeUser)[^1]
- **Zustand Stores**: Client-side state for message history and unread counts[^1]
- **Hooks**: Custom React hooks (useMessages, usePresenceChannel, useNotificatioChannel) for data binding[^1]

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

### Providers \& Strategies[^1]

**NextAuth v5 (Beta)** provides multi-authentication support:[^1]

1. **Credentials Provider**[^1]
   - Email/password authentication[^1]
   - Credentials validated via `loginSchema` (Zod)[^1]
   - Password verified using bcryptjs comparison[^1]
2. **Google OAuth**[^1]
   - Client ID/Secret from Google Cloud Console[^1]
   - User profile mapped with `profileComplete: false`[^1]
3. **GitHub OAuth**[^1]
   - Separate credentials for dev and production[^1]
   - Ideal for developer-focused platform[^1]

### Session \& JWT Flow[^1]

The `auth.ts` file orchestrates authentication with custom callbacks:[^1]

- **JWT Callback**: Updates token with user data and profile completion status[^1]
- **Session Callback**: Enriches session with JWT payload for client access[^1]
- **Adapter**: Uses `@auth/prisma-adapter` for user/account persistence[^1]
- **Strategy**: JWT-based sessions with 30-day expiration[^1]

### Email Verification \& Password Reset[^1]

- **Token Generation**: Creates unique, time-bound tokens for email verification and password reset[^1]
- **Email Delivery**: Uses Resend service for transactional emails[^1]
- **Token Expiration**: Tokens expire after configurable duration, enforced at verification[^1]

### Middleware \& Route Protection[^1]

`proxy.ts` implements middleware logic:[^1]

- Protects routes via auth middleware
- Redirects unauthenticated users to `/login`[^1]
- Forces profile completion for social login users[^1]
- Differentiates public vs. auth-only routes[^1]

## Core Modules

### 1. Authentication Module[^1]

**File**: `src/actions/authActions.ts`[^1]

**Key Functions**:[^1]

- `signInUser(data)` - Credentials-based login with email verification check[^1]
- `registerUser(data)` - Multi-step registration with profile and photo creation[^1]
- `verifyEmail(token)` - Confirms email ownership via token[^1]
- `resetPassword(password, token)` - Updates password with token validation[^1]
- `completeSocialLoginProfile(data)` - Finalizes social login with profile details[^1]
- `generateResetPasswordEmail(email)` - Initiates password reset flow[^1]

### 2. Matching \& Like System[^1]

**File**: `src/actions/likeActions.ts`[^1]

**Functionality**:[^1]

- **Like User**: Records unidirectional interest[^1]
- **Unlike User**: Removes previous like[^1]
- **Check Mutual Likes**: Identifies two-way matches[^1]
- **Fetch Likes**: Retrieves outgoing/incoming likes with pagination[^1]
- **Discover Members**: Returns list of non-liked users for swiping[^1]

**Database Model**:[^1]

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

This ensures each user can like another only once.[^1]

### 3. Messaging System[^1]

**File**: `src/actions/messageActions.ts`[^1]

**Core Features**:[^1]

- **Send Message**: Creates message record with Pusher notification[^1]
- **Fetch Conversations**: Retrieves unique conversations with latest message[^1]
- **Get Messages**: Fetches message history between two members[^1]
- **Mark as Read**: Updates `dateRead` timestamp[^1]
- **Delete Message**: Soft-delete for sender/recipient separately[^1]

**Real-Time Integration**:[^1]

- Pusher channels notify matched users of new messages[^1]
- Message store (Zustand) caches and syncs in real-time[^1]
- Custom hooks (useMessages, useNotificationChannel) bind data to components[^1]

### 4. Member Profile Management[^1]

**File**: `src/actions/memberActions.ts`[^1]

**Capabilities**:[^1]

- **Fetch Member**: Retrieves user profile with photos and member details[^1]
- **Update Member**: Modifies bio, location, and profile info[^1]
- **Upload Photos**: Handles Cloudinary integration for image storage[^1]
- **Delete Photo**: Removes image from profile[^1]
- **Get All Members**: Returns paginated list with filtering[^1]

## Database Schema

### Core Models[^1]

**User Model**[^1]

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

- Stores authentication credentials and basic info[^1]
- One-to-one relation with Member model[^1]
- Tracks profile completion status[^1]

**Member Model**[^1]

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

- Extends User with dating profile details[^1]
- Supports many-to-many relationships via Like model[^1]
- Maintains message relationships (sender/recipient)[^1]

**Like Model**[^1]

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

- Records directional interest between members[^1]
- Unique constraint prevents duplicate likes[^1]

**Message Model**[^1]

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

- Stores chat messages between matched members[^1]
- Read receipts via `dateRead`[^1]
- Soft-delete flags for privacy[^1]

**Photo Model**[^1]

```prisma
model Photo {
  id       String  @id @default(cuid())
  url      String
  publicId String?
  memberId String
  member   Member  @relation(...)
}
```

- Associates images with member profiles[^1]
- Stores Cloudinary public ID for management[^1]

**Token Model**[^1]

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

- Temporary tokens for email verification and password resets[^1]

**Account Model**[^1]

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

- NextAuth adapter model for OAuth accounts[^1]

## Setup \& Installation

### Prerequisites[^1]

- **Node.js** 18+[^1]
- **npm**, **yarn**, or **pnpm** package manager[^1]
- **PostgreSQL** database (local or cloud via Neon)[^1]
- **Git** for version control[^1]

### Clone \& Install[^1]

```bash
# Clone repository
git clone https://github.com/zzelif/builder-round-devmatch.git
cd zzelif-builder-round-devmatch

# Install dependencies
npm install
# or
yarn install
```

### Database Operations[^1]

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

### Start Development Server[^1]

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.[^1]

## Environment Configuration

### Required Environment Variables[^1]

Create a `.env.local` file in the project root with:[^1]

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

### Setup Steps[^1]

1. **PostgreSQL Database**: Create database and set `DATABASE_URL`[^1]
2. **NextAuth Secrets**: Generate via `openssl rand -base64 32`[^1]
3. **OAuth Credentials**: Register apps at Google Cloud Console and GitHub[^1]
4. **Pusher Account**: Create at pusher.com for real-time features[^1]
5. **Cloudinary Account**: Sign up for image storage[^1]
6. **Resend Account**: Register for transactional email[^1]

## Development Workflow

### Key npm Scripts[^1]

| Script                      | Purpose                                                                 |
| :-------------------------- | :---------------------------------------------------------------------- |
| `npm run dev` [^1]          | Start development server on port 3000                                   |
| `npm run build` [^1]        | Build production bundle                                                 |
| `npm run start` [^1]        | Start production server                                                 |
| `npm run lint` [^1]         | Run ESLint checks                                                       |
| `npm run vercel-build` [^1] | Build script for Vercel deployment (includes DB migrations and seeding) |

### Code Organization Best Practices[^1]

- **Server Actions** in `src/actions/` for mutations and database queries[^1]
- **Components** split into UI components (`/ui`), feature components, and pages[^1]
- **Hooks** in `src/hooks/` for reusable stateful logic[^1]
- **Lib** utilities isolated in `src/lib/` for configuration and helpers[^1]
- **Schemas** in `src/lib/schemas/` for Zod validation[^1]

### Type Safety with TypeScript[^1]

- Custom type definitions in `src/types/`[^1]
- NextAuth types extended for `profileComplete` status[^1]
- Action results wrapped in `ActionResult<T>` type for consistent error handling[^1]

## Deployment

### Vercel Deployment[^1]

**Automatic via Vercel CLI or Git Integration**:[^1]

```bash
# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
# Run build process from package.json: npm run vercel-build
```

**Build Process**:[^1]

The `vercel-build` script automates:[^1]

1. Prisma client generation[^1]
2. Database migrations[^1]
3. Database seeding[^1]
4. Next.js build[^1]

### Environment Variables on Vercel[^1]

1. Go to Vercel Dashboard → Project Settings → Environment Variables[^1]
2. Add all variables from `.env.local`[^1]
3. Redeploy to apply[^1]

### Production Considerations[^1]

- **Database**: Use managed PostgreSQL (Neon, AWS RDS, Vercel Postgres)[^1]
- **NEXTAUTH_URL**: Set to production domain[^1]
- **NEXTAUTH_SECRET**: Use strong, 32+ character secret[^1]
- **Image Optimization**: Enabled via Next.js with Cloudinary CDN[^1]

## Key Implementation Details

### Real-Time Messaging with Pusher[^1]

Pusher enables instant message delivery and presence tracking:[^1]

```typescript
// Server: Send message via Pusher
await pusher.trigger(`private-chat-${conversationId}`, "message", { message });

// Client: Subscribe to Pusher channel
const channel = pusher.subscribe(`private-chat-${conversationId}`);
channel.bind("message", (data) => {
  // Update UI with new message
});
```

**Custom Hooks**:[^1]

- `useNotificationChannel()` listens for new messages[^1]
- `usePresenceChannel()` tracks online members[^1]
- `useMessages()` fetches and caches message history[^1]

### Image Management with Cloudinary[^1]

Images are uploaded to Cloudinary for storage and CDN delivery:[^1]

- **Client-Side Upload**: Uses CldUploadWidget or direct API[^1]
- **Server-Side Signing**: Signs URLs for secure image access[^1]
- **Public ID Storage**: Saved in database for future management[^1]

### Form Validation with Zod[^1]

All forms validated server-side using Zod schemas:[^1]

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

Client-side integration via React Hook Form and resolvers.[^1]

### State Management[^1]

- **Zustand Stores**: Message and presence state for real-time sync[^1]
- **React Query Integration**: Optional for server state (can be added)[^1]
- **Context API**: For theme and authentication context[^1]

### UI/UX with Tailwind \& shadcn[^1]

- **Responsive Design**: Mobile-first Tailwind utilities[^1]
- **Dark Mode**: Managed via `next-themes` with CSS variables[^1]
- **Component Library**: Pre-built, accessible shadcn components[^1]
- **Icons**: Lucide React for consistent icon set[^1]
- **Animations**: Framer Motion for smooth transitions on CTAs[^1]

### Seed Data[^1]

`prisma/membersData.ts` includes 10 test members with:[^1]

- Diverse backgrounds (engineers, designers, wellness coaches)[^1]
- Realistic bios and locations (Vancouver area)[^1]
- Sample profile images[^1]

Run `npx prisma db seed` to populate the database.[^1]

---

## Conclusion

**DevMatch** demonstrates a production-ready full-stack dating application built with modern technologies. It combines **robust authentication**, **real-time messaging**, **intuitive UI design**, and **scalable architecture** to create an engaging platform for developers to connect and collaborate.

The modular structure, TypeScript type safety, and comprehensive use of industry-standard libraries make it an excellent foundation for further features such as advanced filtering, recommendation algorithms, verification systems, and in-app notifications.[^1]

---

This README provides a comprehensive foundation for understanding, developing, and deploying the DevMatch application. For questions or contributions, refer to the repository structure and inline code documentation.[^1]
<span style="display:none">[^2]</span>

<div align="center">⁂</div>

[^1]: zzelif-builder-round-devmatch-8a5edab282632443-10.txt
[^2]: WC-Launchpad-Builder-Round_Build-a-Dating-App.pdf
