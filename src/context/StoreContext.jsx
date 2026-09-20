import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { defaultSiteSettings } from '../data/products';

const StoreContext = createContext(null);

function dbToProduct(row) {
  return {
    id: row.id, name: row.name,
    originalPrice: row.original_price, salePrice: row.sale_price,
    category: row.category, badge: row.badge, image: row.image,
    description: row.description, active: row.active, showTimer: row.show_timer,
    seo: row.seo || {}
  };
}

function productToDb(p) {
  return {
    id: p.id, name: p.name,
    original_price: Number(p.originalPrice), sale_price: Number(p.salePrice),
    category: p.category, badge: p.badge, image: p.image || '',
    description: p.description || '', active: p.active, show_timer: p.showTimer,
    seo: p.seo || {}, updated_at: new Date().toISOString()
  };
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [siteSettings, setSiteSettingsState] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: prods }, { data: settings }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: true }),
      supabase.from('settings').select('*').eq('id', 'global').single()
    ]);
    if (prods) setProducts(prods.map(dbToProduct));
    if (settings?.data) setSiteSettingsState(settings.data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const addProduct = async (p) => {
    const newP = { ...p, id: Date.now().toString() };
    const { data } = await supabase.from('products').insert(productToDb(newP)).select().single();
    if (data) setProducts(prev => [...prev, dbToProduct(data)]);
  };

  const updateProduct = async (id, p) => {
    const { data } = await supabase.from('products').update(productToDb({ ...p, id })).eq('id', id).select().single();
    if (data) setProducts(prev => prev.map(pr => pr.id === id ? dbToProduct(data) : pr));
  };

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleActive = async (id) => {
    const p = products.find(p => p.id === id);
    if (!p) return;
    const { data } = await supabase.from('products').update({ active: !p.active, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (data) setProducts(prev => prev.map(pr => pr.id === id ? dbToProduct(data) : pr));
  };

  const setSiteSettings = async (settings) => {
    setSiteSettingsState(settings);
    await supabase.from('settings').upsert({ id: 'global', data: settings });
  };

  const uploadImage = async (file) => {
    // Compress image first
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX = 600;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
        else { if (h > MAX) { w = w * MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        canvas.toBlob(async (blob) => {
          const fileName = `${Date.now()}.webp`;
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, blob, { contentType: 'image/webp', upsert: true });
          if (error) { resolve(''); return; }
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
          resolve(publicUrl);
        }, 'image/webp', 0.8);
      };
      img.src = url;
    });
  };

  return (
    <StoreContext.Provider value={{ products, siteSettings, setSiteSettings, addProduct, updateProduct, deleteProduct, toggleActive, uploadImage, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
