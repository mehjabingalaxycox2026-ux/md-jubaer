
import React, { useState } from 'react';
import { ExpenseEntry } from '../types';
import { CURRENCY, CATEGORIES } from '../constants';
import { Plus, Trash2, Wallet, Receipt, Calendar, Tag, ChevronDown } from 'lucide-react';

interface ExpensesProps {
  expenses: ExpenseEntry[];
  onAdd: (entry: Omit<ExpenseEntry, 'id'>) => void;
  onDelete: (id: string) => void;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, onAdd, onDelete }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Other' as ExpenseEntry['category'],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    onAdd({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description
    });
    setFormData(prev => ({ ...prev, amount: '', description: '' }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Expense Manager</h2>
        <p className="text-slate-500">Log all operational costs including rent, salary, and bills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Receipt className="text-blue-600" size={20} />
              Add New Expense
            </h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Amount ({CURRENCY})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{CURRENCY}</span>
                <input 
                  type="number" 
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
              <textarea 
                placeholder="e.g. Monthly shop rent"
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm h-24"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={20} />
              Record Expense
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
                <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full uppercase">
                  {expenses.length} Entries
                </span>
             </div>
             <div className="divide-y divide-slate-50">
               {expenses.length === 0 ? (
                 <div className="p-12 text-center text-slate-400">
                   <Wallet size={48} className="mx-auto mb-4 opacity-20" />
                   No expenses recorded yet.
                 </div>
               ) : (
                 expenses.map(expense => (
                   <div key={expense.id} className="p-4 hover:bg-slate-50 flex items-center justify-between transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          expense.category === 'Rent' ? 'bg-orange-100 text-orange-600' :
                          expense.category === 'Salary' ? 'bg-purple-100 text-purple-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          <Receipt size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{expense.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                             <span className="font-medium text-slate-700">{expense.category}</span>
                             <span>•</span>
                             <span>{expense.date}</span>
                          </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-red-600">-{CURRENCY}{expense.amount}</span>
                        <button 
                          onClick={() => onDelete(expense.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
