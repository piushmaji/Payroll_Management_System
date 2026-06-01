import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  CreditCard, DollarSign, CalendarCheck, HelpCircle, ArrowUpRight, 
  History, ArrowRight, CheckCircle2, ChevronRight, Calculator, RefreshCcw 
} from 'lucide-react';

export default function PayrollDashboard() {
  const { 
    employees, 
    payrollRuns, 
    runPayrollSimulation, 
    settings 
  } = useStore();

  const [selectedMonth, setSelectedMonth] = useState("May 2026");
  const [taxRateInput, setTaxRateInput] = useState(settings.baseTaxRate);
  const [successMsg, setSuccessMsg] = useState("");

  // Calculate live values based on CURRENT active employees
  const activeList = employees.filter(e => e.status === "Active");
  
  const baseSalaryTotal = activeList.reduce((sum, e) => sum + e.baseSalary, 0);
  const allowanceTotal = activeList.reduce((sum, e) => sum + (e.allowance || 0), 0);
  const deductionsTotal = activeList.reduce((sum, e) => sum + (e.deductions || 0), 0);
  
  // Adjusted deductions based on user slider input
  const adjustedDeductions = deductionsTotal * (taxRateInput / settings.baseTaxRate);
  const netSalaryTotal = (baseSalaryTotal + allowanceTotal) - adjustedDeductions;

  const handleRunPayroll = () => {
    // Check if month already processed
    const alreadyProcessed = payrollRuns.some(run => run.month.toLowerCase() === selectedMonth.toLowerCase());
    if (alreadyProcessed) {
      alert(`Payroll for ${selectedMonth} is already processed.`);
      return;
    }

    runPayrollSimulation(selectedMonth);
    setSuccessMsg(`Remittance for ${selectedMonth} processed and dispatched to Chase Clearing!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const overviewCards = [
    { title: "Base Pay Pool", value: baseSalaryTotal, type: "base" },
    { title: "Variable Allowance", value: allowanceTotal, type: "allowance" },
    { title: "Compliance Deductions", value: adjustedDeductions, type: "deductions" },
    { title: "Net remitted Pay", value: netSalaryTotal, type: "net" }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">COMPENSATIONS DISBURSEMENT</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Payroll Operations</h2>
        </div>
      </div>

      {/* OVERVIEW BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {overviewCards.map((card, idx) => {
          const isDeduction = card.type === "deductions";
          const isNet = card.type === "net";
          return (
            <div key={idx} className="glass-card rounded-2xl p-5 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm relative overflow-hidden">
              <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 block">{card.title}</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`text-2xl font-extrabold tracking-tight ${isNet ? 'text-indigo-600 dark:text-indigo-400' : isDeduction ? 'text-rose-500' : 'dark:text-white'}`}>
                  ₹{(card.value / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">/{settings.currency}</span>
              </div>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-1">Based on {activeList.length} active employee files</span>
            </div>
          );
        })}
      </div>

      {/* SUCCESS POPUP BANNER */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 flex items-center gap-2.5 animate-fade-in shadow-sm shadow-emerald-500/5">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* DYNAMIC CALCULATOR & RUN CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RUN CONSOLE (2/3 width) */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm lg:col-span-2 space-y-5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">PAYROLL DEPLOYMENT CENTER</span>
            <span className="text-base font-bold dark:text-white mt-0.5">Execute Direct Deposit Run</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-900/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Target Settlement Period</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs dark:text-white cursor-pointer"
                >
                  <option value="May 2026">May 2026 (Active Run)</option>
                  <option value="June 2026">June 2026</option>
                  <option value="July 2026">July 2026</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                  <label>Adjust Tax Withholding Rate</label>
                  <span className="font-bold text-indigo-500">{taxRateInput}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30"
                  value={taxRateInput}
                  onChange={(e) => setTaxRateInput(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-300 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2" 
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200/50 dark:border-zinc-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 font-semibold">
                <Calculator size={13} />
                <span>Simulated payout size:</span>
              </div>
              <span className="font-extrabold text-zinc-900 dark:text-white">₹{netSalaryTotal.toLocaleString()} {settings.currency}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button 
              onClick={() => { setTaxRateInput(settings.baseTaxRate); }}
              className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl text-xs transition-all"
            >
              Reset parameters
            </button>
            <button 
              onClick={handleRunPayroll}
              className="premium-button-primary py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Process & Transmit Payout</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* PAYROLL SETTLEMENT RUN HISTORY TIMELINE */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5">
            <History size={16} className="text-zinc-400" />
            <span className="text-sm font-bold dark:text-white">Remittance Timeline</span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-64 pr-1">
            {payrollRuns.map((run) => (
              <div 
                key={run.id}
                className="p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-900 flex flex-col gap-2 transition-all hover:border-zinc-300 dark:hover:border-zinc-800"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold dark:text-white">{run.month}</span>
                  <span className="text-[10px] font-bold py-0.5 px-2 bg-emerald-500/10 text-emerald-500 rounded-md">
                    {run.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500">
                  <span>Remitted sum:</span>
                  <span className="font-bold dark:text-zinc-300">₹{run.totalNet.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[9px] text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-1.5 mt-0.5">
                  <span>DISBURSED {run.runDate}</span>
                  <span className="font-semibold text-zinc-400">Headcount: {run.activeHeadcount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
