import { v4 as uuidv4 } from 'uuid';

// Simulated latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredMedicines = () => {
  const data = localStorage.getItem('pharmacy_medicines');
  return data ? JSON.parse(data) : [];
};

const setStoredMedicines = (medicines) => {
  localStorage.setItem('pharmacy_medicines', JSON.stringify(medicines));
};

export const api = {
  getMedicines: async () => {
    await delay(500);
    return getStoredMedicines();
  },

  addMedicine: async (medicine) => {
    await delay(300);
    const medicines = getStoredMedicines();
    const newMedicine = { ...medicine, id: uuidv4(), lastUpdated: new Date().toISOString() };
    medicines.push(newMedicine);
    setStoredMedicines(medicines);
    return newMedicine;
  },

  updateMedicine: async (id, updates) => {
    await delay(300);
    const medicines = getStoredMedicines();
    const index = medicines.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Medicine not found');
    
    medicines[index] = { ...medicines[index], ...updates, lastUpdated: new Date().toISOString() };
    setStoredMedicines(medicines);
    return medicines[index];
  },

  deleteMedicine: async (id) => {
    await delay(300);
    let medicines = getStoredMedicines();
    medicines = medicines.filter((m) => m.id !== id);
    setStoredMedicines(medicines);
    return true;
  },
  
  // Transaction processing (Billing)
  processSale: async (items) => {
    await delay(400); // Simulate network
    const medicines = getStoredMedicines();
    
    const updatedMedicines = medicines.map(med => {
      const soldItem = items.find(i => i.id === med.id);
      if (soldItem) {
        if (med.stock < soldItem.quantity) {
          throw new Error(`Insufficient stock for ${med.name}`);
        }
        return { ...med, stock: med.stock - soldItem.quantity };
      }
      return med;
    });
    
    setStoredMedicines(updatedMedicines);
    return true;
  }
};
