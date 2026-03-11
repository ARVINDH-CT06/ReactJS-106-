import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Activity, Package, ShoppingCart, Moon, Sun } from 'lucide-react';

// Pages placeholders
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';

function App() {
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('pharmacy_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pharmacy_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Activity },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/sales', label: 'Sales & Billing', icon: ShoppingCart },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ padding: '0 0.5rem 2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--pc-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Activity size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--pc-text-1)' }}>PharmaPro</h2>
        </div>
        
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive && item.path !== '/' || (isActive && location.pathname === '/') ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--pc-border)' }}>
          <button 
             onClick={toggleTheme}
             className="nav-link" 
             style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
