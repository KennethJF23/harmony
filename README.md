# Harmony - Brainwave Audio Therapy Platform

A Next.js application that provides brainwave entrainment audio therapy for focus, relaxation, and cognitive enhancement.

## Features

- 🧠 **Brainwave Audio Therapy**: Delta, Theta, Alpha, Beta, and Gamma wave patterns
- 🎵 **Ambient Sound Mixing**: Combine binaural beats with nature sounds
- 👤 **User Dashboard**: Track sessions, progress, and achievements
- 🔬 **Neuroscientist Portal**: Access patient data and generate reports
- 📊 **Analytics**: Detailed usage statistics and insights
- 🎯 **Focus Timer**: Pomodoro-style sessions with audio therapy
- 🤖 **AI Assistant**: Personalized recommendations based on usage patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (for production)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd harmony
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your MongoDB credentials:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/harmony?retryWrites=true&w=majority
   MONGO_DB=harmony
   NODE_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Mode

When `NODE_ENV=development`, the app uses mock authentication:
- Any email/password combination will work
- Users are auto-created in the database
- Perfect for testing without setting up real accounts

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- ✅ Vercel (Recommended)
- Netlify
- Railway
- AWS Amplify

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

1. Click the button above or go to [Vercel](https://vercel.com/new)
2. Import your Git repository
3. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `MONGO_DB`: `harmony`
   - `NODE_ENV`: `production`
4. Deploy!

**Important**: Make sure to set `NODE_ENV=production` in Vercel to enable proper authentication.

## Authentication System

### Production Mode (`NODE_ENV=production`)
- Full authentication with bcrypt password hashing
- Users must register before logging in
- Session tokens stored in MongoDB
- Secure password verification

### User Roles
1. **User**: Access to audio player, sessions, and personal dashboard
2. **Neuroscientist**: Access to patient data, reports, and analytics

## Project Structure

```
harmony/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   │   ├── login/         # Authentication
│   │   │   ├── register/      # User registration
│   │   │   ├── sessions/      # Session tracking
│   │   │   └── dashboard/     # Dashboard data
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── player/            # Audio player
│   │   └── ...
│   ├── components/            # React components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and configs
│   │   ├── auth.ts           # Authentication helpers
│   │   ├── mongodb.ts        # Database connection
│   │   └── ...
│   └── utils/                 # Helper functions
├── public/                    # Static assets
│   └── audio/                # Audio files
├── .env.local                # Local environment variables (not committed)
├── .env.example              # Environment variables template
└── DEPLOYMENT.md             # Deployment guide
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `MONGO_DB` | Database name (use `harmony`) | Yes |
| `NODE_ENV` | Environment (`development` or `production`) | Yes |

## API Routes

- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/sessions` - Create session record
- `GET /api/dashboard/user` - User dashboard data
- `GET /api/dashboard/neuroscientist` - Neuroscientist dashboard data
- `POST /api/reports` - Generate reports
- `POST /api/survey/responses` - Submit survey responses

## Technologies Used

- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: bcrypt.js
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **AI**: Google AI SDK

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## Support

For issues or questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review the browser console for errors
3. Check MongoDB Atlas connection and logs
4. Verify environment variables are set correctly

## License

This project is private and proprietary.
