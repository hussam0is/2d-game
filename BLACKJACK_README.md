# Blackjack PWA Game

A fully functional Progressive Web App (PWA) implementation of the classic Blackjack card game. Play against the dealer, manage your chips, and enjoy offline gameplay!

## Features

- **Classic Blackjack Gameplay**: Full implementation of standard Blackjack rules
- **Progressive Web App**: Install on any device and play offline
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Clean, casino-themed interface with smooth animations
- **Chip Management**: Start with 1000 chips and bet strategically
- **Game Actions**: Hit, Stand, and Double Down options
- **Offline Support**: Play anytime, anywhere with service worker caching

## Game Rules

1. **Objective**: Get closer to 21 than the dealer without going over
2. **Card Values**:
   - Number cards (2-10): Face value
   - Face cards (J, Q, K): 10 points
   - Aces: 11 points (or 1 if that would cause a bust)
3. **Betting**: Place your bet before each hand ($10, $25, $50, or $100)
4. **Actions**:
   - **Hit**: Take another card
   - **Stand**: Keep your current hand
   - **Double Down**: Double your bet and take exactly one more card
5. **Winning**:
   - Blackjack (21 with first two cards): Win 1.5x your bet
   - Regular win: Win 1x your bet
   - Push (tie): Get your bet back
   - Lose: Lose your bet

## Installation

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd 2d-game
```

2. Serve the files using any web server:

**Option A: Python**
```bash
python3 -m http.server 8000
```

**Option B: Node.js**
```bash
npx http-server -p 8000
```

**Option C: PHP**
```bash
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

### PWA Installation

Once the app is served over HTTPS (or localhost), you can install it:

1. Open the app in a compatible browser (Chrome, Edge, Safari)
2. Click the "Install App" button in the footer, or
3. Use your browser's install prompt (usually in the address bar)
4. The app will be added to your home screen/app drawer

## Deployment Options

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select your branch and root folder
4. GitHub will deploy at: `https://<username>.github.io/<repository>/`

### Netlify

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop the project folder, or connect your Git repository
3. Netlify will automatically deploy your PWA
4. Get a custom URL or use the provided netlify.app subdomain

### Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to deploy your app

### Cloudflare Pages

1. Create account at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your Git repository
3. Deploy with default settings
4. Get a free cloudflare.pages.dev subdomain

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase:
```bash
firebase init hosting
```

3. Deploy:
```bash
firebase deploy
```

### Traditional Web Hosting

Simply upload all files to your web server's public directory:
- `index.html`
- `app.js`
- `style.css`
- `manifest.json`
- `service-worker.js`
- `icons/` directory

Make sure HTTPS is enabled for PWA features to work properly.

## Project Structure

```
2d-game/
├── index.html           # Main HTML file
├── app.js              # Game logic and functionality
├── style.css           # Styling and animations
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
├── generate_icons.py   # Python script to generate icons
├── icons/              # App icons for PWA
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── BLACKJACK_README.md # This file
```

## Browser Compatibility

- **Chrome/Edge**: Full PWA support
- **Safari**: Full PWA support (iOS 11.3+)
- **Firefox**: Full PWA support
- **Opera**: Full PWA support

## Technical Details

### PWA Features
- **Service Worker**: Caches all assets for offline play
- **Web App Manifest**: Enables installation and app-like experience
- **Responsive Design**: Adapts to all screen sizes
- **Theme Color**: Integrated casino green theme

### Technologies Used
- Pure JavaScript (ES6+)
- CSS3 with animations and gradients
- HTML5
- Service Workers API
- Web App Manifest

## Development

### Regenerating Icons

If you need to regenerate the app icons:

```bash
python3 generate_icons.py
```

This will create all required icon sizes in the `icons/` directory.

### Modifying the Game

- **Game Logic**: Edit `app.js`
- **Styling**: Edit `style.css`
- **Layout**: Edit `index.html`
- **PWA Settings**: Edit `manifest.json`
- **Caching Strategy**: Edit `service-worker.js`

## License

This project is open source and available for personal and educational use.

## Credits

Created as a demonstration of PWA capabilities and modern web development practices.

---

**Enjoy playing Blackjack!** 🎴♠️♥️♣️♦️
