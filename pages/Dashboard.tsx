
import React, { useMemo } from 'react';
import { 
  TicketEntry, 
  ExpenseEntry 
} from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { TrendingUp, Wallet, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CURRENCY } from '../constants';

interface DashboardProps {
  tickets: TicketEntry[];
  expenses: ExpenseEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ tickets, expenses }) => {
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const todayTickets = tickets.filter(t => t.date === today);
    const todayComm = todayTickets.reduce((sum, t) => sum + t.totalCommission, 0);
    const todayCount = todayTickets.reduce((sum, t) => sum + t.count, 0);

    const totalComm = tickets.reduce((sum, t) => sum + t.totalCommission, 0);
    const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalComm - totalExp;

    return { todayComm, todayCount, totalComm, totalExp, netProfit };
  }, [tickets, expenses, today]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTickets = tickets.filter(t => t.date === date);
      const dayExpenses = expenses.filter(e => e.date === date);
      return {
        date,
        commission: dayTickets.reduce((sum, t) => sum + t.totalCommission, 0),
        expenses: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
      };
    });
  }, [tickets, expenses]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
          <p className="text-slate-500">Summary of tickets and finances for {today}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Sales" 
          value={stats.todayCount} 
          subtitle="Tickets Issued"
          icon={<ShoppingCart className="text-blue-600" size={24} />}
          color="bg-blue-50"
        />
        <StatCard 
          title="Today's Comm." 
          value={`${CURRENCY}${stats.todayComm}`} 
          subtitle="Real-time earnings"
          icon={<TrendingUp className="text-green-600" size={24} />}
          color="bg-green-50"
        />
        <StatCard 
          title="Monthly Expenses" 
          value={`${CURRENCY}${stats.totalExp}`} 
          subtitle="Total overhead"
          icon={<Wallet className="text-red-600" size={24} />}
          color="bg-red-50"
        />
        <StatCard 
          title="Net Profit" 
          value={`${CURRENCY}${stats.netProfit}`} 
          subtitle="After expenses"
          icon={<ArrowUpRight className="text-indigo-600" size={24} />}
          color="bg-indigo-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-700">Commission vs Expenses (Last 7 Days)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                />
                <Area type="monotone" dataKey="commission" stroke="#2563eb" fillOpacity={1} fill="url(#colorComm)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-700">Ticket Count Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="commission" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string | number, subtitle: string, icon: React.ReactNode, color: string }> = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
