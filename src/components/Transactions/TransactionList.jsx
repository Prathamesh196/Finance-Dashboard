import React, { useContext, useState, useMemo } from 'react';
import { FinanceContext } from '../../context/FinanceContext';
import { Plus, Search, Trash2, Calendar, Edit2, X, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const TransactionList = () => {
  // Ensure updateTransaction is destructured here
  const { data, role, addTransaction, deleteTransaction, updateTransaction } = useContext(FinanceContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({ 
    date: '', 
    amount: '', 
    category: '', 
    type: 'expense' 
  });

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return data.transactions.filter(t => {
      const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [data.transactions, searchTerm, filterType]);

  // Handle Submit (Both Add and Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amount || !formData.category || !formData.date) {
      alert("Please fill all fields");
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingId) {
      // Logic for Updating existing transaction
      updateTransaction(editingId, transactionData);
      setEditingId(null);
    } else {
      // Logic for Adding new transaction
      addTransaction({
        ...transactionData,
        id: Date.now() // Ensure a unique ID if your context doesn't handle it
      });
    }
    
    // Reset Form and State
    setFormData({ date: '', amount: '', category: '', type: 'expense' });
    setShowForm(false);
  };

  // Populate form for Editing
  const startEdit = (t) => {
    setEditingId(t.id);
    setFormData({ 
      date: t.date, 
      amount: t.amount, 
      category: t.category, 
      type: t.type 
    });
    setShowForm(true);
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ date: '', amount: '', category: '', type: 'expense' });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header / Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search category..."
              className="border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        {role === 'Admin' && (
          <button
            onClick={() => editingId ? cancelEdit() : setShowForm(!showForm)}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium w-full sm:w-auto shadow-sm ${
              editingId || showForm 
                ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {editingId || showForm ? <X size={16} /> : <Plus size={16} />}
            <span>{editingId ? 'Cancel Edit' : showForm ? 'Close Form' : 'Add New'}</span>
          </button>
        )}
      </div>

      {/* Admin Add/Edit Form */}
      {showForm && role === 'Admin' && (
        <div className={`p-6 border rounded-2xl transition-all shadow-sm ${
          editingId 
            ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' 
            : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold dark:text-white">
              {editingId ? 'Modify Transaction' : 'Create New Transaction'}
            </h4>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date</label>
              <input type="date" required className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Amount</label>
              <input type="number" step="0.01" required className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category</label>
              <input type="text" required className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Salary, Food" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Type</label>
              <select className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button 
              type="submit" 
              className={`flex items-center justify-center space-x-2 text-white px-6 py-2 rounded-lg text-sm font-bold h-[38px] transition-all shadow-md active:scale-95 ${
                editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {editingId ? <Check size={16} /> : <Plus size={16} />}
              <span>{editingId ? 'Update' : 'Save'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Main List Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Mobile List View */}
        <div className="block md:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((t) => (
              <div key={t.id} className={`p-4 space-y-3 transition-colors ${editingId === t.id ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">{t.category}</span>
                    <span className="text-[10px] text-gray-400 flex items-center mt-1 font-medium">
                      <Calendar size={12} className="mr-1" />
                      {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full mt-1 ${
                      t.type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
                    }`}>
                      {t.type}
                    </span>
                  </div>
                </div>
                {role === 'Admin' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => startEdit(t)} className="flex-1 flex items-center justify-center space-x-2 py-2 text-amber-600 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-xs font-bold active:bg-amber-100 transition-colors">
                      <Edit2 size={14} /> <span>Edit</span>
                    </button>
                    <button onClick={() => deleteTransaction(t.id)} className="flex-1 flex items-center justify-center space-x-2 py-2 text-rose-600 bg-rose-50 dark:bg-rose-900/10 rounded-lg text-xs font-bold active:bg-rose-100 transition-colors">
                      <Trash2 size={14} /> <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm italic">No records found.</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className={`hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors ${editingId === t.id ? 'bg-amber-50/40 dark:bg-amber-900/10' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">{t.category}</span>
                      <span className={`text-[10px] w-fit px-2 py-0.5 rounded-full font-black uppercase mt-1.5 ${
                        t.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20'
                      }`}>
                        {t.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className={`px-6 py-4 text-right font-black ${
                    t.type === 'income' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-2">
                      {role === 'Admin' ? (
                        <>
                          <button onClick={() => startEdit(t)} className="text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 p-2 rounded-lg transition-all" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => deleteTransaction(t.id)} className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2 rounded-lg transition-all" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-gray-300 uppercase italic">View Only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;