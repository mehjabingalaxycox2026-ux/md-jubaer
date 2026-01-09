
import React, { useState } from 'react';
import { ShoppingCart, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(email);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 mb-6 animate-bounce">
            <ShoppingCart size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{APP_NAME}</h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise Ticket & Commission Manager</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500">Please sign in to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@buscompany.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Enter Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-blue-600 transition-colors">Forgot your password?</a>
          </div>
        </div>

        <div className="text-center mt-8 text-slate-400 text-xs font-medium">
          &copy; 2024 BusTicket Pro Systems. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
