import { createContext, useContext, useState, useEffect } from 'react';
import { defaultProducts, defaultSiteSettings } from '../data/products';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('ks_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    const saved = localStorage.getItem('ks_settings');
    return saved ? JSON.parse(saved) : defaultSiteSettings;
  });

  useEffect(() => {
    localStorage.setItem('ks_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ks_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  const addProduct = (p) => {
    const newP = { ...p, id: Date.now().toString() };
    setProducts(prev => [...prev, newP]);
  };

  const updateProduct = (id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleActive = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <StoreContext.Provider value={{ products, siteSettings, setSiteSettings, addProduct, updateProduct, deleteProduct, toggleActive }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
