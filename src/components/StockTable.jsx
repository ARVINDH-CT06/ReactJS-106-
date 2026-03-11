import React from 'react';

const StockTable = ({ medicines, loading }) => {
  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading API Data...</p>
      </div>
    );
  }

  if (!medicines || medicines.length === 0) {
    return (
      <div className="card empty-state">
        <p>No medicines found in the inventory.</p>
      </div>
    );
  }

  return (
    <div className="card table-container" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--pc-border)' }}>
        <h3 style={{ margin: 0 }}>Current Stock Levels</h3>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Expiry Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => {
            const isLowStock = med.stock <= 10;
            // Check expiry within 30 days
            const expiryDate = new Date(med.expiryDate);
            const today = new Date();
            const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            const isExpiringSoon = daysToExpiry <= 30 && daysToExpiry > 0;
            const isExpired = daysToExpiry <= 0;

            let statusBadge = null;
            if (isExpired) {
              statusBadge = <span className="badge badge-danger">Expired</span>;
            } else if (isLowStock) {
              statusBadge = <span className="badge badge-danger">Low Stock</span>;
            } else if (isExpiringSoon) {
               statusBadge = <span className="badge badge-warning">Expiring Soon</span>;
            } else {
              statusBadge = <span className="badge badge-success">Good</span>;
            }

            return (
              <tr key={med.id}>
                <td><strong>{med.name}</strong></td>
                <td>{med.category}</td>
                <td>${Number(med.price).toFixed(2)}</td>
                <td>
                  <span style={{ color: isLowStock ? 'var(--pc-danger)' : 'inherit', fontWeight: isLowStock ? 'bold' : 'normal' }}>
                    {med.stock} units
                  </span>
                </td>
                <td>
                  <span style={{ color: (isExpiringSoon || isExpired) ? 'var(--pc-warning)' : 'inherit' }}>
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </span>
                </td>
                <td>{statusBadge}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
