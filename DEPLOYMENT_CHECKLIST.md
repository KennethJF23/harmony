# Pre-Deployment Checklist

Before deploying to production, ensure you've completed these steps:

## 1. MongoDB Setup ✓
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (allow 0.0.0.0/0 for Vercel)
- [ ] Connection string copied and tested

## 2. Environment Variables ✓
- [ ] `.env.example` reviewed
- [ ] Production environment variables ready:
  - [ ] `MONGO_URI` (with database name in URL)
  - [ ] `MONGO_DB=harmony`
  - [ ] `NODE_ENV=production`

## 3. Code Quality ✓
- [ ] Run `npm run build` locally to test build
- [ ] Check for any TypeScript errors
- [ ] Test login/register flows locally
- [ ] Verify all API routes work

## 4. Security ✓
- [ ] `.env.local` is in `.gitignore` (never commit!)
- [ ] Strong MongoDB password used
- [ ] MongoDB user has minimum required permissions
- [ ] Reviewed code for hardcoded credentials

## 5. Vercel Configuration ✓
- [ ] `vercel.json` configured (optional but recommended)
- [ ] Environment variables added in Vercel dashboard
- [ ] Build settings correct (Next.js auto-detected)
- [ ] Region selected (default: iad1)

## 6. Testing Production ✓
After deployment:
- [ ] Visit deployed URL
- [ ] Register a new account (both user and neuroscientist)
- [ ] Login with registered account
- [ ] Test audio player functionality
- [ ] Check dashboard loads correctly
- [ ] Verify database records created in MongoDB Atlas
- [ ] Test logout functionality

## Common Issues & Solutions

### Build Fails
```bash
# Test build locally first
npm run build

# If successful locally but fails on Vercel:
# - Check Node.js version matches
# - Verify all dependencies in package.json
# - Check Vercel build logs for specific errors
```

### Can't Login After Deployment
1. Verify `NODE_ENV=production` is set in Vercel
2. Check MongoDB Network Access allows connections
3. Test MongoDB connection string in MongoDB Compass
4. Make sure you registered an account first (no auto-creation in production)

### Database Connection Errors
1. Check connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/harmony?retryWrites=true&w=majority
   ```
2. Verify username and password are correct
3. Ensure `harmony` database name is in the URL
4. Check MongoDB Atlas status page for outages

### 500 Internal Server Error
1. Check Vercel function logs
2. Verify environment variables are set
3. Check MongoDB Atlas logs
4. Review API route error handling

## Quick Deploy Command

For Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (will prompt for environment variables)
vercel --prod

# Or with environment variables
vercel --prod -e MONGO_URI="your-connection-string" -e MONGO_DB="harmony" -e NODE_ENV="production"
```

## Post-Deployment

After successful deployment:

1. **Test thoroughly**: Try all user flows
2. **Monitor logs**: Check Vercel and MongoDB logs
3. **Set up monitoring**: Consider adding error tracking (Sentry, etc.)
4. **Custom domain** (optional): Add your domain in Vercel settings
5. **SSL**: Automatic with Vercel
6. **Analytics**: Vercel Analytics available in dashboard

## Rollback Plan

If something goes wrong:
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

Or in Vercel dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full deployment guide
