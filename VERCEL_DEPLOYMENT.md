# Vercel Deployment Guide

This portfolio is fully optimized for deployment on Vercel.

## Pre-Deployment Checklist

- [x] All components marked with "use client" where needed
- [x] Next.js config optimized for production
- [x] Images optimized with next/image
- [x] Spline and heavy components lazy-loaded
- [x] No hardcoded localhost URLs
- [x] No console.log statements in production
- [x] Metadata and SEO configured
- [x] robots.txt and sitemap.xml in place
- [x] Performance optimizations applied

## Deployment Steps

### 1. Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub account
4. Select the `Student_Portfolio_SIH25` repository

### 2. Configure Vercel Project
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3. Environment Variables
No environment variables are required for this portfolio. It's completely static.

Optional: If adding email notifications later, add:
- `NEXT_PUBLIC_FORM_ENDPOINT`: Your backend API endpoint

### 4. Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy
3. Your site will be live at: `https://<project-name>.vercel.app`

## Post-Deployment

### Custom Domain
1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain (e.g., yourname.dev)
3. Follow DNS configuration instructions

### Performance Monitoring
- Vercel provides analytics dashboard
- Check Core Web Vitals in Vercel Analytics
- Monitor build times and deployment logs

### Analytics (Optional)
Add Google Analytics ID to `next.config.js`:
```javascript
env: {
  NEXT_PUBLIC_GA_ID: 'YOUR-GA-ID'
}
```

## Troubleshooting

### Build Failures
- Check build logs in Vercel Dashboard
- Common issues: Missing dependencies, type errors
- Solution: Run `npm run build` locally to debug

### Image Loading Issues
- Verify images exist in `/public/images/`
- Check image paths in components
- Ensure no external CDN URLs without proper configuration

### SSR/Hydration Errors
- All client-only components have "use client" directive
- SplineViewer is dynamically imported with `ssr: false`
- AnimatedCursor only renders on client

## Performance Tips

1. **Optimize Images**: Replace placeholder images with real project screenshots
2. **Update Content**: Keep projects and experience sections current
3. **Monitor Analytics**: Use Vercel Analytics to track performance
4. **Caching**: Vercel handles caching automatically; no manual config needed

## Support

For Vercel-specific issues, visit: https://vercel.com/docs
