import React, { useContext } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SavingsGauge = () => {
  const { data } = useContext(FinanceContext);

  const totalIncome = data.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  
  const savings = Math.max(0, totalIncome - totalExpense);
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const chartData = [
    { name: 'Saved', value: savingsRate },
    { name: 'Spent', value: 100 - savingsRate }
  ];

  const COLOR = savingsRate > 20 ? '#10b981' : '#f59e0b'; // Green if > 20%, else Orange

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px] flex flex-col items-center">
      <h3 className="text-lg font-bold self-start dark:text-white">Savings Rate</h3>
      <div className="relative w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={90}
              startAngle={180}
              endAngle={0}
              dataKey="value"
            >
              <Cell fill={COLOR} />
              <Cell fill="#f3f4f6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
          <span className="text-4xl font-black dark:text-white">{savingsRate}%</span>
          <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Saved</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center px-4">
        {savingsRate > 20 ? "Excellent! You're hitting your goals." : "Try to reduce expenses to save more."}
      </p>
    </div>
  );
};

export default SavingsGauge;