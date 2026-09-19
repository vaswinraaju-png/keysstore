import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

function AdminGuard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ks_admin') === '1');
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <Admin onLogout={() => setAuthed(false)} />;
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/admin" element={<AdminGuard />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
