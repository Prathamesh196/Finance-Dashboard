import React, { useContext } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const SummaryCards = () => {
  const { data } = useContext(FinanceContext);
  
  const totals = data.transactions.reduce((acc, t) => {
    const amt = Number(t.amount);
    if (t.type === 'income') acc.income += amt; else acc.expenses += amt;
    return acc;
  }, { income: 0, expenses: 0 });

  const cards = [
    { title: 'Balance', amount: totals.income - totals.expenses, icon: <Wallet />, color: 'blue' },
    { title: 'Income', amount: totals.income, icon: <TrendingUp />, color: 'emerald' },
    { title: 'Expenses', amount: totals.expenses, icon: <TrendingDown />, color: 'rose' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {cards.map((card, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4"
        >
          <div className={`p-3 md:p-4 rounded-xl bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600`}>
            {React.cloneElement(card.icon, { size: 20 })}
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{card.title}</p>
            <h3 className="text-lg md:text-2xl font-bold dark:text-white truncate">
              {formatCurrency(card.amount)}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SummaryCards;