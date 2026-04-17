# Les Trois Palmiers - Luxury Hotel Booking Website

A full-stack production-ready hotel booking website with React frontend and Node.js/Express backend.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM

## Project Structure

```
/client          React frontend (Vite)
/server          Express backend (Node.js)
/server/prisma   Database schema & migrations
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Local Setup

#### 1. Clone the repository

```bash
git clone <repo-url>
cd les-trois-palmiers
```

#### 2. Backend Setup

```bash
cd server

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials:
# DATABASE_URL=postgresql://user:password@localhost:5432/les_trois_palmiers
# JWT_SECRET=your-secure-secret-key
# NODE_ENV=development

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with rooms and admin user
npm run db:seed
```

#### 3. Frontend Setup

```bash
cd client

# Copy environment file
cp .env.example .env

# Edit .env:
# VITE_API_URL=http://localhost:5000

# Install dependencies
npm install

# Start development server
npm run dev
```

#### 4. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:5173/admin/dashboard

### Default Admin Credentials

- **Email**: admin@lestroispalmiers.com
- **Password**: admin123

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/health | Health check | No |
| GET | /api/rooms | List all rooms | No |
| GET | /api/rooms/:id | Get room details | No |
| POST | /api/bookings | Create booking | No |
| GET | /api/bookings | List all bookings | Yes |
| PATCH | /api/bookings/:id/status | Update booking status | Yes |
| DELETE | /api/bookings/:id | Delete booking | Yes |
| POST | /api/contact | Submit contact form | No |
| POST | /api/admin/login | Admin login | No |

## Booking Validation Rules

- Check-in date must be in the future
- Check-out must be after check-in
- At least 1 guest required
- Guests cannot exceed room capacity
- No overlapping bookings for the same room

## Deployment

### Database (Supabase)

1. Create a Supabase project at https://supabase.com
2. Get your PostgreSQL connection URL from Supabase dashboard
3. Update `DATABASE_URL` in your backend's environment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set environment variables:
   - `PORT`: 5000
   - `DATABASE_URL`: Your Supabase PostgreSQL connection URL
   - `JWT_SECRET`: Generate a secure random string
   - `CLIENT_URL`: Your Vercel frontend URL
   - `NODE_ENV`: production
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend (Vercel)

1. Import your GitHub repository to Vercel
2. Configure:
   - Framework Preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set environment variable:
   - `VITE_API_URL`: Your Render backend URL

## Environment Variables

### Server (.env)

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to your Render backend URL.

## Scripts

### Backend

```bash
npm run dev      # Development server with hot reload
npm start        # Production server
npm run db:seed  # Seed database
```

### Frontend

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Features

- Responsive luxury hotel UI
- Animated hero section
- Room listing and details
- Online reservation system
- Contact form
- Admin dashboard
- JWT authentication
- Booking status management

## License

MIT