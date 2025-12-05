# Deployment Guide for Harmony

This guide will help you deploy the Harmony application to Vercel or other platforms.

## Prerequisites

1. MongoDB Atlas account with a cluster set up
2. Vercel account (or other hosting platform)
3. Git repository with your code

## Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (if you haven't already)
3. Create a database user with read/write permissions
4. Get your connection string (it should look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Add your database name to the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/harmony?retryWrites=true&w=majority
   ```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables during deployment or in the Vercel dashboard.

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `harmony` (if your Next.js app is in a subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables in the Vercel dashboard:
   - `MONGO_URI`: Your MongoDB connection string
   - `MONGO_DB`: `harmony`
   - `NODE_ENV`: `production`

6. Click "Deploy"

## Step 3: Environment Variables Configuration

In your Vercel project settings (or other platform), add these environment variables:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/harmony?retryWrites=true&w=majority
MONGO_DB=harmony
NODE_ENV=production
```

**Important**: 
- Never commit your `.env.local` file with real credentials
- The `.env.example` file is safe to commit as a template
- Make sure to add your deployment domain to MongoDB Atlas Network Access (IP Whitelist)

## Step 4: MongoDB Atlas Network Access

1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access"
3. Add IP Address:
   - For Vercel: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific Vercel IP ranges if you prefer restricted access

## Step 5: Test Your Deployment

1. Visit your deployed URL (e.g., `https://your-app.vercel.app`)
2. Try to register a new account:
   - Go to `/register`
   - Create a user account or neuroscientist account
3. Try to login:
   - Go to `/login`
   - Use the credentials you just created

## Authentication Flow

The app uses the following authentication system:

### Development Mode (NODE_ENV=development)
- Mock authentication that auto-creates users
- No password verification required
- Useful for testing

### Production Mode (NODE_ENV=production)
- Full authentication with password hashing (bcrypt)
- User registration stores hashed passwords in MongoDB
- Login verifies credentials against database
- Session tokens are stored in MongoDB

## Deployment Platforms

### Vercel (Recommended)
- Automatic deployments from Git
- Zero-config Next.js support
- Free SSL certificates
- Global CDN

### Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Railway
1. Connect your GitHub repo
2. Add environment variables
3. Deploy automatically

#### AWS Amplify
1. Connect your repository
2. Configure build settings
3. Add environment variables

## Troubleshooting

### Login Issues

1. **"Invalid credentials" error**:
   - Make sure you registered the account first
   - Check that `NODE_ENV=production` is set
   - Verify MongoDB connection string is correct

2. **Database connection errors**:
   - Check MongoDB Atlas Network Access settings
   - Verify connection string format
   - Ensure database user has proper permissions

3. **Build errors**:
   - Run `npm run build` locally to test
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### MongoDB Connection

Test your MongoDB connection:
```bash
# In your project directory
node -e "const { MongoClient } = require('mongodb'); const client = new MongoClient(process.env.MONGO_URI); client.connect().then(() => console.log('Connected!')).catch(console.error);"
```

## Security Best Practices

1. **Use strong passwords** for MongoDB users
2. **Rotate credentials** regularly
3. **Enable IP whitelist** in MongoDB Atlas (if possible)
4. **Use HTTPS** for production (automatic with Vercel)
5. **Never commit** `.env.local` files
6. **Monitor** your application logs for suspicious activity

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Review browser console for errors
4. Check Network tab for failed API calls

## Next Steps

After successful deployment:
1. Test all authentication flows
2. Test the audio player functionality
3. Verify dashboard access for both user types
4. Set up monitoring and analytics
5. Configure custom domain (optional)
