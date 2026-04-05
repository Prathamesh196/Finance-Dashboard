import React, { useContext } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const BalanceChart = () => {
  const { data, darkMode } = useContext(FinanceContext);

  const chartData = data.transactions
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, t) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const newBalance = t.type === 'income' ? lastBalance + Number(t.amount) : lastBalance - Number(t.amount);
      acc.push({ date: t.date, balance: newBalance });
      return acc;
    }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px]">
      <h3 className="text-lg font-bold mb-6 dark:text-white">Balance Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#f3f4f6'} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }} 
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            tickFormatter={(val) => formatCurrency(val)}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#1f2937' : '#fff', 
              border: 'none', 
              borderRadius: '12px', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              color: darkMode ? '#fff' : '#000'
            }}
            formatter={(value) => [formatCurrency(value), 'Balance']}
          />
          <Area 
            type="monotone" 
            dataKey="balance" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;