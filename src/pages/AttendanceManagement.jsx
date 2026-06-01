import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Calendar, Clock, CheckCircle, AlertCircle, RefreshCw, 
  MapPin, ShieldCheck, ChevronLeft, ChevronRight, Laptop 
} from 'lucide-react';

export default function AttendanceManagement() {
  const { 
    employees, 
    clockInStatus, 
    clockInTime, 
    triggerClockIn, 
    triggerClockOut,
    attendanceToday
  } = useStore();

  const [currentMonth, setCurrentMonth] = useState("May 2026");

  // Simulated heatmap data for a team of 8 employees over the past 14 days
  const heatmapData = [
    { day: "May 1", present: 8, late: 0, absent: 0 },
    { day: "May 2", present: 7, late: 1, absent: 0 },
    { day: "May 3", present: 0, late: 0, absent: 0, isWeekend: true },
    { day: "May 4", present: 0, late: 0, absent: 0, isWeekend: true },
    { day: "May 5", present: 8, late: 0, absent: 0 },
    { day: "May 6", present: 6, late: 2, absent: 0 },
    { day: "May 7", present: 7, late: 0, absent: 1 },
    { day: "May 8", present: 8, late: 0, absent: 0 },
    { day: "May 9", present: 7, late: 1, absent: 0 },
    { day: "May 10", present: 0, late: 0, absent: 0, isWeekend: true },
    { day: "May 11", present: 0, late: 0, absent: 0, isWeekend: true },
    { day: "May 12", present: 8, late: 0, absent: 0 },
    { day: "May 13", present: 7, late: 0, absent: 1 },
    { day: "May 14", present: 6, late: 1, absent: 1 }
  ];

  // Active roster length
  const activeCount = employees.filter(e => e.status === "Active").length;

  const stats = [
    { title: "Monthly Attendance Rate", value: "96.4%", desc: "Healthy threshold", color: "text-emerald-500" },
    { title: "Average Shift Duration", value: "8.2h", desc: "Stable task velocity", color: "text-indigo-500" },
    { title: "Late Arrivals Logged", value: "5 incidents", desc: "Down 12% vs last month", color: "text-amber-500" },
    { title: "Active Leaves Today", value: "1 approved", desc: "Aisha R. (Vacation)", color: "text-blue-500" }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">SHIFT COMPLIANCE</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Attendance Tracker</h2>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm">
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 block">{stat.title}</span>
            <span className={`text-xl font-extrabold tracking-tight block mt-2 ${stat.color}`}>{stat.value}</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1 font-medium">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* DETAILED ATTENDANCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* HEATMAP CALENDAR (2/3 width) */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">SHIFT PRESENCE HEATMAP</span>
              <span className="text-base font-bold dark:text-white mt-0.5">Team Attendance Record</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400">
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-semibold dark:text-white">{currentMonth}</span>
              <button className="p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* COLOR LEGEND */}
          <div className="flex flex-wrap gap-4 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 pb-3 border-b border-zinc-100 dark:border-zinc-900/40">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-500/25 border border-emerald-500/40" />
              <span>Full Presence (8/8)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-500/25 border border-amber-500/40" />
              <span>Late Arrivals (1+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-rose-500/25 border border-rose-500/40" />
              <span>Absenteeism (1+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/25 dark:border-zinc-800" />
              <span>Weekend Shift Closed</span>
            </div>
          </div>

          {/* GRID CELLS */}
          <div className="grid grid-cols-7 gap-3">
            {/* Week Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase py-1">{d}</div>
            ))}

            {/* Empty boxes for calendar offset (May 2026 starts on Friday) */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`offset-${i}`} className="h-16 rounded-xl bg-transparent" />
            ))}

            {/* Heatmap days */}
            {Array.from({ length: 28 }).map((_, idx) => {
              const dayNum = idx + 1;
              const cell = heatmapData.find(h => h.day === `May ${dayNum}`);
              
              let cellColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
              let label = "Full Presence";

              if (cell) {
                if (cell.isWeekend) {
                  cellColor = "bg-zinc-100 dark:bg-zinc-950/20 border-zinc-200/50 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600";
                  label = "Weekend Off";
                } else if (cell.absent > 0) {
                  cellColor = "bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400";
                  label = `${cell.absent} Absent`;
                } else if (cell.late > 0) {
                  cellColor = "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400";
                  label = `${cell.late} Late`;
                }
              } else {
                // Future days
                cellColor = "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 opacity-40 text-zinc-400";
                label = "Future Shift";
              }

              return (
                <div 
                  key={idx} 
                  className={`h-16 rounded-xl border p-2 flex flex-col justify-between transition-all hover:scale-[1.03] cursor-pointer ${cellColor}`}
                >
                  <span className="text-[10px] font-bold">{dayNum}</span>
                  <span className="text-[8px] font-semibold truncate block opacity-95">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CLOCK INTERACTION WIDGET (1/3 width) */}
        <div className="space-y-6">
          
          {/* Active Shift Console */}
          <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold dark:text-white">Active Shift Console</span>
              <span className="text-[10px] py-0.5 px-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md font-semibold border border-indigo-100/20">Demo Desk</span>
            </div>
            
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-2xl text-center relative overflow-hidden">
              {clockInStatus === "in" && (
                <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-xs flex items-center justify-center animate-pulse-subtle" />
              )}
              <Clock size={36} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
              <div className="text-base font-extrabold dark:text-white relative z-10">
                {clockInStatus === "in" ? "Clocked In • Shift Active" : "Shift Terminated"}
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block mt-1.5 relative z-10">
                {clockInStatus === "in" 
                  ? `Authenticated at ${clockInTime}. Remotely monitoring.` 
                  : "Clock in to register attendance status."
                }
              </span>
            </div>

            <button 
              onClick={clockInStatus === "in" ? triggerClockOut : triggerClockIn}
              className={`w-full py-3 px-4 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-2 ${
                clockInStatus === "in"
                  ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {clockInStatus === "in" ? "Trigger Shift End" : "Submit Clock-in Punch"}
            </button>
          </div>

          {/* Shift punch logs */}
          <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm space-y-4">
            <span className="text-xs font-bold dark:text-white block">Recent Punch-in Logs</span>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-900">
                <div className="flex gap-2.5 items-center">
                  <MapPin size={14} className="text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold dark:text-white">Alex Thorne (Admin)</span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500">San Francisco, CA</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-zinc-400">9:02 AM</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-900">
                <div className="flex gap-2.5 items-center">
                  <Laptop size={14} className="text-zinc-400" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold dark:text-white">Sarah Jenkins</span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500">Remote VPN (London)</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-zinc-400">8:50 AM</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
