import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import SeoFields from '../components/SeoFields';

const EMPTY_PRODUCT = {
  name: '', originalPrice: '', salePrice: '', category: 'Windows',
  badge: '', image: '', description: '', active: true, showTimer: true,
  seo: { metaTitle: '', metaDesc: '', slug: '', keywords: '', ogTitle: '', ogDesc: '', ogImage: '', canonical: '', robots: 'index,follow', schema: true }
};

const EMPTY_SEO_SETTINGS = { metaTitle: '', metaDesc: '', ogImage: '', gscVerification: '', robotsTxt: '', analyticsId: '' };

function ProductForm({ initial, onSave, onCancel, title, uploadImage }) {
  const [form, setForm] = useState(initial);

  const set = (k, v) => setForm(p => {
    const updated = { ...p, [k]: v };
    if ((k === 'originalPrice' || k === 'salePrice') && updated.originalPrice && updated.salePrice) {
      const disc = Math.round((1 - updated.salePrice / updated.originalPrice) * 100);
      if (disc > 0) updated.badge = `-${disc}%`;
    }
    return updated;
  });

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadImage) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) set('image', url);
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-gray-800">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
          {/* Basic fields */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="MS Windows 11 Pro OEM Key..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Original Price (₹) *</label>
              <input type="number" value={form.originalPrice} onChange={e => set('originalPrice', Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="19999" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Sale Price (₹) *</label>
              <input type="number" value={form.salePrice} onChange={e => set('salePrice', Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="2999" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
                <option>Windows</option><option>Office</option><option>Software</option><option>AI Tools</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Badge Label</label>
              <input value={form.badge} onChange={e => set('badge', e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="-84%" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Product Description</label>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" placeholder="What's included, compatibility, activation steps..." />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Product Image</label>
            <div className="flex gap-2 items-start">
              {form.image && (
                <img src={form.image} className="w-14 h-14 rounded-lg object-contain bg-gray-50 border shrink-0" alt="preview"
                  onError={e => { e.target.style.display="none"; }} />
              )}
              <div className="flex-1 flex flex-col gap-2">
                <input value={form.image && form.image.startsWith("data:") ? "" : form.image} onChange={e => set("image", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="Paste image URL..." />
                <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-brand-300 rounded-lg px-3 py-2 hover:border-brand-500 transition-colors">
                  <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-xs text-brand-600 font-medium">{uploading ? "Uploading..." : form.image && !form.image.startsWith('data:') && form.image.startsWith('http') ? "Image uploaded ✅" : "Upload image from device"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-brand-600" />
              <span className="text-sm font-medium text-gray-700">Active / Visible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.showTimer} onChange={e => set('showTimer', e.target.checked)} className="w-4 h-4 accent-brand-600" />
              <span className="text-sm font-medium text-gray-700">Show Urgency Timer</span>
            </label>
          </div>

          <SeoFields seo={form.seo} onChange={seo => setForm(p => ({ ...p, seo }))} />
        </div>

        <div className="p-5 border-t flex gap-3 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)} className="px-5 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">Save Product</button>
        </div>
      </div>
    </div>
  );
}

export default function Admin({ onLogout }) {
  const { products, siteSettings, setSiteSettings, addProduct, updateProduct, deleteProduct, toggleActive, uploadImage, loading } = useStore();
  const [tab, setTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [globalSeo, setGlobalSeo] = useState(siteSettings);
  const [saved, setSaved] = useState(false);

  const handleAdd = (form) => { addProduct(form); setShowForm(false); };
  const handleEdit = (form) => { updateProduct(editTarget.id, form); setEditTarget(null); };
  const handleSaveSettings = () => { setSiteSettings(globalSeo); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const TABS = [
    { id: 'products', label: 'Products' },
    { id: 'seo', label: 'Global SEO' },
    { id: 'settings', label: 'Store Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin nav */}
      <div className="bg-brand-900 text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-sm">KeyStore CMS</span>
        <button onClick={() => { sessionStorage.removeItem('ks_admin'); onLogout(); }}
          className="text-xs text-brand-300 hover:text-white transition-colors">Sign Out</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        {loading && (
          <div className="flex items-center gap-2 mb-4 text-sm text-brand-600">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Loading from database...
          </div>
        )}
        <div className="flex gap-1 bg-white border rounded-xl p-1 mb-6 w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-brand-600 text-white' : 'text-gray-600 hover:text-gray-800'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Products ({products.length})</h2>
              <button onClick={() => setShowForm(true)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Product
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {products.map(p => {
                const discount = Math.round((1 - p.salePrice / p.originalPrice) * 100);
                return (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                    <img src={p.image || 'https://placehold.co/48x48?text=K'} className="w-12 h-12 object-contain rounded-lg bg-gray-50" alt={p.name}
                      onError={e => { e.target.src = 'https://placehold.co/48x48?text=K'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.category} · ₹{p.salePrice.toLocaleString('en-IN')} · -{discount}% · {p.showTimer ? '⏰ Timer ON' : 'No timer'}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleActive(p.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.active ? 'Live' : 'Hidden'}
                      </button>
                      <button onClick={() => setEditTarget(p)} className="text-gray-400 hover:text-brand-600 p-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => { if (confirm('Delete this product?')) deleteProduct(p.id); }} className="text-gray-400 hover:text-red-500 p-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GLOBAL SEO TAB */}
        {tab === 'seo' && (
          <div className="flex flex-col gap-5">
            <h2 className="font-bold text-gray-800">Global SEO Settings</h2>

            <div className="bg-white rounded-xl border p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Site Meta Title</label>
                <input value={globalSeo.metaTitle || ''} onChange={e => setGlobalSeo(s => ({ ...s, metaTitle: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
                <p className={`text-xs mt-1 ${(globalSeo.metaTitle || '').length > 60 ? 'text-red-500' : 'text-gray-400'}`}>{(globalSeo.metaTitle || '').length}/60 chars</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Site Meta Description</label>
                <textarea value={globalSeo.metaDesc || ''} onChange={e => setGlobalSeo(s => ({ ...s, metaDesc: e.target.value }))} rows={2}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                <p className={`text-xs mt-1 ${(globalSeo.metaDesc || '').length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{(globalSeo.metaDesc || '').length}/160 chars</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Default OG Image URL</label>
                <input value={globalSeo.ogImage || ''} onChange={e => setGlobalSeo(s => ({ ...s, ogImage: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Google Search Console Verification Tag</label>
                <input value={globalSeo.gscVerification || ''} onChange={e => setGlobalSeo(s => ({ ...s, gscVerification: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="google-site-verification=xxxx" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Google Analytics ID</label>
                <input value={globalSeo.analyticsId || ''} onChange={e => setGlobalSeo(s => ({ ...s, analyticsId: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="G-XXXXXXXXXX" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">robots.txt Content</label>
                <textarea value={globalSeo.robotsTxt || ''} onChange={e => setGlobalSeo(s => ({ ...s, robotsTxt: e.target.value }))} rows={4}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none font-mono" />
              </div>
            </div>

            <button onClick={handleSaveSettings}
              className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 w-fit">
              {saved ? '✅ Saved!' : 'Save SEO Settings'}
            </button>
          </div>
        )}

        {/* STORE SETTINGS TAB */}
        {tab === 'settings' && (
          <div className="flex flex-col gap-5">
            <h2 className="font-bold text-gray-800">Store Settings</h2>
            <div className="bg-white rounded-xl border p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Store Name</label>
                <input value={globalSeo.siteName || ''} onChange={e => setGlobalSeo(s => ({ ...s, siteName: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tagline</label>
                <input value={globalSeo.tagline || ''} onChange={e => setGlobalSeo(s => ({ ...s, tagline: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Buy Now Button URL</label>
                <input value={globalSeo.buyNowUrl || ''} onChange={e => setGlobalSeo(s => ({ ...s, buyNowUrl: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="https://wa.me/91..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">WhatsApp Number</label>
                <input value={globalSeo.whatsappNumber || ''} onChange={e => setGlobalSeo(s => ({ ...s, whatsappNumber: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" placeholder="+917094956963" />
              </div>
            </div>
            <button onClick={handleSaveSettings}
              className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-700 w-fit">
              {saved ? '✅ Saved!' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>

      {showForm && <ProductForm initial={EMPTY_PRODUCT} onSave={handleAdd} onCancel={() => setShowForm(false)} title="Add New Product" uploadImage={uploadImage} />}
      {editTarget && <ProductForm initial={editTarget} onSave={handleEdit} onCancel={() => setEditTarget(null)} title="Edit Product" uploadImage={uploadImage} />}
    </div>
  );
}
