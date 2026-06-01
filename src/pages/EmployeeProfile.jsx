import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  User, Briefcase, Landmark, FileText, Download, 
  MapPin, Phone, Mail, Award, CheckCircle, HelpCircle, Sparkles, LogOut 
} from 'lucide-react';

export default function EmployeeProfile() {
  const { user, logout } = useStore();
  const [activeTab, setActiveTab] = useState("personal");
  const [successToast, setSuccessToast] = useState("");

  const handleDownloadDoc = (docName) => {
    setSuccessToast(`Document downloaded: ${docName}`);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const tabs = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "job", label: "Employment & Role", icon: Briefcase },
    { id: "banking", label: "Bank & Tax Setup", icon: Landmark },
    { id: "documents", label: "Signed Documents", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div>
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">EMPLOYEE WORKSPACE</span>
        <h2 className="text-xl font-bold dark:text-white mt-0.5">My Profile File</h2>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 flex items-center gap-2.5 animate-fade-in shadow-sm shadow-emerald-500/5">
          <CheckCircle size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* DETAILED LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* PROFILE LEFT SIDE CARD */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          {/* Decorative tag */}
          <div className="absolute right-0 top-0 p-3">
            <span className="text-[9px] py-0.5 px-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full font-bold">Audited</span>
          </div>

          <img 
            src={user?.avatar} 
            alt={user?.name} 
            className="h-20 w-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md mb-4"
          />

          <h3 className="text-base font-extrabold dark:text-white">{user?.name}</h3>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">{user?.role}</span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1.5 bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-900">
            ID: ADM-2026-101
          </span>

          <div className="w-full border-t border-zinc-100 dark:border-zinc-900/60 mt-6 pt-5 space-y-3.5 text-xs text-left text-zinc-400 dark:text-zinc-500 font-semibold">
            <div className="flex items-center gap-2.5">
              <Mail size={14} className="text-zinc-400" />
              <span className="dark:text-zinc-300 truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={14} className="text-zinc-400" />
              <span className="dark:text-zinc-300">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={14} className="text-zinc-400" />
              <span className="dark:text-zinc-300">Mumbai, India</span>
            </div>
          </div>

          <div className="w-full mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
            <button 
              onClick={logout}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/20 hover:bg-rose-50 text-rose-600 flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm transition-all"
            >
              <LogOut size={14} />
              <span>Sign Out Workspace</span>
            </button>
          </div>
        </div>

        {/* PROFILE RIGHT SIDE TABS PANEL */}
        <div className="glass-card rounded-2xl p-6 border-zinc-200/50 dark:border-zinc-900/60 shadow-sm lg:col-span-3 flex flex-col justify-between min-h-[360px]">
          
          {/* TAB HEADERS */}
          <div>
            <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-900/60">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                        : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-950/40 dark:text-zinc-400'
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB BODIES */}
            <div className="pt-6">
              
              {/* TAB 1: PERSONAL */}
              {activeTab === "personal" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Full Legal Name</span>
                    <span className="font-bold dark:text-white block mt-0.5">{user?.name}</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Primary Personal Email</span>
                    <span className="font-bold dark:text-white block mt-0.5">piush.maji.personal@gmail.com</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Resident Address</span>
                    <span className="font-bold dark:text-white block mt-0.5">Andheri East, Mumbai, India</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Passport Document Number</span>
                    <span className="font-bold dark:text-white block mt-0.5">•••• •••• 9904</span>
                  </div>
                </div>
              )}

              {/* TAB 2: JOB DETAILS */}
              {activeTab === "job" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Corporate Department</span>
                    <span className="font-bold dark:text-white block mt-0.5">Administrative Support</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Assigned Manager</span>
                    <span className="font-bold dark:text-white block mt-0.5">Sarah Jenkins</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Joined Date</span>
                    <span className="font-bold dark:text-white block mt-0.5">April 10, 2021 (5 Yrs Tenured)</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">Annual Base Wage</span>
                    <span className="font-bold dark:text-white block mt-0.5">₹1,80,000 / year</span>
                  </div>
                </div>
              )}

              {/* TAB 3: BANKING */}
              {activeTab === "banking" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">REMITTANCE ROUTING BANK</span>
                    <span className="font-bold dark:text-white block mt-0.5">Chase Manhattan Bank</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">ACCOUNT NUMBER</span>
                    <span className="font-bold dark:text-white block mt-0.5">•••• •••• 9031</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">TAX ACCOUNT INDENTIFIER (PAN)</span>
                    <span className="font-bold dark:text-white block mt-0.5">PANX-9884-01-F</span>
                  </div>

                  <div className="p-3 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block">PROVIDENT ANNUITY LOG (PF)</span>
                    <span className="font-bold dark:text-white block mt-0.5">PF-2021-990-14</span>
                  </div>
                </div>
              )}

              {/* TAB 4: DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="space-y-3.5 text-xs">
                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <FileText size={16} className="text-zinc-400" />
                      <div className="flex flex-col">
                        <span className="font-bold dark:text-white">Direct Deposit Enrollment Authorization</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Signed & Audited • Chase Remittances • Form 88A</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadDoc("Direct_Deposit_Authorization.pdf")}
                      className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    >
                      <Download size={14} />
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <FileText size={16} className="text-zinc-400" />
                      <div className="flex flex-col">
                        <span className="font-bold dark:text-white">Corporate Offer Letter Contract</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Signed & Audited • 180k Base Wage • Term-Permanent</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadDoc("Corporate_Offer_Letter.pdf")}
                      className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    >
                      <Download size={14} />
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <FileText size={16} className="text-zinc-400" />
                      <div className="flex flex-col">
                        <span className="font-bold dark:text-white">Mutual NDA & Intellectual Property Covenants</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Signed & Audited • Global standard compliance</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownloadDoc("IP_Mutual_NDA_Covenant.pdf")}
                      className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 text-[10px] text-zinc-400 dark:text-zinc-500 flex justify-between items-center">
            <span>Profile metadata fully certified under IRS & local labor laws.</span>
            <span className="font-bold text-indigo-500 flex items-center gap-0.5">
              <CheckCircle size={10} />
              <span>Compliant</span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
