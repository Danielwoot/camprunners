const https = require('https');
const zlib = require('zlib');

const url = 'https://thedyrt.com/camping/california/launch-pointe-recreation-destination-and-rv-park';

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br'
  },
  timeout: 10000
}, (res) => {
  let stream = res;
  if (res.headers['content-encoding'] === 'gzip') stream = res.pipe(zlib.createGunzip());
  else if (res.headers['content-encoding'] === 'br') stream = res.pipe(zlib.createBrotliDecompress());

  let body = '';
  stream.on('data', c => body += c);
  stream.on('end', () => {
    console.log(`Status: ${res.statusCode}, Body Length: ${body.length}`);

    // Check __NEXT_DATA__
    const nextMatch = body.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i);
    if (nextMatch) {
      try {
        const nextData = JSON.parse(nextMatch[1]);
        console.log('Found __NEXT_DATA__ in The Dyrt!');
        const pageProps = nextData.props?.pageProps;
        console.log('pageProps keys:', Object.keys(pageProps || {}));
        const campground = pageProps?.campground || pageProps?.location || pageProps?.initialCampground;
        if (campground) {
          console.log('campground keys:', Object.keys(campground));
          console.log('campground.photos:', campground.photos?.length || campground.images?.length);
          if (campground.photos) {
            console.log('Sample photos:', campground.photos.slice(0, 3));
          }
        }
      } catch(e) {
        console.log('Error parsing __NEXT_DATA__:', e.message);
      }
    }

    // Look for The Dyrt photo CDN (images.thedyrt.com or cloudinary or s3)
    const photoMatches = [...body.matchAll(/https:\/\/[a-zA-Z0-9_\-\.]*(?:thedyrt\.com|cloudinary\.com|dyrt)[^\s"'<>]+/gi)].map(m => m[0]);
    console.log(`Found ${photoMatches.length} The Dyrt image/CDN URLs!`);
    const uniquePhotos = [...new Set(photoMatches.filter(u => u.includes('/photo/') || u.includes('/photos/') || u.includes('campground-photos') || u.includes('image/upload') || u.includes('production/uploads') || u.includes('media.thedyrt.com') || u.includes('img.thedyrt.com')))];
    console.log(`Found ${uniquePhotos.length} unique photo URLs.`);
    console.log('Sample photos:\n', uniquePhotos.slice(0, 8));

    // Also check Schema JSON-LD
    const jsonLdMatch = body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      console.log(`Found ${jsonLdMatch.length} JSON-LD blocks`);
      for (const tag of jsonLdMatch) {
        try {
          const parsed = JSON.parse(tag.replace(/<\/?script[^>]*>/gi, '').trim());
          if (parsed.image) {
            console.log('JSON-LD parsed.image:', parsed.image);
          }
        } catch {}
      }
    }
  });
}).on('error', e => console.log('Error:', e.message));
