# Google Analytics 4 Configuration

This site includes Google Analytics 4 (GA4) tracking to understand site usage and visitor traffic.

## Setup Instructions

### 1. Get Your GA4 Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or use an existing one
3. Navigate to Admin > Data Streams
4. Create or select a web data stream
5. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Update index.html

Replace the placeholder `G-XXXXXXXXXX` in `index.html` with your actual Measurement ID:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID-HERE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());


  gtag('config', 'G-YOUR-ID-HERE');
</script>
```

**Update in two places:**
1. The script `src` URL
2. The `gtag('config', ...)` call

### 3. Deploy and Verify

1. Build and deploy the site: `npm run build`
2. Visit your live site
3. Check Google Analytics Real-Time reports to verify tracking is working

## Features

### Automatic Page View Tracking

The site automatically tracks page views when users navigate between routes using the `usePageTracking` hook in `src/hooks/usePageTracking.ts`.

Each route change sends a `page_view` event to GA4 with:
- `page_path`: The route path (e.g., `/papers`, `/cv`)
- `page_location`: Full URL
- `page_title`: Page title from SEO component

### Privacy

The footer includes a privacy notice informing visitors that Google Analytics is used.

## Testing

In development mode (localhost), GA4 tracking is loaded but may show warnings in the console. This is normal.

To verify tracking in production:
1. Deploy to GitHub Pages
2. Visit the live site
3. Open Google Analytics > Reports > Realtime
4. Navigate between pages and verify events appear

## Troubleshooting

**Q: Analytics isn't tracking visits**
- Verify you replaced both instances of `G-XXXXXXXXXX` with your real Measurement ID
- Check browser console for errors
- Ensure ad blockers are disabled for testing
- Wait a few minutes for data to appear in GA4 Real-Time reports

**Q: How do I disable tracking in development?**
- The hook checks for `window.gtag` existence before tracking
- Most browsers will load the script even on localhost, but you can use ad blockers during development

## Data Retention

Google Analytics 4 retains data according to your property settings (default is 14 months). Configure this in GA4 Admin > Data Settings > Data Retention.
