import React from 'react';
import Billing from '../components/Billing';

const Sales = () => {
  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Sales & Billing</h1>
          <p>Create bills and deduct purchased items from stock automatically.</p>
        </div>
      </div>
      
      <Billing />
    </div>
  );
};

export default Sales;
