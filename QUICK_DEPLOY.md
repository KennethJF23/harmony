# 🚀 Quick Deploy to Vercel

This is the fastest way to get your Harmony app deployed and working with authentication.

## ⚡ 5-Minute Setup

### 1. MongoDB Atlas (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account & cluster
3. Create database user:
   - Username: `harmony_user`
   - Password: (generate strong password)
4. Network Access: Click "Allow Access from Anywhere"
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add `/harmony` after `.mongodb.net` 
   - Final format: `mongodb+srv://harmony_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/harmony?retryWrites=true&w=majority`

### 2. Deploy to Vercel (3 minutes)

#### Option A: GitHub + Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Configure:
     - Framework: Next.js (auto-detected)
     - Root Directory: `harmony` (if your Next.js app is in subdirectory)
   
3. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   MONGO_URI = mongodb+srv://harmony_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/harmony?retryWrites=true&w=majority
   MONGO_DB = harmony
   NODE_ENV = production
   ```

4. **Deploy** - Click "Deploy" button

#### Option B: Vercel CLI (Advanced)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy with environment variables
vercel --prod

# When prompted, add environment variables:
# MONGO_URI: [paste your connection string]
# MONGO_DB: harmony
# NODE_ENV: production
```

### 3. Test Your Deployed App (1 minute)

1. **Open your Vercel URL** (e.g., `https://harmony-xxx.vercel.app`)

2. **Register an account**
   - Go to `/register`
   - Create account (User or Neuroscientist)
   - Submit form

3. **Login**
   - Go to `/login`
   - Use the credentials you just created
   - You should be logged in!

4. **Verify in MongoDB**
   - Go to MongoDB Atlas
   - Browse Collections → `harmony` database → `users` collection
   - You should see your user record

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Network access set to "Allow from Anywhere"
- [ ] Connection string copied with password and `/harmony` database
- [ ] Vercel project created and connected to Git
- [ ] Environment variables added in Vercel
- [ ] Deployment successful (green checkmark)
- [ ] Can access deployed URL
- [ ] Can register new account
- [ ] Can login with registered account
- [ ] User appears in MongoDB database

## 🐛 Troubleshooting

### "Invalid credentials" on login
- **Cause**: You didn't register first, or wrong NODE_ENV
- **Fix**: Make sure `NODE_ENV=production` is set in Vercel, then register an account

### "Internal server error" 
- **Cause**: MongoDB connection issue
- **Fix**: 
  1. Check connection string format
  2. Verify password is correct (no special characters that need encoding)
  3. Ensure MongoDB Network Access allows 0.0.0.0/0

### Build fails on Vercel
- **Cause**: Missing dependencies or build errors
- **Fix**: Run `npm run build` locally first to identify issues

### Can't connect to MongoDB
- **Cause**: IP not whitelisted or wrong connection string
- **Fix**: 
  ```
  1. MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere
  2. Check connection string format:
     mongodb+srv://username:password@cluster.mongodb.net/harmony?retryWrites=true&w=majority
  ```

## 📝 Important Notes

### Production vs Development

**Development Mode** (`.env.local` with `NODE_ENV=development`):
- Mock authentication - any login works
- Auto-creates users
- Perfect for local testing

**Production Mode** (Vercel with `NODE_ENV=production`):
- Real authentication with password hashing
- Must register before login
- Passwords are securely hashed with bcrypt

### Environment Variables

The app needs these exact environment variables in Vercel:

| Variable | Value | Example |
|----------|-------|---------|
| `MONGO_URI` | Full connection string with password and database name | `mongodb+srv://user:pass@cluster.mongodb.net/harmony?retryWrites=true&w=majority` |
| `MONGO_DB` | Database name | `harmony` |
| `NODE_ENV` | Environment | `production` |

### Security Tips

1. ✅ Use strong MongoDB password
2. ✅ Never commit `.env.local` file
3. ✅ Keep environment variables in Vercel dashboard only
4. ✅ Use IP whitelist in MongoDB (if you have static IPs)
5. ✅ Rotate credentials periodically

## 🎉 Next Steps

After successful deployment:

1. **Test all features**: Player, dashboard, sessions
2. **Share the URL**: Your app is live!
3. **Custom domain**: Add in Vercel settings (optional)
4. **Monitoring**: Check Vercel Analytics
5. **Updates**: Push to Git → Auto-deploys to Vercel

## 📚 Additional Resources

- [Full Deployment Guide](./DEPLOYMENT.md) - Detailed instructions
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

## 💬 Need Help?

1. Check deployment logs in Vercel dashboard
2. Check MongoDB Atlas logs and metrics
3. Review browser console for client-side errors
4. Check Network tab for API call failures

---

**That's it!** Your app should now be live with working authentication. 🎊
