
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Student, Grade, Teacher } from '../types';

interface DashboardProps {
  students: Student[];
  grades: Grade[];
  teachers: Teacher[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, grades, teachers }) => {
  const avgScore = grades.length > 0 ? (grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length).toFixed(1) : 0;
  
  const stats = [
    { label: 'Total Siswa', value: students.length, color: 'bg-blue-500', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Total Guru', value: teachers.length, color: 'bg-green-500', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Rerata Nilai', value: avgScore, color: 'bg-purple-500', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  const classData = [
    { name: 'Kelas X', count: students.filter(s => s.classRoom.startsWith('X ')).length },
    { name: 'Kelas XI', count: students.filter(s => s.classRoom.startsWith('XI ')).length },
    { name: 'Kelas XII', count: students.filter(s => s.classRoom.startsWith('XII ')).length },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6'];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Ringkasan Dashboard</h2>
        <p className="text-slate-500">Selamat datang kembali di panel administrasi EduManage.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-inner`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Distribusi Siswa per Jenjang</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-lg font-semibold mb-6">Guru Fungsionaris Terkini</h3>
          <div className="space-y-4">
            {teachers.slice(0, 5).map(teacher => (
              <div key={teacher.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                  {teacher.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{teacher.name}</p>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-tight">{teacher.position}</p>
                </div>
              </div>
            ))}
            {teachers.length === 0 && (
              <p className="text-center py-10 text-slate-400 text-sm italic">Belum ada data guru.</p>
            )}
          </div>
          <button className="w-full mt-6 py-2 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Lihat Semua Guru
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
