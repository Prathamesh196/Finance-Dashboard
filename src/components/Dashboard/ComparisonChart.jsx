import React, { useContext } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const ComparisonChart = () => {
  const { data, darkMode } = useContext(FinanceContext);

  // Group by date and ensure chronological order
  const groupedData = data.transactions
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, t) => {
      const existing = acc.find(item => item.date === t.date);
      if (existing) {
        if (t.type === 'income') existing.income += Number(t.amount);
        else existing.expense += Number(t.amount);
      } else {
        acc.push({ 
          date: t.date, 
          income: t.type === 'income' ? Number(t.amount) : 0, 
          expense: t.type === 'expense' ? Number(t.amount) : 0 
        });
      }
      return acc;
    }, [])
    .slice(-6); 

  // Custom Tooltip Component for better Dark Mode and Formatting
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">
            Date: {new Date(label).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Income:</span>
              <span className="text-sm font-bold text-emerald-600">
                {formatCurrency(payload[0].value)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Expense:</span>
              <span className="text-sm font-bold text-rose-500">
                {formatCurrency(payload[1].value)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px]">
      <h3 className="text-lg font-bold mb-6 dark:text-white">Income vs Expenses</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={groupedData} 
          margin={{ top: 0, right: 0, left: 15, bottom: 0 }}
          barGap={8} 
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={darkMode ? '#374151' : '#f3f4f6'} 
          />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: darkMode ? '#ffffff' : '#9ca3af', fontSize: 12 }}
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: darkMode ? '#ffffff' : '#9ca3af', fontSize: 12 }}
            tickFormatter={(val) => formatCurrency(val)}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: darkMode ? '#ffffff05' : '#f9fafb', radius: 4 }} 
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ 
              paddingBottom: '20px', 
              fontSize: '12px',
              color: darkMode ? '#ffffff' : '#6b7280'
            }}
          />
          <Bar 
            dataKey="income" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
            name="Income" 
            barSize={28}
            animationDuration={1000}
          />
          <Bar 
            dataKey="expense" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]} 
            name="Expense" 
            barSize={28}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;