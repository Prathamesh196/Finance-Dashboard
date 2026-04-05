import React, { useContext, useState } from 'react';
import { FinanceContext } from './context/FinanceContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import SummaryCards from './components/Dashboard/SummaryCards';
import BalanceChart from './components/Dashboard/BalanceChart';
import SpendingChart from './components/Dashboard/SpendingChart';
import ComparisonChart from './components/Dashboard/ComparisonChart';
import SavingsGauge from './components/Dashboard/SavingsGauge';
import TransactionList from './components/Transactions/TransactionList';
import InsightsCard from './components/Insights/InsightsCard';
import Toast from './components/UI/Toast.jsx';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading } = useContext(FinanceContext);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          activeTab={activeTab} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6 md:space-y-8">
                  <SummaryCards />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <BalanceChart />
                    <ComparisonChart />
                    <SpendingChart />
                    <SavingsGauge />
                  </div>
                </div>
              )}
              {activeTab === 'transactions' && <TransactionList />}
              {activeTab === 'insights' && <InsightsCard />}
            </motion.div>
          </AnimatePresence>

          {/* Footer Section */}
          <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Developed by <span className="font-bold text-gray-900 dark:text-white">Prathamesh Gawali</span>
            </p>
            <a 
              href="mailto:prathameshgawali19@gmail.com" 
              className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors mt-1 inline-block"
            >
              prathameshgawali19@gmail.com
            </a>
          </footer>
        </main>
      </div>
      <Toast />
    </div>
  );
}

export default App;