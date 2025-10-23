# Deployment Guide for Blackjack PWA

This guide covers multiple deployment options for the Blackjack PWA game. Choose the platform that best fits your needs.

## Table of Contents
- [GitHub Pages (Automated)](#github-pages-automated)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Cloudflare Pages](#cloudflare-pages)
- [Firebase Hosting](#firebase-hosting)
- [Traditional Web Hosting](#traditional-web-hosting)

---

## GitHub Pages (Automated)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages.

### Setup Steps

1. **Enable GitHub Pages in your repository**:
   - Go to your repository on GitHub: `https://github.com/hussam0is/2d-game`
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Merge or push to main branch**:
   ```bash
   # If you're on a feature branch, merge to main
   git checkout main
   git merge claude/create-blackjack-game-011CUQfMZLxQe8tXMjqrcNL5
   git push origin main
   ```

3. **Workflow triggers automatically**:
   - The workflow in `.github/workflows/deploy.yml` will run
   - Check progress in the **Actions** tab on GitHub
   - Once complete, your app will be live at:
     ```
     https://hussam0is.github.io/2d-game/
     ```

### Manual Deployment

You can also trigger deployment manually:
- Go to **Actions** tab → **Deploy Blackjack PWA to GitHub Pages**
- Click **Run workflow** → **Run workflow**

### Configuration

The workflow is configured in `.github/workflows/deploy.yml`:
- Triggers on push to `main` branch
- Can be manually triggered via workflow_dispatch
- Deploys all files in the repository
- Sets proper permissions for Pages deployment

---

## Netlify

Netlify offers easy deployment with automatic HTTPS and global CDN.

### Option 1: Connect Git Repository (Recommended)

1. **Sign up/Login** at [netlify.com](https://netlify.com)

2. **Import project**:
   - Click **Add new site** → **Import an existing project**
   - Choose **GitHub** and authorize Netlify
   - Select your repository: `hussam0is/2d-game`

3. **Configure build settings**:
   - **Base directory**: (leave empty)
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (current directory)

4. **Deploy**:
   - Click **Deploy site**
   - Netlify will deploy and provide a URL like: `random-name-123.netlify.app`
   - You can customize the subdomain in **Site settings**

### Option 2: Drag & Drop

1. Visit [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire project folder onto the page
3. Instant deployment!

### Configuration

The `netlify.toml` file is included with:
- Publish directory configuration
- PWA headers for service worker and manifest
- Security headers
- Redirect rules

### Auto-Deploy on Push

Once connected to Git, Netlify automatically deploys when you push to your main branch.

---

## Vercel

Vercel provides excellent performance and automatic deployments.

### Option 1: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /path/to/2d-game
   vercel
   ```

3. **Follow prompts**:
   - Login/signup when prompted
   - Confirm project settings
   - Deploy!

4. **Production deployment**:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Dashboard

1. **Sign up/Login** at [vercel.com](https://vercel.com)

2. **Import project**:
   - Click **Add New** → **Project**
   - Import from GitHub: `hussam0is/2d-game`

3. **Configure**:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - No build settings needed

4. **Deploy**:
   - Click **Deploy**
   - Get URL like: `2d-game.vercel.app`

### Configuration

The `vercel.json` file is included with:
- Static file serving configuration
- Service worker headers
- PWA manifest headers
- Security headers

### Auto-Deploy

Vercel automatically deploys when you push to connected Git branches.

---

## Cloudflare Pages

Cloudflare Pages offers free unlimited bandwidth and excellent performance.

### Setup Steps

1. **Sign up/Login** at [pages.cloudflare.com](https://pages.cloudflare.com)

2. **Create new project**:
   - Click **Create a project**
   - Connect to GitHub account
   - Select repository: `hussam0is/2d-game`

3. **Configure build**:
   - **Production branch**: `main`
   - **Build command**: (leave empty)
   - **Build output directory**: `/`

4. **Deploy**:
   - Click **Save and Deploy**
   - Get URL like: `2d-game.pages.dev`
   - Can add custom domain

### Features

- Automatic deployments on git push
- Preview deployments for pull requests
- Free unlimited bandwidth
- Global CDN
- Automatic HTTPS

---

## Firebase Hosting

Google Firebase Hosting provides fast, secure hosting with global CDN.

### Setup Steps

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase**:
   ```bash
   cd /path/to/2d-game
   firebase init hosting
   ```

4. **Configuration prompts**:
   - Use existing project or create new one
   - **Public directory**: `.` (current directory)
   - **Configure as single-page app**: `No`
   - **Set up automatic builds**: `No`
   - **Overwrite files**: `No`

5. **Deploy**:
   ```bash
   firebase deploy
   ```

6. **Access your app**:
   - URL: `your-project-id.web.app`
   - Or: `your-project-id.firebaseapp.com`

### Continuous Deployment

Set up GitHub Actions for automatic Firebase deployment:

```yaml
# Add to .github/workflows/firebase-deploy.yml
name: Deploy to Firebase Hosting
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

---

## Traditional Web Hosting

Deploy to any web server with FTP/SFTP access.

### Requirements

- Web server with HTTPS support (required for PWA features)
- FTP/SFTP access or control panel

### Files to Upload

Upload all these files to your web server's public directory (e.g., `public_html`, `www`, `htdocs`):

```
├── index.html
├── app.js
├── style.css
├── manifest.json
├── service-worker.js
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

### Apache Configuration (Optional)

Add to `.htaccess` for better PWA support:

```apache
# Enable HTTPS redirect (if not already forced)
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Set proper MIME types
<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest .json
  AddType application/javascript .js
</IfModule>

# Service Worker headers
<FilesMatch "service-worker\.js$">
  Header set Service-Worker-Allowed "/"
  Header set Cache-Control "no-cache"
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Cache control for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Testing Your Deployment

After deploying, verify PWA functionality:

### 1. HTTPS Check
- Ensure the site loads over HTTPS
- Check for mixed content warnings in console

### 2. Service Worker
- Open DevTools → Application → Service Workers
- Verify service worker is registered and activated

### 3. Manifest
- DevTools → Application → Manifest
- Check that manifest loads correctly
- Verify icons appear

### 4. Install Prompt
- On mobile/desktop, look for install prompt
- Test "Install App" button in footer

### 5. Offline Functionality
- Load the app while online
- Turn off network in DevTools (or airplane mode)
- Refresh page - should still work

### 6. PWA Audit
- DevTools → Lighthouse
- Run PWA audit
- Aim for 100% PWA score

---

## Custom Domain

### GitHub Pages
```bash
# Add CNAME file
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```
Then configure DNS with your domain registrar.

### Netlify/Vercel/Cloudflare
- Go to site settings
- Add custom domain
- Follow DNS configuration instructions

---

## Troubleshooting

### Service Worker Not Registering
- Ensure site is served over HTTPS
- Check console for errors
- Verify service-worker.js path is correct

### Install Prompt Not Showing
- Must be served over HTTPS
- Must have valid manifest.json
- User must visit site multiple times (browser criteria)

### Icons Not Loading
- Check icons/ directory is uploaded
- Verify paths in manifest.json
- Check browser console for 404 errors

### CORS Issues
- Ensure all resources are served from same domain
- Check server CORS headers if using CDN

---

## Monitoring & Analytics

### Google Analytics
Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Plausible Analytics (Privacy-focused)
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## Performance Tips

1. **Enable Compression**: Most platforms enable gzip/brotli automatically
2. **CDN**: Use platforms with global CDN (Netlify, Vercel, Cloudflare)
3. **Caching**: Service worker already handles caching
4. **Image Optimization**: Icons are already optimized PNGs

---

## Support

For deployment issues:
- GitHub Pages: [GitHub Pages Docs](https://docs.github.com/pages)
- Netlify: [Netlify Docs](https://docs.netlify.com)
- Vercel: [Vercel Docs](https://vercel.com/docs)
- Cloudflare: [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)

For app issues: Check the repository issues or BLACKJACK_README.md

---

**Ready to deploy!** Choose your preferred platform and follow the steps above. 🚀
