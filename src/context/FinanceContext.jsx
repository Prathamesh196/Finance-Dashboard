import React, { createContext, useState, useEffect } from 'react';
import initialMockData from '../data/mockData.json';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [data, setData] = useState({ transactions: [] });
  const [role, setRole] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const saved = localStorage.getItem('finance_data');
        if (saved) {
          setData(JSON.parse(saved));
        } else {
          setData(initialMockData);
        }
      } catch (error) {
        console.error("Failed to load finance data:", error);
        setData(initialMockData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('finance_data', JSON.stringify(data));
    }
  }, [data, loading]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const addTransaction = (transaction) => {
    const newTx = { ...transaction, id: Date.now() };
    setData(prev => ({
      ...prev,
      transactions: [newTx, ...prev.transactions]
    }));
    setNotification("Transaction added successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteTransaction = (id) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
    setNotification("Transaction deleted.");
    setTimeout(() => setNotification(null), 3000);
  };

  const updateTransaction = (id, updatedTransaction) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? { ...t, ...updatedTransaction, id } : t
      )
    }));
    setNotification("Transaction updated successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <FinanceContext.Provider value={{ 
      data, 
      role, 
      setRole, 
      addTransaction, 
      deleteTransaction,
      updateTransaction, // <--- ADDED THIS LINE
      loading, 
      darkMode, 
      setDarkMode, 
      notification 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};