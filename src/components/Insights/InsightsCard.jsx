import React, { useContext } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { Lightbulb, PieChart, Activity, Target, TrendingUp, AlertCircle, Calendar, Scale, CreditCard, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

const InsightsCard = () => {
  const { data } = useContext(FinanceContext);
  
  const transactions = data.transactions || [];
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');

  // Original Logic
  const categoryTotals = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  
  const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
    categoryTotals[a] > categoryTotals[b] ? a : b, 'None'
  );

  const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

  const monthlyBudget = 50000; 
  const budgetUsage = ((totalExpenses / monthlyBudget) * 100).toFixed(1);

  const largestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];

  // New Features Logic
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - today.getDate());
  const dailyRunway = Math.max(0, (monthlyBudget - totalExpenses) / daysLeft);

  const transactionCount = expenses.length;
  const cashflowRatio = totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(1) : (totalIncome > 0 ? '∞' : '0');
  const yearlyProjection = (totalIncome - totalExpenses) * 12;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {/* 1. Top Category - Visual Focus (Original) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
            <PieChart size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Peak Spending</span>
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Category</h3>
        <p className="text-2xl font-black dark:text-white mt-1 group-hover:text-blue-600 transition-colors">{topCategory}</p>
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            Total: <span className="text-gray-900 dark:text-gray-200">{formatCurrency(categoryTotals[topCategory] || 0)}</span>
          </p>
        </div>
      </motion.div>

      {/* 2. Savings Rate - Efficiency Ring Style (Original) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${Number(savingsRate) > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {Number(savingsRate) > 20 ? 'Healthy' : 'Low'}
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Savings Rate</h3>
        <p className="text-3xl font-black dark:text-white mt-1">{savingsRate}%</p>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
            <span>Efficiency</span>
            <span>Target 25%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* 3. Budget Status - Alert Style (Original) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Target size={24} />
          </div>
          {Number(budgetUsage) > 85 && <AlertCircle size={20} className="text-rose-500 animate-pulse" />}
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget Limit</h3>
        <p className="text-3xl font-black dark:text-white mt-1">{budgetUsage}%</p>
        <div className="mt-5">
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsage, 100)}%` }}
              className={`h-full rounded-full transition-colors duration-500 ${Number(budgetUsage) > 90 ? 'bg-rose-500' : 'bg-purple-500'}`}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase text-center">
            {formatCurrency(totalExpenses)} / {formatCurrency(monthlyBudget)}
          </p>
        </div>
      </motion.div>

      {/* 4. Smart Observation - Advice Card (Original) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg border-none relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb size={20} className="text-yellow-300 fill-yellow-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Smart Advice</span>
          </div>
          <p className="text-sm text-blue-50 leading-relaxed font-medium">
            Your <span className="text-white font-bold underline decoration-yellow-400">{largestExpense?.category}</span> bill is high. 
            Reducing it by <span className="text-yellow-300 font-black">10%</span> next month would save you <span className="bg-white/20 px-1.5 py-0.5 rounded text-white">{formatCurrency(largestExpense?.amount * 0.1 || 0)}</span>.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </motion.div>

      {/* 5. Daily Runway (New) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl">
            <Calendar size={24} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Days Left</span>
            <p className="text-lg font-bold dark:text-white">{daysLeft}</p>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Safe Daily Spend</h3>
        <p className="text-3xl font-black dark:text-white mt-1">{formatCurrency(dailyRunway)}</p>
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            To stay under budget
          </p>
        </div>
      </motion.div>

      {/* 6. Cashflow Ratio (New) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl">
            <Scale size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Health</span>
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Income / Expense</h3>
        <p className="text-3xl font-black dark:text-white mt-1">{cashflowRatio}x</p>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
            <span>{formatCurrency(totalIncome)} In</span>
            <span>{formatCurrency(totalExpenses)} Out</span>
          </div>
          <div className="w-full bg-rose-100 dark:bg-rose-900/30 h-2.5 rounded-full overflow-hidden flex">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalIncome / (totalIncome + totalExpenses)) * 100, 100)}%` }}
              className="bg-emerald-500 h-full"
            />
          </div>
        </div>
      </motion.div>

      {/* 7. Transaction Activity (New) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl">
            <CreditCard size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Volume</span>
        </div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</h3>
        <p className="text-3xl font-black dark:text-white mt-1">{transactionCount}</p>
        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            Avg: <span className="text-gray-900 dark:text-gray-200">{formatCurrency(transactionCount > 0 ? totalExpenses / transactionCount : 0)} / swipe</span>
          </p>
        </div>
      </motion.div>

      {/* 8. Yearly Forecast (New) */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ y: -5 }}
        className="group bg-gradient-to-br from-emerald-500 to-teal-700 p-6 rounded-3xl shadow-lg border-none relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <LineChart size={20} className="text-emerald-100" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Future Projection</span>
          </div>
          <h3 className="text-sm font-medium text-emerald-50">Yearly Savings Est.</h3>
          <p className="text-3xl font-black text-white mt-1">{formatCurrency(yearlyProjection)}</p>
          <p className="text-[11px] text-emerald-100 mt-3 font-medium leading-relaxed">
            If you maintain this month's cashflow, this is what you will save in exactly 12 months.
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      </motion.div>
    </motion.div>
  );
};

export default InsightsCard;