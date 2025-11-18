# Deployment Guide - CropSync Kiosk

This guide covers deploying your CropSync Kiosk application to production.

## 📋 Pre-Deployment Checklist

- [ ] Set up Supabase project
- [ ] Run database migrations (supabase-setup.sql)
- [ ] Configure environment variables
- [ ] Test build locally (`pnpm build`)
- [ ] Test production build (`pnpm preview`)

## 🔐 Environment Setup

### Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Setup**
   - Open Supabase SQL Editor
   - Copy contents of `supabase-setup.sql`
   - Execute the SQL script

3. **Configure Storage (Optional)**
   - Create a storage bucket named `crop-images`
   - Set it to public
   - Configure RLS policies (see supabase-setup.sql)

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Vite apps
- Automatic HTTPS
- Global CDN
- Free tier available

**Steps:**

1. Install Vercel CLI (optional):
   ```bash
   pnpm add -g vercel
   ```

2. Deploy via GitHub:
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. Or deploy via CLI:
   ```bash
   vercel
   ```

**Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add `VITE_SUPABASE_URL`
- Add `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

**Steps:**

1. Build the project:
   ```bash
   pnpm build
   ```

2. Deploy via Netlify CLI:
   ```bash
   pnpm add -g netlify-cli
   netlify deploy --prod
   ```

3. Or use Netlify Dashboard:
   - Drag and drop the `dist` folder
   - Or connect to GitHub for automatic deployments

**Netlify Configuration:**

Create `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables:**
- Go to Site Settings → Environment Variables
- Add your Supabase credentials

### Option 3: Traditional Hosting (Apache/Nginx)

**Build:**
```bash
pnpm build
```

**Upload:**
- Upload contents of `dist/` folder to your web server
- Configure web server for SPA routing

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/cropsync-kiosk;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Apache Configuration (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option 4: Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run:**
```bash
docker build -t cropsync-kiosk .
docker run -p 80:80 cropsync-kiosk
```

## 🔍 Post-Deployment Verification

1. **Test Authentication**
   - Sign up with a new account
   - Sign in with existing credentials
   - Test logout functionality

2. **Test CRUD Operations**
   - Create a new crop
   - View crop details
   - Update crop information
   - Delete a crop

3. **Test UI Features**
   - Toggle theme (light/dark)
   - Toggle language (English/Telugu)
   - Check responsive design on mobile
   - Verify skeleton loading states

4. **Performance Check**
   - Run Lighthouse audit
   - Check page load times
   - Verify asset optimization

## 📊 Performance Optimization

### Code Splitting

Update `vite.config.js` for better chunking:

```javascript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
});
```

### Image Optimization

- Use WebP format for images
- Implement lazy loading
- Use Supabase Image Transformation API

### Caching Strategy

Configure headers for static assets:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to version control
   - Use platform-specific secret management
   - Rotate keys regularly

2. **Supabase Security**
   - Enable Row Level Security (RLS)
   - Review and test RLS policies
   - Use service role key only on backend

3. **HTTPS**
   - Always use HTTPS in production
   - Enable HSTS headers
   - Use secure cookies

4. **Content Security Policy**
   Add to your HTML or server config:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline'; 
                  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
                  font-src 'self' fonts.gstatic.com;
                  img-src 'self' data: https:;
                  connect-src 'self' *.supabase.co;">
   ```

## 📈 Monitoring & Analytics

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Rollbar

### Analytics

Options:
- Google Analytics
- Plausible Analytics
- Umami

### Performance Monitoring

- Vercel Analytics (if using Vercel)
- Web Vitals tracking
- Lighthouse CI

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Build Fails

- Check Node.js version (requires 18+)
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies are installed

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check deployment platform configuration

### Supabase Connection Issues

- Verify URL and keys are correct
- Check network/firewall settings
- Ensure RLS policies are configured
- Check Supabase project status

### Routing Issues (404 on refresh)

- Configure SPA fallback on your hosting
- Check server rewrite rules
- Verify base URL in router config

## 📞 Support

For deployment issues:
- Check the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)
- Review [Supabase documentation](https://supabase.com/docs)
- Open an issue on GitHub

---

Happy deploying! 🚀
