export default function SeoFields({ seo, onChange }) {
  const set = (key, val) => onChange({ ...seo, [key]: val });

  const metaTitleLen = (seo.metaTitle || '').length;
  const metaDescLen = (seo.metaDesc || '').length;

  return (
    <div className="border border-dashed border-brand-300 rounded-xl p-4 bg-brand-50 flex flex-col gap-4">
      <h3 className="font-bold text-brand-700 text-sm flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        SEO Settings
      </h3>

      {/* Slug */}
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">URL Slug</label>
        <div className="flex items-center bg-white border rounded-lg overflow-hidden">
          <span className="text-xs text-gray-400 px-3 border-r bg-gray-50 py-2.5">/product/</span>
          <input value={seo.slug || ''} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
            className="flex-1 px-3 py-2.5 text-xs focus:outline-none" placeholder="product-slug" />
        </div>
      </div>

      {/* Meta Title */}
      <div>
        <label className="text-xs font-semibold text-gray-600 flex justify-between mb-1">
          Meta Title
          <span className={metaTitleLen > 60 ? 'text-red-500' : metaTitleLen > 50 ? 'text-orange-500' : 'text-green-600'}>
            {metaTitleLen}/60
          </span>
        </label>
        <input value={seo.metaTitle || ''} onChange={e => set('metaTitle', e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="SEO meta title..." />
        {metaTitleLen > 60 && <p className="text-red-500 text-xs mt-1">Too long — Google truncates at ~60 chars</p>}
      </div>

      {/* Meta Desc */}
      <div>
        <label className="text-xs font-semibold text-gray-600 flex justify-between mb-1">
          Meta Description
          <span className={metaDescLen > 160 ? 'text-red-500' : metaDescLen > 140 ? 'text-orange-500' : 'text-green-600'}>
            {metaDescLen}/160
          </span>
        </label>
        <textarea value={seo.metaDesc || ''} onChange={e => set('metaDesc', e.target.value)} rows={2}
          className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" placeholder="SEO meta description..." />
        {metaDescLen > 160 && <p className="text-red-500 text-xs mt-1">Too long — Google truncates at ~160 chars</p>}
      </div>

      {/* Keywords */}
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">Keywords <span className="text-gray-400 font-normal">(comma separated)</span></label>
        <input value={seo.keywords || ''} onChange={e => set('keywords', e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="windows 11 key india, buy windows cheap..." />
      </div>

      {/* OG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">OG Title</label>
          <input value={seo.ogTitle || ''} onChange={e => set('ogTitle', e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Open Graph title..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">OG Image URL</label>
          <input value={seo.ogImage || ''} onChange={e => set('ogImage', e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">OG Description</label>
        <input value={seo.ogDesc || ''} onChange={e => set('ogDesc', e.target.value)}
          className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Open Graph description..." />
      </div>

      {/* Canonical + Robots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Canonical URL</label>
          <input value={seo.canonical || ''} onChange={e => set('canonical', e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Robots Meta</label>
          <select value={seo.robots || 'index,follow'} onChange={e => set('robots', e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400">
            <option>index,follow</option>
            <option>index,nofollow</option>
            <option>noindex,follow</option>
            <option>noindex,nofollow</option>
          </select>
        </div>
      </div>

      {/* Schema toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={seo.schema || false} onChange={e => set('schema', e.target.checked)} className="w-4 h-4 accent-brand-600" />
        <span className="text-xs font-semibold text-gray-600">Enable JSON-LD Product Schema</span>
      </label>

      {/* SERP Preview */}
      {(seo.metaTitle || seo.metaDesc) && (
        <div className="bg-white border rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-400 mb-2">SERP Preview</p>
          <p className="text-blue-600 text-sm font-medium leading-tight">{seo.metaTitle || 'Page Title'}</p>
          <p className="text-green-700 text-xs">{seo.canonical || 'https://yourdomain.com/product/' + (seo.slug || 'slug')}</p>
          <p className="text-gray-600 text-xs mt-1 leading-relaxed">{seo.metaDesc || 'Meta description will appear here...'}</p>
        </div>
      )}
    </div>
  );
}
