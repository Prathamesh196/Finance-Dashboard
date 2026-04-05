import React, { useContext, useMemo } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const BalanceChart = () => {
  const { data, darkMode } = useContext(FinanceContext);

  const chartData = useMemo(() => {
    // 1. Assign a reliable timestamp to every transaction
    const processedTx = (data.transactions || []).map(t => {
      let ts = new Date(t.date).getTime();
      // Fallback for non-standard date formats
      if (isNaN(ts)) {
        const parts = String(t.date).split(/[-/]/);
        if (parts.length === 3) ts = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
        if (isNaN(ts)) ts = 0;
      }
      return { ...t, timestamp: ts };
    });

    // 2. Sort strictly ascending (Oldest on the Left -> Newest on the Right)
    processedTx.sort((a, b) => a.timestamp - b.timestamp);

    // 3. Calculate running balance and group by exact day (removes duplicates)
    let currentBalance = 0;
    const groupedDays = [];

    processedTx.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'income') {
        currentBalance += amount;
      } else {
        currentBalance -= amount;
      }

      if (t.timestamp === 0) return;

      const d = new Date(t.timestamp);
      // Create a unique key for the day (YYYY-MM-DD)
      const dayKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

      const existing = groupedDays.find(g => g.dayKey === dayKey);
      if (existing) {
        // Overwrite to reflect the closing balance of that specific day
        existing.balance = currentBalance;
      } else {
        groupedDays.push({
          dayKey,
          balance: currentBalance,
          timestamp: t.timestamp,
          originalDate: t.date
        });
      }
    });

    // 4. Final ascending sort to guarantee left-to-right chronological order
    groupedDays.sort((a, b) => a.timestamp - b.timestamp);

    return groupedDays.map(item => ({
      date: item.originalDate,
      balance: item.balance
    })).slice(-14);

  }, [data.transactions]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dateObj = new Date(label);
      const displayDate = !isNaN(dateObj.getTime()) 
        ? dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : label;

      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">
            {displayDate}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Balance:</span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Balance Trend</h3>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={darkMode ? '#374151' : '#f3f4f6'} 
            />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(str) => {
                const date = new Date(str);
                if (isNaN(date.getTime())) return str;
                return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
              }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;