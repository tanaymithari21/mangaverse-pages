# Google AdSense Setup

## Step 1 — Add script to index.html
Add this inside <head> in your index.html:

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_PUBLISHER_ID"
     crossorigin="anonymous"></script>

## Step 2 — Fill credentials in AdCard.tsx
Open src/components/AdCard.tsx and set:

const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXXX";  // your publisher ID
const ADSENSE_SLOT   = "1234567890";                // your ad slot ID

## That's it.
The Tuturu fallback shows automatically when:
- Credentials are empty (development)
- AdSense fails to fill the slot
- Ad is blocked by an ad blocker
