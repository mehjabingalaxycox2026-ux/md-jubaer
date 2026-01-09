
import React, { useMemo, useState } from 'react';
import { TicketEntry, ExpenseEntry } from '../types';
import { CURRENCY } from '../constants';
import { Download, FileSpreadsheet, FilePieChart, Filter, TrendingUp } from 'lucide-react';

interface ReportsProps {
  tickets: TicketEntry[];
  expenses: ExpenseEntry[];
}

const Reports: React.FC<ReportsProps> = ({ tickets, expenses }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => t.date.startsWith(selectedMonth));
  }, [tickets, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  const report = useMemo(() => {
    // Explicitly cast to number to avoid TS arithmetic errors
    const totalTickets: number = filteredTickets.reduce((sum, t) => sum + (t.count || 0), 0);
    const totalComm: number = filteredTickets.reduce((sum, t) => sum + (t.totalCommission || 0), 0);
    const totalExp: number = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit: number = totalComm - totalExp;

    const expenseByCategory = filteredExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return { totalTickets, totalComm, totalExp, netProfit, expenseByCategory };
  }, [filteredTickets, filteredExpenses]);

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Category/Description", "Amount", "Tickets"];
    const rows = [
      ...filteredTickets.map(t => [t.date, "Commission", t.sourceEmailSubject || "Manual", t.totalCommission, t.count]),
      ...filteredExpenses.map(e => [e.date, "Expense", e.description, -e.amount, 0])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
          <p className="text-slate-500">Monthly rollup and performance analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
              type="month" 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
             />
          </div>
          <button 
            onClick={handleExportCSV}
            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2 px-4 font-bold shadow-md"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-blue-100 text-sm font-medium">Total Comm. This Month</p>
          <h3 className="text-3xl font-bold mt-2">{CURRENCY}{report.totalComm.toLocaleString()}</h3>
          <p className="text-blue-200 text-xs mt-4 flex items-center gap-1">
            <TrendingUp size={12} /> From {report.totalTickets} tickets sold
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-rose-700 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-red-100 text-sm font-medium">Monthly Overhead</p>
          <h3 className="text-3xl font-bold mt-2">{CURRENCY}{report.totalExp.toLocaleString()}</h3>
          <p className="text-red-200 text-xs mt-4 flex items-center gap-1">
            <Download className="rotate-180" size={12} /> {Object.keys(report.expenseByCategory).length} categories logged
          </p>
        </div>
        <div className={`p-6 rounded-2xl text-white shadow-lg bg-gradient-to-br ${report.netProfit >= 0 ? 'from-emerald-600 to-teal-700' : 'from-orange-600 to-red-700'}`}>
          <p className="text-white/80 text-sm font-medium">Net Profit / Loss</p>
          <h3 className="text-3xl font-bold mt-2">{CURRENCY}{report.netProfit.toLocaleString()}</h3>
          <p className="text-white/60 text-xs mt-4 flex items-center gap-1">
            Calculated after all expenses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <div className="flex items-center gap-2 mb-6">
             <FilePieChart className="text-blue-600" />
             <h3 className="font-bold text-slate-800">Expense Breakdown</h3>
           </div>
           <div className="space-y-4">
             {Object.entries(report.expenseByCategory).map(([cat, amt]) => {
               const pct = ((amt / (report.totalExp || 1)) * 100).toFixed(0);
               return (
                 <div key={cat} className="space-y-1">
                   <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="text-slate-500">{CURRENCY}{amt} ({pct}%)</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full" style={{ width: `${pct}%` }}></div>
                   </div>
                 </div>
               );
             })}
             {Object.keys(report.expenseByCategory).length === 0 && (
               <p className="text-center text-slate-400 py-8 italic">No expenses for this period.</p>
             )}
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <div className="flex items-center gap-2 mb-6">
             <FileSpreadsheet className="text-emerald-600" />
             <h3 className="font-bold text-slate-800">Quick Stats</h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                 <p className="text-xs text-slate-500 uppercase font-bold">Avg. Comm/Ticket</p>
                 <p className="text-xl font-bold text-slate-800">{CURRENCY}{(Number(report.totalComm) / (Number(report.totalTickets) || 1)).toFixed(1)}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                 <p className="text-xs text-slate-500 uppercase font-bold">Entries Count</p>
                 <p className="text-xl font-bold text-slate-800">{filteredTickets.length + filteredExpenses.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                 <p className="text-xs text-slate-500 uppercase font-bold">Busiest Day</p>
                 <p className="text-xl font-bold text-slate-800">
                   {filteredTickets.length > 0 ? [...filteredTickets].sort((a,b) => (b.count || 0) - (a.count || 0))[0].date.split('-').slice(2).join('') : 'N/A'}
                 </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                 <p className="text-xs text-slate-500 uppercase font-bold">Profit Margin</p>
                 <p className="text-xl font-bold text-slate-800">{((Number(report.netProfit) / (Number(report.totalComm) || 1)) * 100).toFixed(1)}%</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
