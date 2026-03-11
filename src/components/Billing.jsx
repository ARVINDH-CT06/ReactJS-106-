import React, { useState, useMemo } from 'react';
import { Plus, Trash2, CheckCircle, PackageSearch } from 'lucide-react';
import { useMedicine } from '../context/MedicineContext';

const Billing = () => {
  const { medicines, processSale } = useMedicine();
  const [cart, setCart] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedMed = useMemo(() => {
    return medicines.find(m => m.id === selectedMedId);
  }, [medicines, selectedMedId]);

  const handleAddToCart = () => {
    if (!selectedMed) return;
    
    // Validate quantity against stock
    const currentInCart = cart.find(item => item.id === selectedMed.id)?.quantity || 0;
    const qty = parseInt(quantity, 10);
    
    if (qty <= 0) {
      alert("Quantity must be at least 1.");
      return;
    }
    
    if (qty + currentInCart > selectedMed.stock) {
      alert(`Cannot add ${qty}. Only ${selectedMed.stock - currentInCart} left in stock.`);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === selectedMed.id);
      if (existing) {
        return prev.map(item => 
          item.id === selectedMed.id 
          ? { ...item, quantity: item.quantity + qty } 
          : item
        );
      }
      return [...prev, { ...selectedMed, quantity: qty }];
    });

    // Reset selection
    setSelectedMedId('');
    setQuantity(1);
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    if (window.confirm('Process this transaction and deduct stock?')) {
      try {
        setIsProcessing(true);
        // Map cart items for API call
        const itemsToProcess = cart.map(item => ({
          id: item.id,
          quantity: item.quantity
        }));
        
        await processSale(itemsToProcess);
        
        alert('Sale completed successfully!');
        setCart([]); // Clear cart
      } catch (err) {
        alert(err.message || 'Error processing sale');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  return (
    <div className="dashboard-grid">
      <div className="card glass">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PackageSearch size={20} /> Select Medicines
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Search & Select</label>
            <select 
              className="input-field" 
              value={selectedMedId} 
              onChange={(e) => setSelectedMedId(e.target.value)}
            >
              <option value="">-- Choose a medicine --</option>
              {medicines.filter(m => m.stock > 0).map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} - ${Number(m.price).toFixed(2)} ({m.stock} in stock)
                </option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Quantity</label>
            <input 
              type="number" 
              className="input-field" 
              min="1" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              disabled={!selectedMedId}
            />
          </div>

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '0.5rem' }}
            onClick={handleAddToCart}
            disabled={!selectedMedId}
          >
            <Plus size={16} /> Add to Bill
          </button>
        </div>
      </div>

      <div className="card glass">
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--pc-border)', paddingBottom: '1rem' }}>Current Bill</h3>
        
        {cart.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <p>Your bill is empty.</p>
          </div>
        ) : (
          <div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--pc-border)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.875rem' }}>{item.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem' }}>{item.quantity} x ${Number(item.price).toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.25rem', color: 'var(--pc-danger)', borderColor: 'transparent' }}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '2px dashed var(--pc-border)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>Total Amount:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--pc-primary)' }}>
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', background: 'var(--pc-success)' }}
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                <CheckCircle size={20} /> 
                {isProcessing ? 'Processing Transaction...' : 'Complete Sale'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
