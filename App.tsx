
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  ReceiptIndianRupee, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  RefreshCcw,
  TrendingUp,
  Users,
  Wallet,
  Calendar
} from 'lucide-react';
import { TicketEntry, ExpenseEntry, ViewState, User, DailyReport } from './types';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Login from './pages/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tickets, setTickets] = useState<TicketEntry[]>(() => {
    const saved = localStorage.getItem('bt_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() => {
    const saved = localStorage.getItem('bt_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistent Storage Sync
  useEffect(() => {
    localStorage.setItem('bt_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('bt_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('bt_user');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  const addTicket = (entry: Omit<TicketEntry, 'id' | 'timestamp' | 'totalCommission'>) => {
    const newEntry: TicketEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      totalCommission: entry.count * entry.rate
    };
    setTickets(prev => [newEntry, ...prev]);
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const addExpense = (entry: Omit<ExpenseEntry, 'id'>) => {
    const newEntry: ExpenseEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9)
    };
    setExpenses(prev => [newEntry, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  if (!user) {
    return <Login onLogin={(email) => setUser({ email, isLoggedIn: true })} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex bg-slate-50">
        {/* Sidebar */}
        <Sidebar onLogout={handleLogout} />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <h1 className="text-xl font-semibold text-slate-800">
              BusTicket Pro
            </h1>
            <div className="flex items-center gap-4">
               <span className="text-sm text-slate-500 hidden md:inline">{user.email}</span>
               <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                title="Logout"
               >
                 <LogOut size={20} />
               </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard tickets={tickets} expenses={expenses} />} />
              <Route path="/tickets" element={<Tickets tickets={tickets} onAdd={addTicket} onDelete={deleteTicket} />} />
              <Route path="/expenses" element={<Expenses expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />} />
              <Route path="/reports" element={<Reports tickets={tickets} expenses={expenses} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Tickets', icon: Ticket, path: '/tickets' },
    { name: 'Expenses', icon: ReceiptIndianRupee, path: '/expenses' },
    { name: 'Reports', icon: FileText, path: '/reports' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">CounterSys</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default App;
