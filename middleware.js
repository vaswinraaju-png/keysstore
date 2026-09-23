import { next } from '@vercel/edge';

const SUPABASE_URL = 'https://rxdhamxygssjfjvchjzl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4ZGhhbXh5Z3NzamZqdmNoanpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4NzQzMzAsImV4cCI6MjEwNTQ1MDMzMH0.TSjS3YIk_Kx9sXdAeYEnz35i4aV6KrGm9PSgxV9_6N8';

export const config = {
  matcher: ['/product/:slug*', '/']
};

async function injectMeta(html, title, description, ogImage, canonical, keywords, robots, schema) {
  const metaTags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`,
    keywords ? `<meta name="keywords" content="${keywords}" />` : '',
    `<meta name="robots" content="${robots || 'index,follow'}" />`,
    `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`,
    `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`,
    `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ''
  ].filter(Boolean).join('\n  ');

  return html.replace(/<title>[^<]*<\/title>/, metaTags);
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    const response = await fetch(request);
    let html = await response.text();

    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '');
      if (!slug) return new Response(html, response);

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=name,description,sale_price,original_price,image,seo&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Range': '0-0',
            'Prefer': 'count=none'
          }
        }
      );

      // Use slug filter via PostgREST JSON operator
      const res2 = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=name,description,sale_price,image,seo&active=eq.true&limit=100`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );

      const products = await res2.json();
      const product = products?.find(p => p.seo?.slug === slug);

      if (product) {
        const seo = product.seo || {};
        const title = seo.metaTitle || `Buy ${product.name} | CDKeys India`;
        const description = seo.metaDesc || `Get ${product.name} at ₹${product.sale_price}. India best price. Instant delivery.`;
        const ogImage = seo.ogImage || product.image || '';
        const canonical = `https://cdkeys.site/product/${slug}`;
        const schema = seo.schema ? {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": description,
          "image": ogImage,
          "offers": {
            "@type": "Offer",
            "price": product.sale_price,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          }
        } : null;

        html = await injectMeta(html, title, description, ogImage, canonical, seo.keywords, seo.robots, schema);
      }

    } else if (path === '/') {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/settings?id=eq.global&select=data&limit=1`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      const settings = await res.json();
      const s = settings?.[0]?.data || {};
      const title = s.metaTitle || 'Buy Genuine Software Keys at Best Price | CDKeys India';
      const description = s.metaDesc || 'Buy 100% genuine Windows, Office, AI tools at India lowest prices. Instant delivery.';
      html = await injectMeta(html, title, description, s.ogImage || '', 'https://cdkeys.site', '', 'index,follow', null);
    }

    return new Response(html, {
      status: response.status,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, s-maxage=3600' }
    });

  } catch (e) {
    return next();
  }
}
