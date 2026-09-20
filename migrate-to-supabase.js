// Run this in browser console on keysstore.vercel.app/admin
// It will output SQL to insert all your existing products into Supabase

const products = JSON.parse(localStorage.getItem('ks_products') || '[]');
const settings = JSON.parse(localStorage.getItem('ks_settings') || '{}');

console.log('=== PRODUCTS SQL ===');
products.forEach(p => {
  const seo = JSON.stringify(p.seo || {}).replace(/'/g, "''");
  const name = (p.name || '').replace(/'/g, "''");
  const desc = (p.description || '').replace(/'/g, "''");
  const img = (p.image || '').startsWith('data:') ? '' : (p.image || '');
  const badge = (p.badge || '').replace(/'/g, "''");
  console.log(`INSERT INTO products (id,name,original_price,sale_price,category,badge,image,description,active,show_timer,seo) VALUES ('${p.id}','${name}',${p.originalPrice||0},${p.salePrice||0},'${p.category||'Software'}','${badge}','${img}','${desc}',${p.active!==false},${p.showTimer!==false},'${seo}') ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name,original_price=EXCLUDED.original_price,sale_price=EXCLUDED.sale_price,category=EXCLUDED.category,badge=EXCLUDED.badge,description=EXCLUDED.description,active=EXCLUDED.active,show_timer=EXCLUDED.show_timer,seo=EXCLUDED.seo;`);
});

console.log('=== SETTINGS SQL ===');
const settingsJson = JSON.stringify(settings).replace(/'/g, "''");
console.log(`INSERT INTO settings (id,data) VALUES ('global','${settingsJson}') ON CONFLICT (id) DO UPDATE SET data=EXCLUDED.data;`);
