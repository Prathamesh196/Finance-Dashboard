import React, { useContext, useState } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const SpendingChart = () => {
  const { data, darkMode } = useContext(FinanceContext);
  const [hoveredColor, setHoveredColor] = useState(null);

  const categoryData = data.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) existing.value += Number(t.amount);
      else acc.push({ name: t.category, value: Number(t.amount) });
      return acc;
    }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

  if (categoryData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 font-medium">No expense data found</p>
      </div>
    );
  }

  // Dynamic background style for the smooth color transition
  const containerStyle = {
    backgroundColor: hoveredColor 
      ? (darkMode ? `${hoveredColor}15` : `${hoveredColor}08`) 
      : (darkMode ? '#1f2937' : '#ffffff'),
  };

  return (
    <div 
      className="p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px] transition-all duration-700 ease-in-out flex flex-col"
      style={containerStyle}
    >
      <h3 className="text-lg font-bold mb-2 dark:text-white shrink-0">Spending Breakdown</h3>
      
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={6}
              dataKey="value"
              onMouseEnter={(_, index) => setHoveredColor(COLORS[index % COLORS.length])}
              onMouseLeave={() => setHoveredColor(null)}
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ 
                    transition: 'all 0.4s ease',
                    outline: 'none',
                    filter: hoveredColor === COLORS[index % COLORS.length] 
                      ? `drop-shadow(0px 0px 10px ${COLORS[index % COLORS.length]}50)` 
                      : 'none'
                  }}
                  fillOpacity={hoveredColor && hoveredColor !== COLORS[index % COLORS.length] ? 0.4 : 1}
                />
              ))}
            </Pie>
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#111827' : '#ffffff',
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                padding: '10px 14px'
              }} 
              // THIS PART FIXES YOUR REQUEST:
              // returns [Value, "Category spent"]
              formatter={(value, name) => [
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(value)}
                </span>, 
                <span className="text-gray-500 dark:text-gray-400 font-semibold">
                  {name} spent
                </span>
              ]}
              labelFormatter={() => null} // Removes the extra header line
              separator=": "
            />
            
            <Legend 
              verticalAlign="bottom" 
              iconType="circle"
              formatter={(value, entry, index) => (
                <span className={`text-xs transition-all duration-300 ${
                  hoveredColor === COLORS[index % COLORS.length] 
                    ? 'text-gray-900 dark:text-white font-bold scale-105' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;