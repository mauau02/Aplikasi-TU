
import React, { useState, useEffect } from 'react';
import { View, Student, Grade, Teacher, Achievement, Violation, Facility } from './types';
import { storage } from './services/storage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import TeacherManagement from './components/TeacherManagement';
import AIInsights from './components/AIInsights';
import Login from './components/Login';
import StudentRecords from './components/StudentRecords';
import FacilityManagement from './components/FacilityManagement';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setView] = useState<View>(View.DASHBOARD);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<string>('');

  useEffect(() => {
    const savedLogin = localStorage.getItem('isLoggedIn');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }

    setStudents(storage.getStudents());
    setGrades(storage.getGrades());
    setTeachers(storage.getTeachers());
    setAchievements(storage.getAchievements());
    setViolations(storage.getViolations());
    setFacilities(storage.getFacilities());
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      setView(View.DASHBOARD);
    }
  };

  // Student Handlers
  const handleAddStudent = (newStudent: Student) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    storage.saveStudents(updated);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    storage.saveStudents(updated);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("Hapus data siswa ini?")) {
      const updated = students.filter(s => s.id !== id);
      setStudents(updated);
      storage.saveStudents(updated);
    }
  };

  const handleViewStudentRecords = (id: string) => {
    setActiveStudentId(id);
    setView(View.RECORDS);
  };

  // Teacher Handlers
  const handleAddTeacher = (newTeacher: Teacher) => {
    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    storage.saveTeachers(updated);
  };

  const handleUpdateTeacher = (updatedTeacher: Teacher) => {
    const updated = teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t);
    setTeachers(updated);
    storage.saveTeachers(updated);
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
      const updated = teachers.filter(t => t.id !== id);
      setTeachers(updated);
      storage.saveTeachers(updated);
    }
  };

  const handleAddAchievement = (ach: Achievement) => {
    const updated = [...achievements, ach];
    setAchievements(updated);
    storage.saveAchievements(updated);
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = achievements.filter(a => a.id !== id);
    setAchievements(updated);
    storage.saveAchievements(updated);
  };

  const handleAddViolation = (vio: Violation) => {
    const updated = [...violations, vio];
    setViolations(updated);
    storage.saveViolations(updated);
  };

  const handleDeleteViolation = (id: string) => {
    const updated = violations.filter(v => v.id !== id);
    setViolations(updated);
    storage.saveViolations(updated);
  };

  // Facility Handlers
  const handleAddFacility = (facility: Facility) => {
    const updated = [...facilities, facility];
    setFacilities(updated);
    storage.saveFacilities(updated);
  };

  const handleUpdateFacility = (updatedFacility: Facility) => {
    const updated = facilities.map(f => f.id === updatedFacility.id ? updatedFacility : f);
    setFacilities(updated);
    storage.saveFacilities(updated);
  };

  const handleDeleteFacility = (id: string) => {
    if (confirm("Hapus data sarana ini?")) {
      const updated = facilities.filter(f => f.id !== id);
      setFacilities(updated);
      storage.saveFacilities(updated);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard students={students} grades={grades} teachers={teachers} />;
      case View.STUDENTS:
        return (
          <StudentManagement 
            students={students} 
            onAddStudent={handleAddStudent} 
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent} 
            onViewRecords={handleViewStudentRecords}
          />
        );
      case View.TEACHERS:
        return (
          <TeacherManagement 
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        );
      case View.RECORDS:
        return (
          <StudentRecords 
            students={students}
            achievements={achievements}
            violations={violations}
            onAddAchievement={handleAddAchievement}
            onDeleteAchievement={handleDeleteAchievement}
            onAddViolation={handleAddViolation}
            onDeleteViolation={handleDeleteViolation}
            initialStudentId={activeStudentId}
            onStudentSelect={setActiveStudentId}
          />
        );
      case View.FACILITIES:
        return (
          <FacilityManagement 
            facilities={facilities}
            onAddFacility={handleAddFacility}
            onUpdateFacility={handleUpdateFacility}
            onDeleteFacility={handleDeleteFacility}
          />
        );
      case View.AI_INSIGHTS:
        return <AIInsights students={students} grades={grades} />;
      default:
        return <Dashboard students={students} grades={grades} teachers={teachers} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar currentView={currentView} setView={setView} onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default App;
