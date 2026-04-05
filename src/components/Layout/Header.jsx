import React, { useContext } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { Moon, Sun, User, Menu, ChevronDown, ShieldCheck, Eye } from 'lucide-react';

const Header = ({ activeTab, toggleSidebar }) => {
  const { darkMode, setDarkMode, role, setRole } = useContext(FinanceContext);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-8 py-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleSidebar}
          className="p-2 lg:hidden rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-bold capitalize dark:text-white truncate">{activeTab}</h1>
      </div>
      
      <div className="flex items-center space-x-3 md:space-x-4">
        
        {/* Role Selection Dropdown */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none">
            {role === 'Admin' ? <ShieldCheck size={16} /> : <Eye size={16} />}
          </div>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {/* User Profile Avatar */}
        <div className="flex items-center border-l pl-3 md:pl-4 dark:border-gray-700">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-md shrink-0">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;