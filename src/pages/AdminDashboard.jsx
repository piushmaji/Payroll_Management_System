import React from 'react';
import { useStore } from '../store';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { 
  Users, DollarSign, Clock, CalendarDays, ArrowUpRight, ArrowDownRight, 
  TrendingUp, Building2, Briefcase, Plus, ShieldCheck, Landmark 
} from 'lucide-react';

export default function AdminDashboard() {
  const { 
    employees, 
    payrollRuns, 
    departments, 
    projects,
    clockInStatus,
    attendanceToday,
    setCurrentRoute,
    settings
  } = useStore();

  // Compute live KPIs
  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const inactiveEmployees = employees.filter(e => e.status === "Inactive").length;
  
  // Total running payroll costs
  const totalMonthlyCost = employees
    .filter(e => e.status === "Active")
    .reduce((sum, e) => sum + e.baseSalary + (e.allowance || 0) - (e.deductions || 0), 0);

  // Format payroll runs for charts (reversing to chronologically oldest to newest)
  const chartData = [...payrollRuns].reverse().map(run => ({
    name: run.month.split(' ')[0],
    expense: run.totalNet / 1000, // in thousands for clean Y-axis
    headcount: run.activeHeadcount
  }));

  // Add simulation data point if needed
  chartData.push({ name: "May", expense: totalMonthlyCost / 1000, headcount: activeEmployees });

  // Compute department counts
  const deptChartData = departments.map(d => ({
    name: d.name,
    budget: d.monthlyBudget / 1000,
    headcount: employees.filter(emp => emp.department === d.name).length
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  const kpis = [
    {
      title: "Active Headcount",
      value: activeEmployees,
      subtext: `${inactiveEmployees} in review/onboard`,
      change: "+12.4%",
      isPositive: true,
      icon: Users,
      shadowClass: "shadow-[0_10px_25px_rgba(99,102,241,0.06)] hover:shadow-[0_14px_30px_rgba(99,102,241,0.12)] border-indigo-100/70 bg-gradient-to-tr from-white to-indigo-50/5",
      topLineClass: "bg-indigo-500",
      iconClass: "text-indigo-600 bg-indigo-50/80 ring-4 ring-indigo-500/5",
      badgeClass: "text-indigo-700 bg-indigo-50"
    },
    {
      title: "Active Monthly Cost",
      value: `${settings.currency === 'INR' ? '₹' : settings.currency === 'USD' ? '$' : settings.currency}${(totalMonthlyCost / 1000).toFixed(1)}k`,
      subtext: "Includes standard benefits",
      change: "+8.2%",
      isPositive: true,
      icon: DollarSign,
      shadowClass: "shadow-[0_10px_25px_rgba(16,185,129,0.06)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.12)] border-emerald-100/70 bg-gradient-to-tr from-white to-emerald-50/5",
      topLineClass: "bg-emerald-500",
      iconClass: "text-emerald-600 bg-emerald-50/80 ring-4 ring-emerald-500/5",
      badgeClass: "text-emerald-700 bg-emerald-50"
    },
    {
      title: "Today's Presence",
      value: `${((attendanceToday.present / (activeEmployees || 1)) * 100).toFixed(0)}%`,
      subtext: `${attendanceToday.present} checked in today`,
      change: "-1.5%",
      isPositive: false,
      icon: Clock,
      shadowClass: "shadow-[0_10px_25px_rgba(245,158,11,0.06)] hover:shadow-[0_14px_30px_rgba(245,158,11,0.12)] border-amber-100/70 bg-gradient-to-tr from-white to-amber-50/5",
      topLineClass: "bg-amber-500",
      iconClass: "text-amber-600 bg-amber-50/80 ring-4 ring-amber-500/5",
      badgeClass: "text-amber-700 bg-amber-50"
    },
    {
      title: "Current Payroll Status",
      value: "May (Open)",
      subtext: "Auto-runs in 9 days",
      change: "Auto",
      isPositive: true,
      icon: CalendarDays,
      shadowClass: "shadow-[0_10px_25px_rgba(236,72,153,0.06)] hover:shadow-[0_14px_30px_rgba(236,72,153,0.12)] border-pink-100/70 bg-gradient-to-tr from-white to-pink-50/5",
      topLineClass: "bg-pink-500",
      iconClass: "text-pink-600 bg-pink-50/80 ring-4 ring-pink-500/5",
      badgeClass: "text-pink-700 bg-pink-50"
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* HERO BANNER SECTION */}
      <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-850 text-white shadow-xl shadow-indigo-600/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-xl text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-wider uppercase mb-4 border border-white/10">
            <ShieldCheck size={12} />
            <span>Authorized Enterprise Console</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome back, Alex. Your workspace is healthy.
          </h2>
          <p className="text-xs text-indigo-100/90 mt-3 leading-relaxed max-w-lg">
            All employee banking profiles have been audited for the May payroll period. Tax distributions, allowance structures, and social insurance deductions are fully synchronized with your database pipeline.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={() => setCurrentRoute("payslips")} 
              className="py-2.5 px-4 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs transition-all shadow-md shadow-black/5 flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Simulate Pay Run</span>
            </button>
            <button 
              onClick={() => setCurrentRoute("employees")}
              className="py-2.5 px-4 bg-indigo-550 hover:bg-indigo-500/60 border border-white/20 text-white font-bold rounded-xl text-xs transition-all"
            >
              Manage Employees
            </button>
          </div>
        </div>

        {/* Dynamic Status Card in Banner */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl w-full lg:w-80 shrink-0 text-left relative z-10 shadow-lg">
          <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest block">PIPELINE INTEGRATION</span>
          <div className="flex items-center justify-between mt-2 pb-3 border-b border-white/10">
            <span className="text-sm font-extrabold">Supabase SQL</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              settings.supabaseUrl && settings.supabaseKey
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {settings.supabaseUrl && settings.supabaseKey ? 'CONNECTED' : 'OFFLINE MODE'}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[9px] text-indigo-200 block font-semibold">DIVISIONS LOGGED</span>
              <span className="font-extrabold text-white block mt-0.5 text-sm">{departments.length} Departments</span>
            </div>
            <div>
              <span className="text-[9px] text-indigo-200 block font-semibold">CONTRACT PROJECTS</span>
              <span className="font-extrabold text-white block mt-0.5 text-sm">{projects.length} Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`relative overflow-hidden flex flex-col justify-between min-h-[145px] p-5 rounded-2xl border bg-white ${kpi.shadowClass} transform hover:-translate-y-1.5 transition-all duration-300`}
            >
              {/* Colored top line indicator */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${kpi.topLineClass}`} />
              
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{kpi.title}</span>
                  <span className="text-2xl font-extrabold tracking-tight text-zinc-950 mt-1">{kpi.value}</span>
                </div>
                <div className={`p-2.5 rounded-xl shrink-0 ${kpi.iconClass}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100/80 pt-3 mt-4">
                <span className="text-[10px] text-zinc-400 font-medium">{kpi.subtext}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  kpi.isPositive 
                    ? 'text-emerald-700 bg-emerald-50/80' 
                    : 'text-rose-700 bg-rose-50/80'
                }`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART: MONTHLY EXPENSES (2/3 width) */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">PAYROLL DISTRIBUTION RECONCILIATION</span>
              <span className="text-base font-bold dark:text-white mt-0.5">Total Payroll Disbursements (₹)</span>
            </div>
            <div className="flex items-center gap-1.5 py-1 px-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
              <TrendingUp size={11} className="text-indigo-500" />
              <span>Scale: Thousands (k)</span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/60" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                    borderColor: 'rgba(63, 63, 70, 0.5)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    padding: '8px 12px'
                  }} 
                  labelStyle={{ color: '#a1a1aa', fontWeight: '600' }}
                  itemStyle={{ color: '#ffffff' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="expense" name="Expense (₹k)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART: BUDGET PER DEPARTMENT (1/3 width) */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">BUDGET TRACKER</span>
            <span className="text-base font-bold dark:text-white mt-0.5">Department Allocations</span>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/60" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                    borderColor: 'rgba(63, 63, 70, 0.5)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    padding: '8px 12px'
                  }} 
                  labelStyle={{ color: '#a1a1aa', fontWeight: '600' }}
                  itemStyle={{ color: '#ffffff' }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: [6, 6, 0, 0] }}
                />
                <Bar 
                  dataKey="budget" 
                  name="Budget (₹k)" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={400}
                  animationEasing="ease-out"
                  activeBar={{ fillOpacity: 0.8, stroke: '#6366f1', strokeWidth: 1 }}
                >
                  {deptChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RECENT WORKSPACE ACTIVITY & EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RECENT ACTIVITY LOGS */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold dark:text-white">Recent Core Actions</span>
            <button onClick={() => setCurrentRoute("analytics")} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">View reports →</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start justify-between p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/40">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">PAY</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold dark:text-white">April Payroll Completed</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">8 employees successfully remitted via Chase direct integration.</span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">Apr 28, 2026</span>
            </div>

            <div className="flex items-start justify-between p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/40">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">ADD</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold dark:text-white">New Hires Onboarding</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Naomi Watts added to Human Resources as Talent Recruiter.</span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">Jan 15, 2026</span>
            </div>

            <div className="flex items-start justify-between p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/40">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">SYS</div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold dark:text-white">Tax Code Updates Applied</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">State and Federal compliance formulas updated for FY2026 runs.</span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">Dec 18, 2025</span>
            </div>
          </div>
        </div>

        {/* WORKSPACE STATS / QUICK EVENT CALENDAR */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
          <span className="text-sm font-bold dark:text-white block">Key Milestones</span>
          <div className="space-y-4">
            
            <div className="flex gap-3 relative pb-4 after:absolute after:left-[9px] after:top-6 after:bottom-0 after:w-0.5 after:bg-zinc-200 dark:after:bg-zinc-800">
              <div className="h-5 w-5 rounded-full bg-indigo-500/20 border-2 border-indigo-500 shrink-0 flex items-center justify-center z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold dark:text-white">May Payroll Simulation</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Compute allowances and performance bonuses before lock date.</span>
                <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 mt-1">MAY 21, 2026</span>
              </div>
            </div>

            <div className="flex gap-3 relative pb-4 after:absolute after:left-[9px] after:top-6 after:bottom-0 after:w-0.5 after:bg-zinc-200 dark:after:bg-zinc-800">
              <div className="h-5 w-5 rounded-full bg-emerald-500/20 border-2 border-emerald-500 shrink-0 flex items-center justify-center z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold dark:text-white">Compliance Declarations</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Automated tax filings dispatched to local agencies.</span>
                <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 mt-1">MAY 25, 2026</span>
              </div>
            </div>

            <div className="flex gap-3 relative">
              <div className="h-5 w-5 rounded-full bg-amber-500/20 border-2 border-amber-500 shrink-0 flex items-center justify-center z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold dark:text-white">Automatic Pay Remittances</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Direct ACH bank routing triggered at midnight.</span>
                <span className="text-[9px] font-bold text-amber-500 dark:text-amber-400 mt-1">MAY 28, 2026</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
