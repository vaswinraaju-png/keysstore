import { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, ogTitle, ogDesc, ogImage, canonical, robots, schema }) {
  useEffect(() => {
    document.title = title || 'KeyStore India';

    const setMeta = (name, content, prop = false) => {
      if (!content) return;
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('meta');
        prop ? el.setAttribute('property', name) : el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('robots', robots || 'index,follow');
    setMeta('og:title', ogTitle || title, true);
    setMeta('og:description', ogDesc || description, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', ogTitle || title);
    setMeta('twitter:description', ogDesc || description);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link); }
      link.setAttribute('href', canonical);
    }

    if (schema) {
      let el = document.getElementById('ks-schema');
      if (!el) { el = document.createElement('script'); el.id = 'ks-schema'; el.type = 'application/ld+json'; document.head.appendChild(el); }
      el.textContent = JSON.stringify(schema);
    }
  }, [title, description, keywords, ogTitle, ogDesc, ogImage, canonical, robots, schema]);

  return null;
}
