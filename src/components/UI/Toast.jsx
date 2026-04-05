import React, { useContext } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { CheckCircle } from 'lucide-react';

const Toast = () => {
  const { notification } = useContext(FinanceContext);

  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-3 z-50">
      <CheckCircle size={20} className="text-emerald-400" />
      <span className="text-sm font-medium">{notification}</span>
    </div>
  );
};

export default Toast;