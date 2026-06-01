import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Settings, Landmark, HelpCircle, ShieldCheck, Database, 
  Moon, Sun, CheckCircle, RefreshCcw, Key 
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, darkMode, toggleDarkMode } = useStore();
  
  // Local form state
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [companyEmail, setCompanyEmail] = useState(settings.companyEmail);
  const [baseTaxRate, setBaseTaxRate] = useState(settings.baseTaxRate);
  const [pfContribution, setPfContribution] = useState(settings.pfContribution);
  const [currency, setCurrency] = useState(settings.currency);

  const [toastMsg, setToastMsg] = useState("");

  // Supabase configs
  const [dbURL, setDbURL] = useState(settings.supabaseUrl || "");
  const [dbKey, setDbKey] = useState(settings.supabaseKey || "");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings({
      companyName,
      companyEmail,
      baseTaxRate: Number(baseTaxRate),
      pfContribution: Number(pfContribution),
      currency
    });
    setToastMsg("Workspace tax models and identifiers updated successfully!");
    setTimeout(() => setToastMsg(""), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">SYSTEM CONFIGURATIONS</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Workspace Settings</h2>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 flex items-center gap-2.5 animate-fade-in shadow-sm shadow-emerald-500/5">
          <CheckCircle size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COMPLIANCE & PARAMETER FORM (2/3 width) */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-900/60">
            <Settings size={18} className="text-indigo-500" />
            <span className="text-sm font-bold dark:text-white">General Compliance Parameters</span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Registered Business Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="premium-input text-xs" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Core Support Email</label>
                <input 
                  type="email" 
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="premium-input text-xs" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Base Tax Withholding (%)</label>
                <input 
                  type="number" 
                  value={baseTaxRate}
                  onChange={(e) => setBaseTaxRate(e.target.value)}
                  className="premium-input text-xs" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">PF Pension Contribution (%)</label>
                <input 
                  type="number" 
                  value={pfContribution}
                  onChange={(e) => setPfContribution(e.target.value)}
                  className="premium-input text-xs" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Currency Standard</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-800 dark:text-white cursor-pointer"
                >
                  <option value="USD">USD ($) - United States</option>
                  <option value="EUR">EUR (€) - European Union</option>
                  <option value="INR">INR (₹) - India</option>
                  <option value="GBP">GBP (£) - United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
              <button 
                type="submit"
                className="premium-button-primary py-2.5 px-5 text-xs font-semibold"
              >
                Save Compliance Configs
              </button>
            </div>
          </form>
        </div>

        {/* SIDE BAR: SYSTEMS CONFIG & SUPABASE SETUP */}
        <div className="space-y-6">

          {/* Supabase integration credentials */}
          <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5">
              <Database size={15} className="text-zinc-400" />
              <span className="text-xs font-bold dark:text-white">Supabase Integration Pipeline</span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 block">SUPABASE ENDPOINT API URL</span>
                <input 
                  type="text" 
                  value={dbURL}
                  onChange={(e) => setDbURL(e.target.value)}
                  className="w-full bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] dark:text-zinc-300 font-semibold focus:outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-400 dark:text-zinc-500">
                  <span>SUPABASE ANNON KEY IDENTIFIER</span>
                  <Key size={10} />
                </div>
                <input 
                  type="password" 
                  value={dbKey}
                  onChange={(e) => setDbKey(e.target.value)}
                  className="w-full bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] dark:text-zinc-300 font-semibold focus:outline-none focus:border-indigo-500" 
                />
              </div>
            </div>

            <button
              onClick={() => {
                updateSettings({ supabaseUrl: dbURL, supabaseKey: dbKey });
                setToastMsg("Supabase credentials saved! Syncing tables...");
                setTimeout(() => setToastMsg(""), 3500);
              }}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-all border border-zinc-700 mt-2"
            >
              Connect Supabase Pipeline
            </button>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-900 flex items-center gap-2 text-[9px] text-zinc-400 dark:text-zinc-500 justify-between">
              <div className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>Real-time channel active.</span>
              </div>
              <span className="text-[8px] font-bold text-zinc-500 uppercase">
                {settings.supabaseUrl && settings.supabaseKey ? 'CONNECTED' : 'OFFLINE MODE'}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
