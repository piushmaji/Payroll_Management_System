import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend, Cell, PieChart, Pie
} from 'recharts';
import { 
  BarChart3, Landmark, TrendingUp, Users, CalendarCheck, 
  HelpCircle, ArrowUpRight, ArrowDownRight, Sparkles 
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const { employees, payrollRuns, departments } = useStore();

  // Preloaded data matching database
  const monthlyExpenseData = [...payrollRuns].reverse().map(run => ({
    month: run.month.split(' ')[0],
    payout: run.totalNet / 1000,
    headcount: run.activeHeadcount
  }));

  // May simulated live values
  const activeEmployees = employees.filter(e => e.status === "Active");
  const liveCost = activeEmployees.reduce((sum, e) => sum + e.baseSalary + (e.allowance || 0) - (e.deductions || 0), 0);
  monthlyExpenseData.push({ month: "May", payout: liveCost / 1000, headcount: activeEmployees.length });

  // Attendance metrics
  const attendanceMetrics = [
    { day: "May 1", present: 98, late: 2, absent: 0 },
    { day: "May 5", present: 96, late: 4, absent: 0 },
    { day: "May 6", present: 90, late: 10, absent: 0 },
    { day: "May 7", present: 92, late: 2, absent: 6 },
    { day: "May 8", present: 98, late: 0, absent: 2 },
    { day: "May 12", present: 96, late: 4, absent: 0 },
    { day: "May 13", present: 92, late: 2, absent: 6 },
    { day: "May 14", present: 88, late: 6, absent: 6 }
  ];

  // Headcount Pie distribution
  const pieData = departments.map(d => ({
    name: d.name,
    value: employees.filter(emp => emp.department === d.name).length
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  const stats = [
    { title: "Average Base Wage Pool", value: "$122,875/yr", desc: "+3.2% vs national average", color: "text-indigo-500" },
    { title: "Tax Remittances (YTD)", value: "$68,402", desc: "100% IRS clearance score", color: "text-emerald-500" },
    { title: "Total Benefits Managed", value: "$42,900/mo", desc: "Health, 401k, Pf funds", color: "text-pink-500" }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">COMPILATION & INTELLIGENCE</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Workspace Analytics</h2>
        </div>
      </div>

      {/* QUICK STATUS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm">
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 block">{stat.title}</span>
            <span className={`text-lg font-extrabold mt-2 block ${stat.color}`}>{stat.value}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-medium block">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* RECHARTS PLOTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* AREA: PAYROLL RUNS */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">FISCAL EXPENDITURE CHART</span>
            <span className="text-sm font-bold dark:text-white mt-0.5">Aggregate Payout Trends ($k)</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyExpenseData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPayout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/60" />
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                    borderColor: 'rgba(63, 63, 70, 0.5)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
                <Area type="monotone" dataKey="payout" name="Disbursements" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPayout)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE: ATTENDANCE RATIOS */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">SHIFT CONSISTENCY RATIO</span>
            <span className="text-sm font-bold dark:text-white mt-0.5">Team Attendance Fluctuations (%)</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceMetrics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800/60" />
                <XAxis dataKey="day" stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
                <Line type="monotone" dataKey="present" name="Present %" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="late" name="Late %" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* DEPARTMENT STATS GRID TABLES */}
      <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
        <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Financial Performance Ledger</span>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-900 pb-3 font-semibold text-zinc-400 dark:text-zinc-500">
                <th className="pb-3">Department Division</th>
                <th className="pb-3">Allocated Budget</th>
                <th className="pb-3">Simulated Spending</th>
                <th className="pb-3">Division Head</th>
                <th className="pb-3 text-right">Fulfillment Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/40">
              {departments.map((dept, index) => {
                // Dynamic spending calculation based on current employee roster
                const actualCost = employees
                  .filter(emp => emp.department === dept.name && emp.status === "Active")
                  .reduce((sum, emp) => sum + (emp.baseSalary + emp.allowance - emp.deductions) / 12, 0);

                return (
                  <tr key={index} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-all">
                    <td className="py-3.5 font-bold dark:text-white">{dept.name}</td>
                    <td className="py-3.5 dark:text-zinc-300">${dept.monthlyBudget.toLocaleString()}</td>
                    <td className="py-3.5 dark:text-zinc-300">${actualCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                    <td className="py-3.5 dark:text-zinc-300">{dept.head}</td>
                    <td className="py-3.5 text-right font-bold text-emerald-500">100% Compliant</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
