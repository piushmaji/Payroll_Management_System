import { create } from 'zustand';
import { getSupabaseClient } from '../lib/supabaseClient';

// Preloaded mock employees (Fallback)
const INITIAL_EMPLOYEES = [
  {
    id: "101",
    name: "Rahul Sharma",
    email: "rahul@company.com",
    role: "Senior Software Eng",
    department: "Information Technology",
    status: "Active",
    baseSalary: 800000,
    allowance: 216000,
    deductions: 77400,
    joinedDate: "2018-06-01",
    bankName: "Chase Manhattan Bank",
    bankAccount: "•••• •••• 9840",
    pan: "ABCDE1234F",
    pfAccount: "PF-2022-884-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "102",
    name: "Priya Verma",
    email: "priya@company.com",
    role: "Software Engineer",
    department: "Information Technology",
    status: "Active",
    baseSalary: 400000,
    allowance: 100800,
    deductions: 42000,
    joinedDate: "2019-03-15",
    bankName: "Wells Fargo Bank",
    bankAccount: "•••• •••• 1024",
    pan: "FGHIJ5678K",
    pfAccount: "PF-2021-392-05",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  },
  {
    id: "103",
    name: "Amit Kumar",
    email: "amit@company.com",
    role: "Tech Lead",
    department: "Information Technology",
    status: "Active",
    baseSalary: 1200000,
    allowance: 336000,
    deductions: 120000,
    joinedDate: "2015-09-10",
    bankName: "Bank of America",
    bankAccount: "•••• •••• 5590",
    pan: "KLMNO9012P",
    pfAccount: "PF-2023-119-02",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    id: "104",
    name: "Sneha Patel",
    email: "sneha@company.com",
    role: "HR Executive",
    department: "Human Resources",
    status: "Active",
    baseSalary: 350000,
    allowance: 91200,
    deductions: 38000,
    joinedDate: "2021-01-20",
    bankName: "CitiBank N.A.",
    bankAccount: "•••• •••• 4402",
    pan: "QRSTU3456V",
    pfAccount: "PF-2023-903-88",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    id: "105",
    name: "Ananya Nair",
    email: "ananya@company.com",
    role: "Software Engineer",
    department: "Marketing",
    status: "Active",
    baseSalary: 400000,
    allowance: 24000,
    deductions: 0,
    joinedDate: "2022-07-11",
    bankName: "Silicon Valley Bank",
    bankAccount: "•••• •••• 8847",
    pan: "WXYZA7890B",
    pfAccount: "PF-2022-671-33",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  }
];

// Preloaded mock payroll run history
const INITIAL_PAYROLL_RUNS = [
  { id: "PAY-2026-003", month: "March 2026", activeHeadcount: 5, totalBase: 3150000, totalAllowances: 768000, totalDeductions: 277400, totalNet: 3640600, status: "Processed", runDate: "2026-03-28" }
];

// Preloaded projects list
const INITIAL_PROJECTS = [
  { id: "1", name: "ERP Implementation", teamSize: 4, budget: 140000, hoursLogged: 840, status: "On Track", department: "Information Technology" },
  { id: "2", name: "Mobile App Dev", teamSize: 3, budget: 95000, hoursLogged: 610, status: "Caution", department: "Information Technology" },
  { id: "3", name: "HR Automation", teamSize: 2, budget: 45000, hoursLogged: 220, status: "On Track", department: "Human Resources" }
];

// Preloaded departments
const INITIAL_DEPARTMENTS = [
  { id: 1, name: "Human Resources", code: "HUM", head: "Sneha Patel", headcount: 1, monthlyBudget: 416666, expenseRatio: 40 },
  { id: 2, name: "Information Technology", code: "INF", head: "Amit Kumar", headcount: 3, monthlyBudget: 1250000, expenseRatio: 78 },
  { id: 3, name: "Finance", code: "FIN", head: "Vacant", headcount: 0, monthlyBudget: 833333, expenseRatio: 0 },
  { id: 4, name: "Marketing", code: "MAR", head: "Ananya Nair", headcount: 1, monthlyBudget: 666666, expenseRatio: 30 }
];

// Preloaded notifications
const INITIAL_NOTIFICATIONS = [
  { id: "notif-1", title: "Supabase Pipeline Ready", body: "SQL 8-Entity schema configured. Connect via Settings page to enable live database.", type: "info", date: "Just now", read: false }
];

export const useStore = create((set, get) => ({
  // Authentication & Layout Context
  user: {
    name: "Alex Thorne",
    email: "alex.t@payflow.com",
    role: "System Administrator",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  notifications: INITIAL_NOTIFICATIONS,
  darkMode: false,
  currentRoute: "dashboard", // Simulates page routing
  isLoading: false,

  // Attendance Clock-in State
  clockInStatus: "out", // 'in' or 'out'
  clockInTime: null,
  attendanceToday: {
    present: 4,
    late: 1,
    absent: 0,
    leave: 1
  },

  // Roster lists (Seeded with local fallbacks)
  employees: INITIAL_EMPLOYEES,
  payrollRuns: INITIAL_PAYROLL_RUNS,
  projects: INITIAL_PROJECTS,
  departments: INITIAL_DEPARTMENTS,

  // Selected state for drawers/modals
  selectedEmployee: null,
  isProfileDrawerOpen: false,

  // Tax Configurations & System Settings
  settings: {
    companyName: "PayFlow Corp",
    companyEmail: "payroll@payflow.com",
    baseTaxRate: 15,
    pfContribution: 12,
    currency: "INR",
    allowManualPayslipOverride: true,
    supabaseUrl: typeof window !== 'undefined' ? localStorage.getItem('payflow_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '' : import.meta.env.VITE_SUPABASE_URL || '',
    supabaseKey: typeof window !== 'undefined' ? localStorage.getItem('payflow_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '' : import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  },

  // Initialize store and fetch Supabase data immediately if configured
  initStore: async () => {
    await get().fetchData();
  },

  // Fetch all entities from Supabase and map them to the frontend schemas
  fetchData: async () => {
    const { supabaseUrl, supabaseKey } = get().settings;
    const supabase = getSupabaseClient(supabaseUrl, supabaseKey);
    
    if (!supabase) {
      console.log("No Supabase configuration detected or connected. Operating in offline/fallback mode.");
      return;
    }

    try {
      set({ isLoading: true });

      // 1. Fetch departments
      const { data: depts, error: deptsErr } = await supabase
        .from('department')
        .select('*');
      if (deptsErr) throw deptsErr;

      // 2. Fetch designations
      const { data: desigs, error: desigsErr } = await supabase
        .from('designation')
        .select('*');
      if (desigsErr) throw desigsErr;

      // 3. Fetch employees with their relationships
      const { data: emps, error: empsErr } = await supabase
        .from('employee')
        .select('*');
      if (empsErr) throw empsErr;

      // 4. Fetch allowances
      const { data: allows, error: allowsErr } = await supabase
        .from('allowance')
        .select('*');
      if (allowsErr) throw allowsErr;

      // 5. Fetch deductions
      const { data: deducts, error: deductsErr } = await supabase
        .from('deduction')
        .select('*');
      if (deductsErr) throw deductsErr;

      // 6. Fetch projects
      const { data: projs, error: projsErr } = await supabase
        .from('project')
        .select('*');
      if (projsErr) throw projsErr;

      // 7. Fetch payslips
      const { data: slips, error: slipsErr } = await supabase
        .from('payslip')
        .select('*');
      if (slipsErr) throw slipsErr;

      // Map Departments
      const mappedDepts = depts.map(d => {
        const deptEmps = emps.filter(e => e.dept_id === d.dept_id);
        const mgr = deptEmps.find(e => {
          const des = desigs.find(dg => dg.desig_id === e.desig_id);
          return des && (des.desig_name.toLowerCase().includes('manager') || des.desig_name.toLowerCase().includes('lead'));
        });

        return {
          id: d.dept_id,
          name: d.dept_name,
          code: d.dept_name.substring(0, 3).toUpperCase(),
          head: mgr ? mgr.full_name : (d.dept_name === 'Human Resources' ? 'Sneha Patel' : 'Vacant'),
          headcount: deptEmps.length,
          monthlyBudget: Math.round(Number(d.budget || 0) / 12),
          expenseRatio: deptEmps.length > 0 ? 75 : 0
        };
      });

      // Map Employees
      const mappedEmps = emps.map(e => {
        const empAllows = allows.filter(al => al.emp_id === e.emp_id);
        const empDeducts = deducts.filter(de => de.emp_id === e.emp_id);

        const totalAllowance = empAllows.reduce((sum, al) => sum + Number(al.amount || 0), 0);
        const totalDeduction = empDeducts.reduce((sum, de) => sum + Number(de.amount || 0), 0);

        const desig = desigs.find(dg => dg.desig_id === e.desig_id);
        const dept = depts.find(dp => dp.dept_id === e.dept_id);
        
        const baseSalary = desig ? Number(desig.min_salary || 0) : 400000;

        return {
          id: String(e.emp_id),
          name: e.full_name,
          email: e.email,
          role: desig ? desig.desig_name : 'Software Engineer',
          department: dept ? dept.dept_name : 'Information Technology',
          status: e.status || 'Active',
          baseSalary: baseSalary,
          allowance: totalAllowance,
          deductions: totalDeduction,
          joinedDate: e.hire_date,
          bankName: e.bank_name || 'Chase Manhattan Bank',
          bankAccount: e.bank_account || '•••• •••• 1234',
          pan: e.pan || 'ABCDE1234F',
          pfAccount: e.pf_account || 'PF-2026-990-01',
          avatar: e.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          emp_type: e.emp_type,
          
          // Subtypes properties
          gratuity: e.gratuity,
          notice_period: e.notice_period,
          pf_eligible: e.pf_eligible,
          contract_end_date: e.contract_end_date,
          agency_name: e.agency_name,
          renewal_option: e.renewal_option,
          hours_per_week: e.hours_per_week,
          hourly_rate: e.hourly_rate,
          shift_timing: e.shift_timing,
          payment_method: e.payment_method,
          id_proof_type: e.id_proof_type,
          id_proof_number: e.id_proof_number,
          dept_id: e.dept_id,
          desig_id: e.desig_id
        };
      });

      // Map Projects
      const mappedProjs = projs.map(p => {
        const dept = depts.find(dp => dp.dept_id === p.dept_id);
        return {
          id: String(p.project_id),
          name: p.project_name,
          teamSize: p.team_size || 0,
          budget: Number(p.budget || 0),
          hoursLogged: p.hours_logged || 0,
          status: p.status || 'On Track',
          department: dept ? dept.dept_name : 'Information Technology'
        };
      });

      // Map Payslips (aggregated to simulated run history)
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const groupedRuns = {};
      slips.forEach(s => {
        const monthName = monthNames[s.pay_month - 1] + " 2026";
        if (!groupedRuns[monthName]) {
          groupedRuns[monthName] = {
            id: `PAY-2026-00${s.pay_month}`,
            month: monthName,
            activeHeadcount: 0,
            totalBase: 0,
            totalAllowances: 0,
            totalDeductions: 0,
            totalNet: 0,
            status: "Processed",
            runDate: s.run_date || '2026-03-28'
          };
        }
        groupedRuns[monthName].activeHeadcount += 1;
        groupedRuns[monthName].totalBase += Number(s.basic || 0);
        groupedRuns[monthName].totalAllowances += Number(s.allowance_total || 0);
        groupedRuns[monthName].totalDeductions += Number(s.deduction_total || 0);
        groupedRuns[monthName].totalNet += Number(s.net_pay || 0);
        if (s.payment_status === 'PENDING') {
          groupedRuns[monthName].status = 'Pending';
        }
      });

      const mappedRuns = Object.values(groupedRuns).sort((a, b) => b.month.localeCompare(a.month));

      set({
        departments: mappedDepts.length > 0 ? mappedDepts : INITIAL_DEPARTMENTS,
        employees: mappedEmps,
        projects: mappedProjs.length > 0 ? mappedProjs : INITIAL_PROJECTS,
        payrollRuns: mappedRuns.length > 0 ? mappedRuns : INITIAL_PAYROLL_RUNS,
        isLoading: false
      });

    } catch (error) {
      console.error("Failed to synchronize with Supabase:", error);
      set({ isLoading: false });
    }
  },

  // Actions
  toggleDarkMode: () => set((state) => {
    document.documentElement.classList.remove('dark');
    return { darkMode: false };
  }),

  setCurrentRoute: (route) => {
    set({ currentRoute: route });
    // Pull fresh data whenever navigating
    get().fetchData();
  },
  
  // Auth Functions
  login: (email, password) => {
    if (email && password) {
      set({
        user: {
          name: "Alex Thorne",
          email: email,
          role: "System Administrator",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
        }
      });
      return true;
    }
    return false;
  },

  logout: () => set({ user: null, currentRoute: "login" }),

  // Clock Actions
  triggerClockIn: async () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const { supabaseUrl, supabaseKey } = get().settings;
    const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

    if (supabase) {
      try {
        const todayStr = now.toISOString().split('T')[0];
        await supabase.from('attendance').insert({
          emp_id: 101, // Rahul Sharma as standard demo profile
          attend_date: todayStr,
          check_in: now.toISOString(),
          status: 'PRESENT',
          work_hrs: 8.5
        });
      } catch (err) {
        console.error("Failed to log attendance to database:", err);
      }
    }

    set((state) => ({
      clockInStatus: "in",
      clockInTime: timeStr,
      attendanceToday: {
        ...state.attendanceToday,
        present: state.attendanceToday.present + 1
      },
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Clock-in successful",
          body: `You clocked in at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          type: "success",
          date: "Just now",
          read: false
        },
        ...state.notifications
      ]
    }));
  },

  triggerClockOut: () => {
    set((state) => ({
      clockInStatus: "out",
      clockInTime: null,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Clock-out recorded",
          body: "Thank you for today's contribution!",
          type: "info",
          date: "Just now",
          read: false
        },
        ...state.notifications
      ]
    }));
  },

  // Employee Actions
  addEmployee: async (newEmp) => {
    const { supabaseUrl, supabaseKey } = get().settings;
    const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

    if (supabase) {
      try {
        set({ isLoading: true });

        // Retrieve dept_id by name
        let deptId = 2; // Default to IT
        const { data: deptData } = await supabase
          .from('department')
          .select('dept_id')
          .eq('dept_name', newEmp.department)
          .maybeSingle();
        if (deptData) deptId = deptData.dept_id;

        // Retrieve or generate designation ID
        let desigId = 1; // Default
        const { data: desigData } = await supabase
          .from('designation')
          .select('desig_id')
          .eq('desig_name', newEmp.role)
          .maybeSingle();

        if (desigData) {
          desigId = desigData.desig_id;
        } else {
          // create a designation record
          const { data: newDesig } = await supabase
            .from('designation')
            .insert({ 
              desig_name: newEmp.role, 
              min_salary: Number(newEmp.baseSalary || 400000), 
              max_salary: Number(newEmp.baseSalary || 400000) * 1.5 
            })
            .select()
            .single();
          if (newDesig) desigId = newDesig.desig_id;
        }

        // Insert primary employee record
        const { data: insertedEmp, error: empErr } = await supabase
          .from('employee')
          .insert({
            full_name: newEmp.name,
            email: newEmp.email,
            hire_date: newEmp.joinedDate || new Date().toISOString().split('T')[0],
            emp_type: newEmp.emp_type || 'PERMANENT',
            dept_id: deptId,
            desig_id: desigId,
            status: 'Active',
            bank_name: newEmp.bankName,
            bank_account: newEmp.bankAccount,
            pan: newEmp.pan,
            pf_account: newEmp.pfAccount,
            avatar: newEmp.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
          })
          .select()
          .single();

        if (empErr) throw empErr;

        // Insert allowance (mock setup default to single HRA row)
        if (newEmp.allowance > 0) {
          await supabase.from('allowance').insert({
            emp_id: insertedEmp.emp_id,
            allow_type: 'House Rent',
            amount: Number(newEmp.allowance),
            is_taxable: 'Y'
          });
        }

        // Insert deduction
        if (newEmp.deductions > 0) {
          await supabase.from('deduction').insert({
            emp_id: insertedEmp.emp_id,
            deduct_type: 'Provident Fund',
            amount: Number(newEmp.deductions),
            deduct_month: 5 // Month index
          });
        }

        await get().fetchData();
        return;
      } catch (err) {
        console.error("Failed to add employee in Supabase:", err);
        set({ isLoading: false });
      }
    }

    // Local fallback
    set((state) => ({
      employees: [
        {
          ...newEmp,
          id: `EMP-2024-00${state.employees.length + 1}`,
          avatar: newEmp.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
          status: newEmp.status || "Active"
        },
        ...state.employees
      ]
    }));
  },

  updateEmployee: async (id, updatedFields) => {
    const { supabaseUrl, supabaseKey } = get().settings;
    const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

    const numericId = Number(id);
    if (supabase && !isNaN(numericId)) {
      try {
        set({ isLoading: true });
        const payload = {};
        
        if (updatedFields.name) payload.full_name = updatedFields.name;
        if (updatedFields.email) payload.email = updatedFields.email;
        if (updatedFields.status) payload.status = updatedFields.status;
        if (updatedFields.bankName) payload.bank_name = updatedFields.bankName;
        if (updatedFields.bankAccount) payload.bank_account = updatedFields.bankAccount;
        if (updatedFields.pan) payload.pan = updatedFields.pan;
        if (updatedFields.pfAccount) payload.pf_account = updatedFields.pfAccount;

        if (updatedFields.department) {
          const { data: deptData } = await supabase.from('department').select('dept_id').eq('dept_name', updatedFields.department).maybeSingle();
          if (deptData) payload.dept_id = deptData.dept_id;
        }

        if (updatedFields.role) {
          const { data: desigData } = await supabase.from('designation').select('desig_id').eq('desig_name', updatedFields.role).maybeSingle();
          if (desigData) {
            payload.desig_id = desigData.desig_id;
          } else {
            const { data: newDesig } = await supabase.from('designation').insert({ desig_name: updatedFields.role }).select().single();
            if (newDesig) payload.desig_id = newDesig.desig_id;
          }
        }

        if (Object.keys(payload).length > 0) {
          const { error } = await supabase
            .from('employee')
            .update(payload)
            .eq('emp_id', numericId);
          if (error) throw error;
        }

        // Handle allowance edits
        if (updatedFields.allowance !== undefined) {
          await supabase.from('allowance').delete().eq('emp_id', numericId);
          if (updatedFields.allowance > 0) {
            await supabase.from('allowance').insert({
              emp_id: numericId,
              allow_type: 'House Rent',
              amount: Number(updatedFields.allowance)
            });
          }
        }

        // Handle deduction edits
        if (updatedFields.deductions !== undefined) {
          await supabase.from('deduction').delete().eq('emp_id', numericId);
          if (updatedFields.deductions > 0) {
            await supabase.from('deduction').insert({
              emp_id: numericId,
              deduct_type: 'Provident Fund',
              amount: Number(updatedFields.deductions),
              deduct_month: 5
            });
          }
        }

        await get().fetchData();
        return;
      } catch (err) {
        console.error("Failed to update employee in Supabase:", err);
        set({ isLoading: false });
      }
    }

    // Local fallback
    set((state) => ({
      employees: state.employees.map(emp => emp.id === id ? { ...emp, ...updatedFields } : emp),
      selectedEmployee: state.selectedEmployee && state.selectedEmployee.id === id ? { ...state.selectedEmployee, ...updatedFields } : state.selectedEmployee
    }));
  },

  deleteEmployee: async (id) => {
    const { supabaseUrl, supabaseKey } = get().settings;
    const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

    const numericId = Number(id);
    if (supabase && !isNaN(numericId)) {
      try {
        set({ isLoading: true });
        const { error } = await supabase
          .from('employee')
          .delete()
          .eq('emp_id', numericId);
        if (error) throw error;
        await get().fetchData();
        return;
      } catch (err) {
        console.error("Failed to delete employee in Supabase:", err);
        set({ isLoading: false });
      }
    }

    // Local fallback
    set((state) => ({
      employees: state.employees.filter(emp => emp.id !== id),
      selectedEmployee: state.selectedEmployee && state.selectedEmployee.id === id ? null : state.selectedEmployee,
      isProfileDrawerOpen: state.selectedEmployee && state.selectedEmployee.id === id ? false : state.isProfileDrawerOpen
    }));
  },

  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  setProfileDrawerOpen: (isOpen) => set({ isProfileDrawerOpen: isOpen }),

  // Notification Actions
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  clearNotifications: () => set({ notifications: [] }),

  // Payroll calculations action
  runPayrollSimulation: async (monthName) => {
    const { supabaseUrl, supabaseKey } = get().settings;
    const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

    const activeList = get().employees.filter(emp => emp.status === "Active");
    
    // Parse month number
    const monthMap = { 
      "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6, 
      "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12 
    };
    const monthParts = monthName.toLowerCase().split(' ');
    const monthNum = monthMap[monthParts[0]] || 5;

    if (supabase) {
      try {
        set({ isLoading: true });
        
        // Remove existing run for this month to avoid duplicates
        await supabase
          .from('payslip')
          .delete()
          .eq('pay_month', monthNum);

        // Generate payslips
        for (const emp of activeList) {
          const empIdNum = Number(emp.id);
          if (isNaN(empIdNum)) continue;

          const netPay = emp.baseSalary + emp.allowance - emp.deductions;

          await supabase.from('payslip').insert({
            emp_id: empIdNum,
            pay_month: monthNum,
            net_pay: netPay,
            payment_status: 'PAID',
            basic: emp.baseSalary,
            allowance_total: emp.allowance,
            deduction_total: emp.deductions,
            run_date: new Date().toISOString().split('T')[0]
          });
        }

        await get().fetchData();
      } catch (err) {
        console.error("Failed to execute payroll run in Supabase:", err);
      }
    }

    // Local side effects
    let totalBase = 0;
    let totalAllowances = 0;
    let totalDeductions = 0;

    activeList.forEach(emp => {
      totalBase += Number(emp.baseSalary);
      totalAllowances += Number(emp.allowance || 0);
      totalDeductions += Number(emp.deductions || 0);
    });

    const totalNet = (totalBase + totalAllowances) - totalDeductions;

    const newRun = {
      id: `PAY-2026-0${monthNum}`,
      month: monthName,
      activeHeadcount: activeList.length,
      totalBase,
      totalAllowances,
      totalDeductions,
      totalNet,
      status: "Processed",
      runDate: new Date().toISOString().split('T')[0]
    };

    set((state) => ({
      payrollRuns: [newRun, ...state.payrollRuns.filter(r => r.month !== monthName)],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: "Payroll Run Completed",
          body: `Processed payroll successfully for ${monthName}. Payout size: ${state.settings.currency} ${totalNet.toLocaleString()}`,
          type: "success",
          date: "Just now",
          read: false
        },
        ...state.notifications
      ]
    }));
  },

  // Settings modification
  updateSettings: (newSettings) => set((state) => {
    const updated = { ...state.settings, ...newSettings };
    
    if (newSettings.supabaseUrl !== undefined) {
      localStorage.setItem('payflow_supabase_url', newSettings.supabaseUrl);
    }
    if (newSettings.supabaseKey !== undefined) {
      localStorage.setItem('payflow_supabase_key', newSettings.supabaseKey);
    }

    // Re-trigger fetch dynamically
    setTimeout(() => {
      get().fetchData();
    }, 100);

    return { settings: updated };
  })
}));

// Run initial store synchronizer
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useStore.getState().initStore();
  }, 100);
}
