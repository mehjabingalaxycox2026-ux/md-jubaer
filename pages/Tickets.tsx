
import React, { useState } from 'react';
import { TicketEntry } from '../types';
import { extractTicketData } from '../services/geminiService';
import { 
  Search, 
  Trash2, 
  Plus, 
  RefreshCcw, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  Ticket
} from 'lucide-react';
import { CURRENCY } from '../constants';

interface TicketsProps {
  tickets: TicketEntry[];
  onAdd: (entry: Omit<TicketEntry, 'id' | 'timestamp' | 'totalCommission'>) => void;
  onDelete: (id: string) => void;
}

const Tickets: React.FC<TicketsProps> = ({ tickets, onAdd, onDelete }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSync = async () => {
    if (!emailInput.trim()) return;
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const data = await extractTicketData(emailInput);
      onAdd({
        date: data.date,
        count: data.ticketCount,
        rate: data.rate,
        sourceEmailSubject: data.subject
      });
      setSyncStatus({ type: 'success', msg: `Successfully synced ${data.ticketCount} tickets!` });
      setEmailInput('');
      setShowManual(false);
    } catch (err) {
      setSyncStatus({ type: 'error', msg: 'Failed to extract data. Please check input format.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ticket Ledger</h2>
          <p className="text-slate-500">Track every commission earned from issued tickets</p>
        </div>
        <button 
          onClick={() => setShowManual(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Mail size={18} />
          <span>Sync from Email</span>
        </button>
      </div>

      {/* Sync Modal/Section */}
      {showManual && (
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <RefreshCcw className={isSyncing ? "animate-spin text-blue-600" : "text-blue-600"} size={20} />
              AI Smart Sync
            </h3>
            <button onClick={() => setShowManual(false)} className="text-slate-400 hover:text-slate-600">
              <Plus className="rotate-45" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">Paste the content of your bus ticket confirmation email below. Our AI will automatically extract the ticket count, date, and commission rate.</p>
          <textarea 
            className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm mb-4"
            placeholder="Example: Dear Agent, 5 tickets for the Morning Express have been issued for tomorrow's trip. Commission of 50 Taka per ticket will be credited..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button 
              onClick={handleSync}
              disabled={isSyncing || !emailInput.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              Process Content
            </button>
          </div>
          {syncStatus && (
            <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${syncStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {syncStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {syncStatus.msg}
            </div>
          )}
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Count</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Comm.</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Ticket size={48} className="mx-auto mb-4 opacity-20" />
                    No ticket records found. Use Smart Sync to add entries.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-slate-700">
                        <Calendar size={14} className="text-slate-400" />
                        {ticket.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">
                      {ticket.sourceEmailSubject || 'Manual Entry'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{ticket.count}</td>
                    <td className="px-6 py-4 text-slate-500">{CURRENCY}{ticket.rate}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">
                        {CURRENCY}{ticket.totalCommission}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDelete(ticket.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
