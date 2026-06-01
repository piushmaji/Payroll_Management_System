import React, { useState } from 'react';
import { useStore } from '../store';
import { Briefcase, Users, Clock, Landmark, Plus, X, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ProjectAssignment() {
  const { projects, employees, departments } = useStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [projList, setProjList] = useState(projects);
  const [newProj, setNewProj] = useState({
    name: "",
    department: "Engineering",
    teamSize: 2,
    budget: 80000,
    hoursLogged: 0,
    status: "On Track"
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    const newProjObj = {
      ...newProj,
      id: `PRJ-${newProj.name.substring(0, 4).toUpperCase()}`,
      teamSize: Number(newProj.teamSize),
      budget: Number(newProj.budget),
      hoursLogged: Number(newProj.hoursLogged)
    };
    setProjList([...projList, newProjObj]);
    setIsAddOpen(false);
    // Reset Form
    setNewProj({
      name: "",
      department: "Engineering",
      teamSize: 2,
      budget: 80000,
      hoursLogged: 0,
      status: "On Track"
    });
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">PROJECT ALLOCATIONS</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Project Assignments</h2>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="premium-button-primary flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Launch New Project</span>
        </button>
      </div>

      {/* PROJECTS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projList.map((proj) => {
          const isCaution = proj.status === "Caution";
          const statusColor = isCaution 
            ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' 
            : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
          
          return (
            <div 
              key={proj.id}
              className={`glass-card rounded-2xl p-6 border shadow-sm transition-all hover:shadow-premium-hover flex flex-col justify-between min-h-[220px] ${
                isCaution ? 'border-amber-500/30' : 'border-zinc-200/50 dark:border-zinc-900/60'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{proj.id}</span>
                    <span className="text-sm font-extrabold dark:text-white mt-0.5">{proj.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                    {proj.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-xl flex items-center gap-2">
                    <Users size={14} className="text-indigo-500" />
                    <div>
                      <span>TEAM SIZE</span>
                      <span className="block text-xs font-bold text-zinc-800 dark:text-white mt-0.5">{proj.teamSize} Head</span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-xl flex items-center gap-2">
                    <Clock size={14} className="text-indigo-500" />
                    <div>
                      <span>HOURS LOGGED</span>
                      <span className="block text-xs font-bold text-zinc-800 dark:text-white mt-0.5">{proj.hoursLogged} hrs</span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-xl flex items-center gap-2">
                    <Landmark size={14} className="text-indigo-500" />
                    <div>
                      <span>BUDGET</span>
                      <span className="block text-xs font-bold text-zinc-800 dark:text-white mt-0.5">₹{(proj.budget / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 flex justify-between items-center text-xs">
                <span className="text-zinc-400 dark:text-zinc-500 font-semibold">Division in charge:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-100/20">{proj.department}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW PROJECT ADD MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 z-10 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold dark:text-white">Launch New Project Allocation</span>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-950/40 text-zinc-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Project Initiative Name</label>
                <input 
                  type="text" 
                  value={newProj.name}
                  onChange={(e) => setNewProj({...newProj, name: e.target.value})}
                  placeholder="e.g. AWS Cloud Re-architect"
                  className="premium-input text-xs" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Allocated Department</label>
                  <select 
                    value={newProj.department}
                    onChange={(e) => setNewProj({...newProj, department: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-800 dark:text-white cursor-pointer"
                  >
                    {departments.map(d => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Project Health Status</label>
                  <select 
                    value={newProj.status}
                    onChange={(e) => setNewProj({...newProj, status: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-800 dark:text-white cursor-pointer"
                  >
                    <option value="On Track">On Track (Healthy)</option>
                    <option value="Caution">Caution (Overrunning)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Team Headcount</label>
                  <input 
                    type="number" 
                    value={newProj.teamSize}
                    onChange={(e) => setNewProj({...newProj, teamSize: e.target.value})}
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Hours Logged</label>
                  <input 
                    type="number" 
                    value={newProj.hoursLogged}
                    onChange={(e) => setNewProj({...newProj, hoursLogged: e.target.value})}
                    className="premium-input text-xs" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Budget (₹)</label>
                  <input 
                    type="number" 
                    value={newProj.budget}
                    onChange={(e) => setNewProj({...newProj, budget: e.target.value})}
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
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
                  Initiate Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
