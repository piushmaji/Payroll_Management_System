import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  LayoutDashboard, Users, CalendarDays, CreditCard, FileSpreadsheet, 
  Building2, Briefcase, UserCircle, BarChart3, Settings, LogOut, 
  Menu, X, Bell, Sun, Moon, Search, Clock, ArrowUpRight, CheckCircle2, AlertTriangle, Info 
} from 'lucide-react';

export default function MainLayout({ children }) {
  const { 
    user, 
    darkMode, 
    toggleDarkMode, 
    currentRoute, 
    setCurrentRoute, 
    logout,
    clockInStatus,
    clockInTime,
    triggerClockIn,
    triggerClockOut,
    notifications,
    markAllNotificationsRead,
    clearNotifications
  } = useStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { id: "dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Employee Directory", icon: Users },
    { id: "attendance", label: "Attendance Log", icon: CalendarDays },
    { id: "payroll", label: "Payroll Overview", icon: CreditCard },
    { id: "payslips", label: "Payslip Generator", icon: FileSpreadsheet },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "projects", label: "Project Assignment", icon: Briefcase },
    { id: "profile", label: "My Profile", icon: UserCircle },
    { id: "analytics", label: "Analytics Dashboard", icon: BarChart3 },
    { id: "settings", label: "Workspace Settings", icon: Settings },
  ];

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Real time page jump if matching query
    const target = menuItems.find(item => item.label.toLowerCase().includes(e.target.value.toLowerCase()));
    if (target && e.target.value.length > 3) {
      setCurrentRoute(target.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 text-zinc-900">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden w-full flex items-center justify-between px-4 py-4 glass-nav z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-600/30">N</div>
          <span className="font-bold tracking-tight text-lg font-sans">Nexpayflow</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)} 
            className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
          >
            <Bell size={20} />
            {unreadNotifs > 0 && <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 border border-white dark:border-zinc-950" />}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* SIDEBAR FOR DESKTOP / DRAWER FOR MOBILE */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 md:relative md:z-0
        w-72 glass-sidebar flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* BRAND & HEADER */}
        <div>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/30">N</div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-base font-sans">Nexpayflow</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider uppercase">Enterprise SaaS</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-900">
              <X size={18} />
            </button>
          </div>

          {/* QUICK CHECK IN / OUT CONSOLE */}
          <div className="px-4 mb-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                  <Clock size={13} />
                  <span>ADMIN DESK CONSOLE</span>
                </div>
                {clockInStatus === "in" && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div className="text-sm font-bold mb-3 dark:text-white">
                {clockInStatus === "in" ? `Shift Active • Checked In` : `Shift Terminated`}
                {clockInTime && <span className="block text-xs font-normal text-zinc-400 dark:text-zinc-500 mt-0.5">Checked-in at {clockInTime}</span>}
              </div>
              <button 
                onClick={clockInStatus === "in" ? triggerClockOut : triggerClockIn}
                className={`w-full py-2 px-3 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  clockInStatus === "in"
                    ? 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
                }`}
              >
                {clockInStatus === "in" ? "Clock Out (Shift End)" : "Quick Clock In"}
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="px-4 mb-4 relative">
            <Search className="absolute left-7 top-3 text-zinc-400 dark:text-zinc-600" size={16} />
            <input 
              type="text" 
              placeholder="Search screens..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-zinc-100/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
            />
          </div>

          {/* MENU ITEMS */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentRoute(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500'} />
                  <span>{item.label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* PROFILE WIDGET & FOOTER */}
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/40">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/20 shadow-md"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">{user?.name}</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold truncate">{user?.role}</span>
            </div>
          </div>

          <div className="flex">
            <button 
              onClick={logout}
              className="w-full py-2.5 px-3 rounded-xl border border-zinc-250 bg-white hover:bg-rose-50 text-rose-600 flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm transition-all"
            >
              <LogOut size={14} />
              <span>Sign Out Workspace</span>
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-all duration-300"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-x-hidden min-h-[calc(100vh-68px)] md:min-h-screen">
        
        {/* DESKTOP HEADER */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 glass-nav sticky top-0 z-30">
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-zinc-950 dark:text-white capitalize flex items-center gap-2">
              {menuItems.find(item => item.id === currentRoute)?.label || "Nexpayflow Platform"}
              <span className="text-[10px] py-0.5 px-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold border border-indigo-100/50 dark:border-indigo-900/30">V1.2 Live</span>
            </h1>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold mt-0.5">Enterprise HR, payroll distribution, and tax reconciliation pipelines.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Clock indicator */}
            <div className="flex items-center gap-2 py-1.5 px-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/40 rounded-xl text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
              <span>May 19, 2026</span>
            </div>

            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className="relative p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/40 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-all"
            >
              <Bell size={16} />
              {unreadNotifs > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-500" />}
            </button>

            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="h-9 w-9 rounded-xl object-cover ring-2 ring-indigo-500/10 shadow-sm"
            />
          </div>
        </header>

        {/* CHOSEN SCREEN CONTAINER */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-76px)]">
          <div className="max-w-7xl mx-auto w-full animate-slide-in-bottom">
            {children}
          </div>
        </div>
      </main>

      {/* NOTIFICATIONS SLIDE PANELS (GLASSMORPHIC) */}
      {isNotifOpen && (
        <>
          <div 
            onClick={() => setIsNotifOpen(false)} 
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm transition-all" 
          />
          <div className="fixed top-0 bottom-0 right-0 w-full sm:w-96 z-50 glass-sidebar shadow-2xl flex flex-col justify-between animate-slide-in-right">
            <div>
              <div className="flex items-center justify-between p-6 border-b border-zinc-200/50 dark:border-zinc-800/40">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold dark:text-white">Workspace Activity</span>
                </div>
                <button onClick={() => setIsNotifOpen(false)} className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-900">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 flex gap-2">
                <button 
                  onClick={markAllNotificationsRead}
                  className="flex-1 py-1.5 text-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold dark:text-zinc-300 transition-all"
                >
                  Mark all read
                </button>
                <button 
                  onClick={clearNotifications}
                  className="flex-1 py-1.5 text-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-rose-600 transition-all"
                >
                  Clear logs
                </button>
              </div>

              <div className="px-4 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs">No active logs detected. Everything's healthy!</div>
                ) : (
                  notifications.map((notif) => {
                    const NotifIcon = notif.type === 'success' ? CheckCircle2 : notif.type === 'warning' ? AlertTriangle : Info;
                    const notifColor = notif.type === 'success' ? 'text-emerald-500 bg-emerald-500/10' : notif.type === 'warning' ? 'text-amber-500 bg-amber-500/10' : 'text-indigo-500 bg-indigo-500/10';
                    return (
                      <div 
                        key={notif.id}
                        className={`p-4 rounded-xl border transition-all ${
                          notif.read 
                            ? 'bg-transparent border-zinc-100 dark:border-zinc-900 opacity-60' 
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm'
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${notifColor}`}>
                            <NotifIcon size={16} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">{notif.title}</span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-normal">{notif.body}</span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 font-medium">{notif.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="p-6 border-t border-zinc-200/50 dark:border-zinc-800/40 text-[10px] text-center text-zinc-400 dark:text-zinc-500">
              Nexpayflow Activity Log Pipeline • Refreshed live
            </div>
          </div>
        </>
      )}
    </div>
  );
}
