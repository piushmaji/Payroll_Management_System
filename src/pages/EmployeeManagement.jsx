import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  Search, Filter, Plus, ChevronLeft, ChevronRight, MoreVertical, 
  Trash2, Edit, Eye, UserCheck, X, Landmark, UserPlus, 
  Download, Briefcase, Mail, Calendar, CheckSquare, Square, ShieldAlert
} from 'lucide-react';

export default function EmployeeManagement() {
  const { 
    employees, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    selectedEmployee, 
    setSelectedEmployee,
    isProfileDrawerOpen, 
    setProfileDrawerOpen,
    departments
  } = useStore();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState([]);
  
  // Modals & Drawers states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [actionDropdownId, setActionDropdownId] = useState(null);

  // New Employee Form State
  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    role: "",
    department: "Engineering",
    baseSalary: 85000,
    allowance: 5000,
    deductions: 3000,
    joinedDate: new Date().toISOString().split('T')[0],
    bankName: "Chase Manhattan Bank",
    bankAccount: "•••• •••• 1234",
    pan: "ABCDE1234F",
    pfAccount: "PF-2026-990-01"
  });

  // Filter Logic
  const filtered = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                          emp.role.toLowerCase().includes(search.toLowerCase()) ||
                          emp.id.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || emp.department === deptFilter;
    const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Pagination Logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedEmployees = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSelectRow = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter(i => i !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (checkedIds.length === paginatedEmployees.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(paginatedEmployees.map(e => e.id));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addEmployee({
      ...newEmp,
      baseSalary: Number(newEmp.baseSalary),
      allowance: Number(newEmp.allowance),
      deductions: Number(newEmp.deductions)
    });
    setIsAddOpen(false);
    // Reset Form
    setNewEmp({
      name: "",
      email: "",
      role: "",
      department: "Engineering",
      baseSalary: 85000,
      allowance: 5000,
      deductions: 3000,
      joinedDate: new Date().toISOString().split('T')[0],
      bankName: "Chase Manhattan Bank",
      bankAccount: "•••• •••• 1234",
      pan: "ABCDE1234F",
      pfAccount: "PF-2026-990-01"
    });
  };

  const handleBulkStatusChange = (status) => {
    checkedIds.forEach(id => {
      updateEmployee(id, { status });
    });
    setCheckedIds([]);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">WORKSPACE ROSTER</span>
          <h2 className="text-xl font-bold dark:text-white mt-0.5">Employee Directory</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddOpen(true)}
            className="premium-button-primary flex items-center gap-1.5"
          >
            <UserPlus size={16} />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="glass-card rounded-2xl p-4 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search name, role, or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white"
          />
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Dept:</span>
            <select 
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none dark:text-white cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.code} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-medium">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-1.5 px-3 text-xs focus:outline-none dark:text-white cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

      </div>

      {/* BULK ACTIONS BOX */}
      {checkedIds.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <CheckSquare size={16} />
            <span>Selected {checkedIds.length} employees</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => handleBulkStatusChange("Active")}
              className="flex-1 sm:flex-none py-2 px-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 rounded-xl transition-all"
            >
              Activate
            </button>
            <button 
              onClick={() => handleBulkStatusChange("Inactive")}
              className="flex-1 sm:flex-none py-2 px-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 rounded-xl transition-all"
            >
              Deactivate
            </button>
            <button 
              onClick={() => setCheckedIds([])}
              className="flex-1 sm:flex-none py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* SEARCH RESULTS DATA TABLE */}
      <div className="glass-card rounded-2xl overflow-hidden border-zinc-200/50 dark:border-zinc-900/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-900/80">
                <th className="py-4 px-6 w-12 text-center">
                  <button onClick={handleSelectAll} className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-500">
                    {checkedIds.length === paginatedEmployees.length && paginatedEmployees.length > 0 ? (
                      <CheckSquare size={16} className="text-indigo-600 dark:text-indigo-500" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="py-4 px-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Employee</th>
                <th className="py-4 px-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Job Details</th>
                <th className="py-4 px-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Department</th>
                <th className="py-4 px-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Base Salary</th>
                <th className="py-4 px-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-right text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/40">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-xs text-zinc-500">No active employees found matching filters.</td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const isChecked = checkedIds.includes(emp.id);
                  const isDropdownActive = actionDropdownId === emp.id;
                  
                  return (
                    <tr key={emp.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 transition-all">
                      <td className="py-4 px-6 text-center">
                        <button onClick={() => handleSelectRow(emp.id)} className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-500">
                          {isChecked ? (
                            <CheckSquare size={16} className="text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="h-9 w-9 rounded-xl object-cover ring-2 ring-indigo-500/10 shadow-sm" />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold dark:text-white">{emp.name}</span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">{emp.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs dark:text-zinc-300 font-semibold">{emp.role}</span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{emp.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/20 dark:border-zinc-800/30">{emp.department}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-bold dark:text-white">${emp.baseSalary.toLocaleString()}/yr</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          emp.status === "Active" 
                            ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20' 
                            : 'text-zinc-500 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-900'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right relative">
                        <button 
                          onClick={() => setActionDropdownId(isDropdownActive ? null : emp.id)}
                          className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {/* ACTION DROPDOWN WINDOW */}
                        {isDropdownActive && (
                          <>
                            <div onClick={() => setActionDropdownId(null)} className="fixed inset-0 z-10" />
                            <div className="absolute right-4 top-12 w-40 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-20 p-1.5 text-left animate-scale-in">
                              <button 
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  setProfileDrawerOpen(true);
                                  setActionDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950/40"
                              >
                                <Eye size={13} />
                                <span>View Profile</span>
                              </button>
                              <button 
                                onClick={() => {
                                  updateEmployee(emp.id, { status: emp.status === "Active" ? "Inactive" : "Active" });
                                  setActionDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-950/40"
                              >
                                <UserCheck size={13} />
                                <span>Toggle Status</span>
                              </button>
                              <button 
                                onClick={() => {
                                  deleteEmployee(emp.id);
                                  setActionDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              >
                                <Trash2 size={13} />
                                <span>Delete Record</span>
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="py-4 px-6 border-t border-zinc-200 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between">
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} employees
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. SLIDING RIGHT SIDE DRAWER FOR PROFILE */}
      {isProfileDrawerOpen && selectedEmployee && (
        <>
          <div onClick={() => setProfileDrawerOpen(false)} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-all" />
          <div className="fixed top-0 bottom-0 right-0 w-full sm:w-[500px] z-50 glass-sidebar shadow-2xl flex flex-col justify-between animate-slide-in-right">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-200/50 dark:border-zinc-800/40">
                <span className="text-sm font-bold dark:text-white">Employee File Card</span>
                <button onClick={() => setProfileDrawerOpen(false)} className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-400">
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
                
                {/* Photo & Role Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-900/60">
                  <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="h-16 w-16 rounded-2xl object-cover ring-4 ring-indigo-500/20" />
                  <div className="flex flex-col">
                    <span className="text-base font-extrabold dark:text-white">{selectedEmployee.name}</span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{selectedEmployee.role}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase font-bold tracking-wider">{selectedEmployee.id}</span>
                  </div>
                </div>

                {/* Job Tab Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Employment Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900/30 rounded-xl">
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold">DEPARTMENT</span>
                      <span className="text-xs font-bold dark:text-white mt-1 block">{selectedEmployee.department}</span>
                    </div>

                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900/30 rounded-xl">
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold">JOIN DATE</span>
                      <span className="text-xs font-bold dark:text-white mt-1 block">{selectedEmployee.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Financial details card */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Compensations & Deductions</h4>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500">Base Salary</span>
                      <span className="font-bold dark:text-white">${selectedEmployee.baseSalary.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-400 dark:text-zinc-500">Variable Allowances</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+${selectedEmployee.allowance.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-zinc-300 dark:border-zinc-800">
                      <span className="text-zinc-400 dark:text-zinc-500">Tax Deductions</span>
                      <span className="font-bold text-rose-500">-${selectedEmployee.deductions.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-zinc-400 dark:text-zinc-500 font-bold">Estimated Net Pay</span>
                      <span className="font-extrabold dark:text-white text-sm">
                        ${(selectedEmployee.baseSalary + selectedEmployee.allowance - selectedEmployee.deductions).toLocaleString()}/yr
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banking details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Banking Setup</h4>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <Landmark size={15} className="text-zinc-400" />
                      <span className="text-xs font-bold dark:text-white">{selectedEmployee.bankName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold">ACCOUNT NUMBER</span>
                        <span className="font-semibold dark:text-white block mt-0.5">{selectedEmployee.bankAccount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block font-semibold">TAX IDENTIFICATION PAN</span>
                        <span className="font-semibold dark:text-white block mt-0.5">{selectedEmployee.pan}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-zinc-200/50 dark:border-zinc-800/40 flex gap-3">
              <button 
                onClick={() => setProfileDrawerOpen(false)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl transition-all text-center border border-zinc-700/60"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </>
      )}

      {/* 5. ADD EMPLOYEE MODAL DIALOG */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
          <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 z-10 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <span className="text-base font-bold dark:text-white">Add New Employee Record</span>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-950/40 text-zinc-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">FullName</label>
                  <input 
                    type="text" 
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({...newEmp, name: e.target.value})}
                    placeholder="e.g. Rachel Adams"
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Corporate Email</label>
                  <input 
                    type="email" 
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({...newEmp, email: e.target.value})}
                    placeholder="rachel.a@payflow.com"
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Corporate Title/Role</label>
                  <input 
                    type="text" 
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({...newEmp, role: e.target.value})}
                    placeholder="Senior QA Engineer"
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Department</label>
                  <select 
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({...newEmp, department: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-800 dark:text-white"
                  >
                    {departments.map(d => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Base Salary ($)</label>
                  <input 
                    type="number" 
                    value={newEmp.baseSalary}
                    onChange={(e) => setNewEmp({...newEmp, baseSalary: e.target.value})}
                    className="premium-input text-xs" 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Allowance ($)</label>
                  <input 
                    type="number" 
                    value={newEmp.allowance}
                    onChange={(e) => setNewEmp({...newEmp, allowance: e.target.value})}
                    className="premium-input text-xs" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Deductions ($)</label>
                  <input 
                    type="number" 
                    value={newEmp.deductions}
                    onChange={(e) => setNewEmp({...newEmp, deductions: e.target.value})}
                    className="premium-input text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Bank Name</label>
                  <input 
                    type="text" 
                    value={newEmp.bankName}
                    onChange={(e) => setNewEmp({...newEmp, bankName: e.target.value})}
                    className="premium-input text-xs" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">Account Mask (or full number)</label>
                  <input 
                    type="text" 
                    value={newEmp.bankAccount}
                    onChange={(e) => setNewEmp({...newEmp, bankAccount: e.target.value})}
                    className="premium-input text-xs" 
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
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
