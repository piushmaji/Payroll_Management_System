import React, { useEffect } from 'react';
import { useStore } from './store';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import PayrollDashboard from './pages/PayrollDashboard';
import PayslipGeneration from './pages/PayslipGeneration';
import DepartmentManagement from './pages/DepartmentManagement';
import ProjectAssignment from './pages/ProjectAssignment';
import EmployeeProfile from './pages/EmployeeProfile';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { user, currentRoute, darkMode } = useStore();

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // If user is logged out, force showing login page
  if (!user) {
    return <LoginPage />;
  }

  // Handle specific page routing
  const renderScreen = () => {
    switch(currentRoute) {
      case "login":
        return <LoginPage />;
      case "dashboard":
        return <AdminDashboard />;
      case "employees":
        return <EmployeeManagement />;
      case "attendance":
        return <AttendanceManagement />;
      case "payroll":
        return <PayrollDashboard />;
      case "payslips":
        return <PayslipGeneration />;
      case "departments":
        return <DepartmentManagement />;
      case "projects":
        return <ProjectAssignment />;
      case "profile":
        return <EmployeeProfile />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "settings":
        return <SettingsPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <MainLayout>
      {renderScreen()}
    </MainLayout>
  );
}
