import React, { useMemo } from 'react';
import { Package, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { useMedicine } from '../context/MedicineContext';
import StockTable from '../components/StockTable';

const Dashboard = () => {
  const { medicines, loading, error } = useMedicine();

  // Compute stats
  const stats = useMemo(() => {
    let totalStock = 0;
    let lowStockCount = 0;
    let expiringCount = 0;

    const today = new Date();

    medicines.forEach((med) => {
      totalStock += Number(med.stock);
      
      if (med.stock <= 10) lowStockCount++;

      const expiryDate = new Date(med.expiryDate);
      const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      if (daysToExpiry <= 30 && daysToExpiry >= 0) {
        expiringCount++;
      }
    });

    return {
      totalItems: medicines.length,
      totalStock,
      lowStockCount,
      expiringCount
    };
  }, [medicines]);

  if (error) {
    return <div className="card" style={{ borderColor: 'var(--pc-danger)' }}><p className="error-text">Error loading data: {error}</p></div>;
  }

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Dashboard</h1>
          <p>Overview of your pharmacy's current status.</p>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card stat-card glass">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Medicines</h3>
            <p>{stats.totalItems}</p>
          </div>
        </div>

        <div className="card stat-card glass" style={{ borderColor: stats.lowStockCount > 0 ? 'var(--pc-danger)' : 'var(--pc-border)' }}>
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--pc-danger)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>Low Stock Alerts</h3>
            <p style={{ color: stats.lowStockCount > 0 ? 'var(--pc-danger)' : 'inherit' }}>
              {stats.lowStockCount}
            </p>
          </div>
        </div>

        <div className="card stat-card glass" style={{ borderColor: stats.expiringCount > 0 ? 'var(--pc-warning)' : 'var(--pc-border)' }}>
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--pc-warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Expiring Soon (30d)</h3>
            <p style={{ color: stats.expiringCount > 0 ? 'var(--pc-warning)' : 'inherit' }}>
              {stats.expiringCount}
            </p>
          </div>
        </div>

        <div className="card stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--pc-success)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Stock Volume</h3>
            <p>{stats.totalStock}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main panel">
          <StockTable medicines={medicines} loading={loading} />
        </div>
        <div className="dashboard-side panel">
           <div className="card glass">
             <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--pc-border)', paddingBottom: '1rem' }}>Notifications</h3>
             
             {stats.lowStockCount === 0 && stats.expiringCount === 0 && (
               <p style={{ color: 'var(--pc-text-3)', textAlign: 'center', padding: '1rem 0' }}>All systems nominal. No urgent alerts.</p>
             )}

             {medicines.filter(m => m.stock <= 10).map(m => (
               <div key={`low-${m.id}`} style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.05)', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--pc-danger)', marginBottom: '0.5rem' }}>
                 <p style={{ margin: 0, fontSize: '0.875rem' }}><strong style={{ color: 'var(--pc-text-1)'}}>{m.name}</strong> is critically low on stock ({m.stock} left).</p>
               </div>
             ))}

             {medicines.filter(m => {
                 const expiry = new Date(m.expiryDate);
                 const days = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                 return days <= 30 && days >= 0;
             }).map(m => (
               <div key={`exp-${m.id}`} style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: 'var(--border-radius-sm)', borderLeft: '3px solid var(--pc-warning)', marginBottom: '0.5rem' }}>
                 <p style={{ margin: 0, fontSize: '0.875rem' }}><strong style={{ color: 'var(--pc-text-1)'}}>{m.name}</strong> expires on {new Date(m.expiryDate).toLocaleDateString()}.</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
