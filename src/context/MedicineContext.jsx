import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const MedicineContext = createContext();

export const useMedicine = () => {
  return useContext(MedicineContext);
};

export const MedicineProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await api.getMedicines();
      // Initialize with some dummy data if empty
      if (data.length === 0) {
         const dummyData = [
           { id: '1', name: 'Paracetamol 500mg', category: 'Analgesic', price: 1.5, stock: 150, expiryDate: '2026-12-01' },
           { id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 5.0, stock: 12, expiryDate: '2026-04-15' },
           { id: '3', name: 'Cetirizine 10mg', category: 'Antihistamine', price: 2.5, stock: 80, expiryDate: '2025-08-20' },
           { id: '4', name: 'Ibuprofen 400mg', category: 'NSAID', price: 3.0, stock: 5, expiryDate: '2025-01-10' }, // near expiry/low stock
         ];
         for(let med of dummyData) { await api.addMedicine(med); }
         const freshData = await api.getMedicines();
         setMedicines(freshData);
      } else {
        setMedicines(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMedicine = async (medicine) => {
    try {
      const newMed = await api.addMedicine(medicine);
      setMedicines([...medicines, newMed]);
      return newMed;
    } catch (err) {
      throw err;
    }
  };

  const updateMedicine = async (id, updates) => {
    try {
      const updatedMed = await api.updateMedicine(id, updates);
      setMedicines(medicines.map(m => m.id === id ? updatedMed : m));
      return updatedMed;
    } catch (err) {
      throw err;
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await api.deleteMedicine(id);
      setMedicines(medicines.filter(m => m.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const processSale = async (items) => {
    try {
      await api.processSale(items);
      await fetchMedicines(); // Refresh stock
    } catch (err) {
      throw err;
    }
  };

  return (
    <MedicineContext.Provider value={{
      medicines,
      loading,
      error,
      fetchMedicines,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      processSale
    }}>
      {children}
    </MedicineContext.Provider>
  );
};
