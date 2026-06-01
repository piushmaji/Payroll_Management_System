import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { 
  FileSpreadsheet, ArrowRight, Download, Receipt, Landmark, 
  User, CheckCircle, Calculator, Info, ShieldAlert, Sparkles 
} from 'lucide-react';

export default function PayslipGeneration() {
  const { employees, settings } = useStore();
  
  // Selected state
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [allowancesInput, setAllowancesInput] = useState(0);
  const [bonusesInput, setBonusesInput] = useState(0);
  const [deductionsInput, setDeductionsInput] = useState(0);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Sync initial dropdown selection
  useEffect(() => {
    if (employees.length > 0 && !selectedEmpId) {
      setSelectedEmpId(employees[0].id);
    }
  }, [employees]);

  // Find active employee record
  const employee = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Sync state variables when employee changes
  useEffect(() => {
    if (employee) {
      setAllowancesInput(employee.allowance);
      setDeductionsInput(employee.deductions);
      setBonusesInput(0); // reset performance bonus
    }
  }, [employee]);

  if (!employee) {
    return <div className="py-12 text-center text-xs text-zinc-500">Loading payroll database logs...</div>;
  }

  // Calculations
  const baseSalaryMonthly = employee.baseSalary / 12;
  const allowancesMonthly = allowancesInput / 12;
  const bonusesMonthly = bonusesInput;
  const grossPayMonthly = baseSalaryMonthly + allowancesMonthly + bonusesMonthly;
  
  const taxDeductionMonthly = grossPayMonthly * (settings.baseTaxRate / 100);
  const pensionFundMonthly = baseSalaryMonthly * (settings.pfContribution / 100);
  const customDeductionsMonthly = deductionsInput / 12;
  const totalDeductionsMonthly = taxDeductionMonthly + pensionFundMonthly + customDeductionsMonthly;
  
  const netSalaryMonthly = grossPayMonthly - totalDeductionsMonthly;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setSuccessToast(`Payslip PDF compiled and downloaded for ${employee.name}!`);
      setTimeout(() => setSuccessToast(""), 4500);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">COMPLIANCE REPORTING</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Payslip Generator</h2>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 flex items-center gap-2.5 animate-fade-in shadow-sm shadow-emerald-500/5">
          <CheckCircle size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* CORE WRAPPER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* INPUT FORM PANEL (2/5 columns) */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-900/60">
              <Calculator className="text-indigo-500" size={17} />
              <span className="text-sm font-bold dark:text-white">Remittance Configurator</span>
            </div>

            {/* Target Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Target Employee Record</label>
              <select 
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs dark:text-white cursor-pointer"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                ))}
              </select>
            </div>

            {/* Base Pay Log */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-900 rounded-xl flex justify-between items-center text-xs">
              <span className="text-zinc-400 dark:text-zinc-500">Base Salary (Gross / Yr)</span>
              <span className="font-bold dark:text-white">₹{employee.baseSalary.toLocaleString()}</span>
            </div>

            {/* Adjusted Allowances */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Adjust Annual Allowance Additions (₹)</label>
              <input 
                type="number" 
                value={allowancesInput}
                onChange={(e) => setAllowancesInput(Number(e.target.value))}
                className="premium-input text-xs"
              />
            </div>

            {/* Month-Specific Bonus */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Performance Bonuses (₹ / Month)</label>
                <span className="text-[9px] font-semibold text-emerald-500 flex items-center gap-0.5">
                  <Sparkles size={9} />
                  <span>One-time addition</span>
                </span>
              </div>
              <input 
                type="number" 
                value={bonusesInput}
                onChange={(e) => setBonusesInput(Number(e.target.value))}
                className="premium-input text-xs"
                placeholder="e.g. 1500"
              />
            </div>

            {/* Adjusted Deductions */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Adjust Custom Deductibles (₹ / Yr)</label>
              <input 
                type="number" 
                value={deductionsInput}
                onChange={(e) => setDeductionsInput(Number(e.target.value))}
                className="premium-input text-xs"
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full premium-button-primary py-3 flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-indigo-600/10"
            >
              {isDownloading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Download size={14} />
                  <span>Download Signed PDF Payslip</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PAYSLIP TEMPLATE DISPLAY (3/5 columns) */}
        <div className="lg:col-span-3 space-y-4">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Remittance Audit Card</span>
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-premium text-zinc-800 dark:text-zinc-200 relative overflow-hidden font-sans">
            
            {/* Watermark/Stamp overlay */}
            <div className="absolute right-6 top-24 border-3 border-emerald-500/20 text-emerald-500/25 dark:text-emerald-400/10 rounded-xl px-4 py-2 font-bold tracking-widest text-lg font-mono rotate-12 uppercase pointer-events-none select-none">
              Verified & Paid
            </div>

            {/* Corporate Header */}
            <div className="flex justify-between items-start gap-4 pb-6 border-b border-zinc-200/50 dark:border-zinc-800">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">{settings.companyName}</span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">100 Pine Street, San Francisco, CA</span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold">{settings.companyEmail}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold dark:text-white">REMITTANCE STATEMENT</span>
                <span className="text-[10px] text-zinc-400 mt-1 font-semibold">May 2026 Run</span>
              </div>
            </div>

            {/* Employee Metadata Roster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-zinc-200/50 dark:border-zinc-800 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              <div>
                <span>EMPLOYEE NAME:</span>
                <span className="block text-xs font-bold text-zinc-800 dark:text-white mt-1">{employee.name}</span>
              </div>
              <div>
                <span>EMPLOYEE REG ID:</span>
                <span className="block text-xs font-bold text-zinc-800 dark:text-white mt-1">{employee.id}</span>
              </div>
              <div>
                <span>JOB DESIGNATION:</span>
                <span className="block text-xs font-bold text-zinc-800 dark:text-white mt-1 truncate">{employee.role}</span>
              </div>
              <div>
                <span>DEPARTMENT:</span>
                <span className="block text-xs font-bold text-zinc-800 dark:text-white mt-1">{employee.department}</span>
              </div>
            </div>

            {/* ITEMIZED PAYSLIP STATEMENT */}
            <div className="py-6 space-y-6 text-xs border-b border-zinc-200/50 dark:border-zinc-800">
              
              {/* Earnings Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <span>Gross Earnings</span>
                  <span>Amount ({settings.currency})</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-400">Basic Monthly Allocation</span>
                    <span className="font-bold dark:text-white">₹{baseSalaryMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </div>
                  {allowancesInput > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 dark:text-zinc-400">Monthly Compensation Allowance</span>
                      <span className="font-bold dark:text-white">₹{allowancesMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                  {bonusesMonthly > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 dark:text-zinc-400">Performance Bonuses Additions</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{bonusesMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Deductions Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  <span>Standard Deductions</span>
                  <span>Amount ({settings.currency})</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-400">Federal/State Tax Withholding ({settings.baseTaxRate}%)</span>
                    <span className="font-bold text-rose-500">-₹{taxDeductionMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-400">Provident Social Pension Fund ({settings.pfContribution}%)</span>
                    <span className="font-bold text-rose-500">-₹{pensionFundMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </div>
                  {customDeductionsMonthly > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 dark:text-zinc-400">Custom Deductibles</span>
                      <span className="font-bold text-rose-500">-₹{customDeductionsMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* SUMMARY BAR */}
            <div className="pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Landmark size={18} className="text-zinc-400" />
                <div className="flex flex-col text-[10px] font-semibold text-zinc-400">
                  <span>DISBURSED VIA Chase DIRECT</span>
                  <span className="dark:text-zinc-300 font-bold">{employee.bankName} • Account {employee.bankAccount}</span>
                </div>
              </div>

              <div className="flex flex-col text-right w-full sm:w-auto">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Net Salary Remitted</span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                  ₹{netSalaryMonthly.toLocaleString(undefined, {maximumFractionDigits: 2})} {settings.currency}
                </span>
              </div>
            </div>

            {/* Bottom Audited Advice */}
            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-2 text-[9px] text-zinc-400 dark:text-zinc-500">
              <Receipt size={12} />
              <span>This is a digitally compiled and certified statement. No physical signature is required.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
