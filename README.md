# EventEase - Event Management Platform

A professional-grade fullstack web application for managing events with role-based authentication and public RSVP functionality.

## 🚀 Live Demo

[View Live Application](https://event-ease-assignment.vercel.app)

## ✨ Features

### Authentication & Authorization

- Secure email-based authentication with NextAuth.js
- Role-based access control (Admin, Staff, Event Owner)
- Persistent sessions with secure cookie management

### Event Management

- Create, edit, and delete events
- Custom fields for additional attendee information
- Event publishing/unpublishing
- Auto-generated public event URLs

### Public RSVP System

- Public event pages for attendees
- Dynamic RSVP forms based on custom fields
- Real-time attendee tracking

### Attendee Management

- View all event RSVPs
- Export attendee data as CSV
- Custom field data collection

### Dashboard & Analytics

- Role-specific dashboards
- Event statistics and metrics
- Upcoming events overview

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/Night3y3/event-ease-assignment.git
   cd eventease
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

Edit `.env.local` and add your database URL and NextAuth secret:
\`\`\`env
DATABASE_URL="your-neon-database-url"
NEXTAUTH_SECRET="your-super-secret-key-here-make-it-long-and-random"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

4. Set up the database:
   \`\`\`bash

# Push the schema to your database

npm run db:push

# Seed the database with sample data

npm run db:seed
\`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Sample Credentials

For testing purposes, you can use these sample accounts:

**Admin Account:**

- Email: admin@eventease.com
- Password: admin123

**Event Owner Account:**

- Email: owner@eventease.com
- Password: owner123

### Database Management

\`\`\`bash

# View your data in Prisma Studio

npm run db:studio

# Reset and reseed the database

npm run db:push --force-reset
npm run db:seed

# Generate Prisma client after schema changes

npm run db:generate
\`\`\`

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env

# Database

DATABASE_URL="postgresql://..."

# NextAuth

NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
\`\`\`

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Night3y3/event-ease-assignment)

### Production Setup

For production deployment:

1. Set up PostgreSQL database (Neon recommended)
2. Configure environment variables
3. Run database migrations
4. Deploy to Vercel

## 🎯 Usage

### Creating Events

1. Register/Login to your account
2. Navigate to Dashboard → Events
3. Click "Create Event"
4. Fill in event details and custom fields
5. Publish when ready

### Managing RSVPs

1. Go to your event dashboard
2. Click on an event to view details
3. Switch to "Attendees" tab
4. Export attendee data as needed

### Public Event Access

- Share the public event URL: `/events/[event-id]`
- Attendees can RSVP without creating accounts
- All RSVP data is captured and available in your dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Your Name**

- GitHub: [@Night3y3](https://github.com/Night3y3)
- LinkedIn: [Sabuj Ghosh](https://www.linkedin.com/in/sabujghosh/)

---

Built with ❤️ using Next.js, TypeScript, NextAuth.js, and Tailwind CSS
