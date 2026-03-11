import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useMedicine } from '../context/MedicineContext';
import MedicineForm from '../components/MedicineForm';

const Inventory = () => {
  const { medicines, loading, error, addMedicine, updateMedicine, deleteMedicine } = useMedicine();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenForm = (med = null) => {
    setEditingMedicine(med);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingMedicine(null);
    setIsFormOpen(false);
  };

  const handleSave = async (data) => {
    if (editingMedicine) {
      await updateMedicine(editingMedicine.id, data);
    } else {
      await addMedicine(data);
    }
    handleCloseForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      await deleteMedicine(id);
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="top-bar">
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem' }}>Inventory Management</h1>
          <p>Add, edit, or remove medicines from your stock.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenForm()}>
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      {isFormOpen && (
        <div style={{ marginBottom: '2rem' }}>
          <MedicineForm 
            initialData={editingMedicine} 
            onSave={handleSave} 
            onCancel={handleCloseForm} 
          />
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={20} color="var(--pc-text-3)" />
          <input 
            type="text" 
            placeholder="Search medicines by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              width: '100%', 
              outline: 'none',
              color: 'var(--pc-text-1)',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      <div className="card table-container" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Inventory...</div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--pc-danger)' }}>Error: {error}</div>
        ) : filteredMedicines.length === 0 ? (
          <div className="empty-state">
             <p>No medicines match your search. Try adjusting the filters or adding a new medicine.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Expiry Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map((med) => (
                <tr key={med.id}>
                  <td><strong>{med.name}</strong></td>
                  <td>{med.category}</td>
                  <td>${Number(med.price).toFixed(2)}</td>
                  <td>{med.stock}</td>
                  <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.25rem 0.5rem' }}
                        onClick={() => handleOpenForm(med)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.25rem 0.5rem', color: 'var(--pc-danger)', borderColor: 'var(--pc-danger)' }}
                        onClick={() => handleDelete(med.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Inventory;
