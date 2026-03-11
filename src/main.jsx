import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { MedicineProvider } from './context/MedicineContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MedicineProvider>
        <App />
      </MedicineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
