import React, { useState } from 'react';
import { useStore } from '../store';
import { Lock, Mail, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, setCurrentRoute } = useStore();
  const [email, setEmail] = useState("admin@payflow.com");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email.length > 3 && password.length > 3) {
        login(email, "password");
        setCurrentRoute("dashboard");
      } else {
        setError("Invalid credentials. Try using admin@payflow.com");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4 relative overflow-hidden bg-grid-pattern">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md z-10">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-600/30 mb-3">P</div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-sans">Welcome to PayFlow Pro</h2>
          <p className="text-xs text-zinc-500 mt-1">Enterprise Grade Human Resources & Payroll Platform</p>
        </div>

        {/* FORMS CONTAINER */}
        <div className="bg-white/90 border border-zinc-200/80 p-8 rounded-3xl shadow-xl shadow-indigo-600/5 backdrop-blur-md relative overflow-hidden">
          {/* Top colored indicator line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
          
          <div className="absolute top-3 right-3">
            <HelpCircle size={15} className="text-zinc-400 cursor-pointer hover:text-zinc-600" title="Need help? Email support@payflow.com" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 flex items-center gap-2 font-semibold">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-zinc-400" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50/50 border border-zinc-250 rounded-xl pl-11 pr-4 py-3.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-zinc-900 placeholder-zinc-400"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500">Workspace Password</label>
                <a href="#forgot" className="text-[10px] font-bold text-indigo-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-zinc-400" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50/50 border border-zinc-250 rounded-xl pl-11 pr-4 py-3.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-zinc-900 placeholder-zinc-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl py-3.5 text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin Workspace</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* SECURITY FOOTER INFO */}
          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center gap-2.5 text-[10px] text-zinc-400 font-semibold">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Secure encryption tunnel established.</span>
          </div>
        </div>

        {/* BOTTOM METADATA */}
        <div className="mt-8 text-center text-[10px] text-zinc-400 font-bold flex justify-center gap-6">
          <a href="#privacy" className="hover:text-zinc-650">Privacy Policy</a>
          <a href="#terms" className="hover:text-zinc-650">Terms of Service</a>
          <span>© 2026 PayFlow Pro Inc.</span>
        </div>
      </div>
    </div>
  );
}
