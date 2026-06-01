import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Building2, Users, Landmark, TrendingUp, Sparkles, Plus, 
  X, ShieldAlert, Award, FileSpreadsheet 
} from 'lucide-react';

export default function DepartmentManagement() {
  const { employees, departments, updateSettings } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    code: "",
    head: "",
    monthlyBudget: 150000,
    expenseRatio: 60
  });

  const [deptList, setDeptList] = useState(departments);

  const handleCreateDept = (e) => {
    e.preventDefault();
    const newDeptObj = {
      ...newDept,
      monthlyBudget: Number(newDept.monthlyBudget),
      headcount: 0
    };
    setDeptList([...deptList, newDeptObj]);
    setIsAddOpen(false);
    // Reset Form
    setNewDept({
      name: "",
      code: "",
      head: "",
      monthlyBudget: 150000,
      expenseRatio: 60
    });
  };

  // Calculations across departments
  const totalCorporateBudget = deptList.reduce((sum, d) => sum + d.monthlyBudget, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">ORGANIZATIONAL MATRIX</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Department Directory</h2>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="premium-button-primary flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Form New Department</span>
        </button>
      </div>

      {/* SUMMARY TOTALS */}
      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Building2 size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">Aggregate Department Count</span>
            <span className="text-lg font-bold dark:text-white mt-0.5">{deptList.length} Active Divisions</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Landmark size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold">Aggregate Allocated Budget Pool</span>
            <span className="text-lg font-bold dark:text-white mt-0.5">${(totalCorporateBudget / 1000).toFixed(1)}k / month</span>
          </div>
        </div>
      </div>

      {/* DEPARTMENTS CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deptList.map((dept, index) => {
          // Dynamic headcount calculation based on current employee database
          const actualHeadcount = employees.filter(emp => emp.department === dept.name).length;
          
          // Calculate estimated cost
          const estimatedCost = employees
            .filter(emp => emp.department === dept.name && emp.status === "Active")
            .reduce((sum, emp) => sum + (emp.baseSalary + emp.allowance - emp.deductions) / 12, 0);

          const costPercentage = (estimatedCost / (dept.monthlyBudget || 1)) * 100;
          
          return (
            <div 
              key={index}
              className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm glass-card-hover flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold dark:text-white">{dept.name}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Division Code: {dept.code}</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500">
                    <Building2 size={15} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold">EXECUTIVE HEAD</span>
                    <span className="font-semibold dark:text-white block mt-0.5 truncate">{dept.head || "Vacant"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold">ACTIVE HEADCOUNT</span>
                    <span className="font-semibold dark:text-white block mt-0.5">{actualHeadcount} employees</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                  <span>BUDGET UTILIZATION</span>
                  <span className={costPercentage > 85 ? 'text-rose-500 font-bold' : 'dark:text-zinc-300 font-bold'}>
                    ${estimatedCost.toLocaleString(undefined, {maximumFractionDigits: 0})} / ${(dept.monthlyBudget).toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden border border-zinc-200/20 dark:border-zinc-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      costPercentage > 85 ? 'bg-rose-500' : 'bg-indigo-600'
                    }`} 
                    style={{ width: `${Math.min(costPercentage, 100)}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* DEPARTMENT ADD MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 z-10 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold dark:text-white">Form New Corporate Department</span>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-950/40 text-zinc-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Department Name</label>
                <input 
                  type="text" 
                  value={newDept.name}
                  onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                  placeholder="e.g. Legal Compliance"
                  className="premium-input text-xs" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Division Code</label>
                  <input 
                    type="text" 
                    value={newDept.code}
                    onChange={(e) => setNewDept({...newDept, code: e.target.value})}
                    placeholder="e.g. LEG"
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Executive Head Manager</label>
                  <input 
                    type="text" 
                    value={newDept.head}
                    onChange={(e) => setNewDept({...newDept, head: e.target.value})}
                    placeholder="e.g. Rachel Adams"
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Monthly Operating Budget ($)</label>
                <input 
                  type="number" 
                  value={newDept.monthlyBudget}
                  onChange={(e) => setNewDept({...newDept, monthlyBudget: e.target.value})}
                  className="premium-input text-xs" 
                  required 
                />
              </div>

              <div className="flex gap-3 justify-end pt-6 border-t border-zinc-100 dark:border-zinc-900/60">
                <button 
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="py-2.5 px-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl text-xs transition-all border border-zinc-200 dark:border-zinc-800"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="premium-button-primary py-2.5 px-4 text-xs font-semibold"
                >
                  Deploy Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
