import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const MedicineForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Medicine name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0 || !Number.isInteger(Number(formData.stock))) {
      newErrors.stock = 'Stock must be a non-negative integer';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const selected = new Date(formData.expiryDate);
      const today = new Date();
      // Reset times to compare just dates
      today.setHours(0, 0, 0, 0); 
      selected.setHours(0,0,0,0);
      
      if (selected <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      // Ensure numeric fields are cast properly
      const dataToSave = {
        ...formData,
        price: Number(formData.price),
        stock: parseInt(formData.stock, 10)
      };
      await onSave(dataToSave);
    } catch (err) {
      console.error(err);
      alert('Failed to save medicine');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card glass" style={{ position: 'relative' }}>
      <button 
        onClick={onCancel} 
        style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--pc-text-2)' }}
      >
        <X size={20} />
      </button>

      <h3 style={{ marginBottom: '1.5rem', marginTop: '0.25rem' }}>
        {initialData ? 'Edit Medicine' : 'Add New Medicine'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
           <div className="input-group">
            <label className="input-label">Medicine Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={`input-field ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Paracetamol 500mg"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Category</label>
            <input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className={`input-field ${errors.category ? 'input-error' : ''}`}
              placeholder="e.g. Analgesic"
            />
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              className={`input-field ${errors.price ? 'input-error' : ''}`}
              placeholder="0.00"
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Initial Stock</label>
            <input 
              type="number" 
              name="stock" 
              value={formData.stock} 
              onChange={handleChange} 
              className={`input-field ${errors.stock ? 'input-error' : ''}`}
              placeholder="0"
            />
            {errors.stock && <p className="error-text">{errors.stock}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Expiry Date</label>
            <input 
              type="date" 
              name="expiryDate" 
              value={formData.expiryDate} 
              onChange={handleChange} 
              className={`input-field ${errors.expiryDate ? 'input-error' : ''}`}
            />
            {errors.expiryDate && <p className="error-text">{errors.expiryDate}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? 'Saving...' : 'Save Medicine'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicineForm;
