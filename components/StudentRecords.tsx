
import React, { useState, useEffect } from 'react';
import { Student, Achievement, Violation } from '../types';

interface StudentRecordsProps {
  students: Student[];
  achievements: Achievement[];
  violations: Violation[];
  onAddAchievement: (a: Achievement) => void;
  onDeleteAchievement: (id: string) => void;
  onAddViolation: (v: Violation) => void;
  onDeleteViolation: (id: string) => void;
  initialStudentId?: string;
  onStudentSelect: (id: string) => void;
}

const StudentRecords: React.FC<StudentRecordsProps> = ({
  students,
  achievements,
  violations,
  onAddAchievement,
  onDeleteAchievement,
  onAddViolation,
  onDeleteViolation,
  initialStudentId = '',
  onStudentSelect
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);
  const [activeTab, setActiveTab] = useState<'prestasi' | 'pelanggaran'>('prestasi');
  
  // State Form Prestasi
  const [achTitle, setAchTitle] = useState('');
  const [achOrg, setAchOrg] = useState('');
  const [achYear, setAchYear] = useState('');

  // State Form Pelanggaran
  const [vioDesc, setVioDesc] = useState('');
  const [vioDate, setVioDate] = useState('');
  const [vioSanc, setVioSanc] = useState('');

  useEffect(() => {
    setSelectedStudentId(initialStudentId);
  }, [initialStudentId]);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const studentAchievements = achievements.filter(a => a.studentId === selectedStudentId);
  const studentViolations = violations.filter(v => v.studentId === selectedStudentId);

  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    onStudentSelect(id);
  };

  const handleAddAch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !achTitle) return;
    onAddAchievement({
      id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudentId,
      title: achTitle,
      organizer: achOrg,
      year: achYear
    });
    setAchTitle(''); setAchOrg(''); setAchYear('');
  };

  const handleAddVio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !vioDesc) return;
    onAddViolation({
      id: Math.random().toString(36).substr(2, 9),
      studentId: selectedStudentId,
      description: vioDesc,
      date: vioDate,
      sanction: vioSanc
    });
    setVioDesc(''); setVioDate(''); setVioSanc('');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Catatan Siswa</h2>
        <p className="text-slate-500">Kelola riwayat prestasi dan kedisiplinan siswa yang tersinkronisasi.</p>
      </header>

      {/* Selector Siswa */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pilih Siswa</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-slate-700 font-semibold"
            value={selectedStudentId}
            onChange={(e) => handleStudentChange(e.target.value)}
          >
            <option value="">-- Cari Nama Siswa / NISN --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.classRoom})</option>
            ))}
          </select>
        </div>
        {selectedStudent && (
          <div className="flex items-center gap-3 px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
               {selectedStudent.name.charAt(0)}
            </div>
            <div>
               <p className="text-[10px] font-black text-indigo-400 uppercase">Siswa Terpilih</p>
               <p className="text-sm font-bold text-indigo-900 leading-tight">{selectedStudent.name}</p>
            </div>
          </div>
        )}
      </div>

      {selectedStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Ringkas Profil */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black mx-auto mb-4 shadow-xl shadow-indigo-200">
                  {selectedStudent.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{selectedStudent.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{selectedStudent.classRoom} • {selectedStudent.major}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                    <p className="text-2xl font-black text-green-600">{studentAchievements.length}</p>
                    <p className="text-[9px] font-black text-green-700 uppercase tracking-widest">Prestasi</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <p className="text-2xl font-black text-red-600">{studentViolations.length}</p>
                    <p className="text-[9px] font-black text-red-700 uppercase tracking-widest">Pelanggaran</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 text-left space-y-3">
                   <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase">NISN</span>
                      <span className="text-slate-700 font-mono">{selectedStudent.nisn}</span>
                   </div>
                   <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400 uppercase">NIS Sekolah</span>
                      <span className="text-slate-700 font-mono">131232100028{selectedStudent.nisSuffix}</span>
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50"></div>
            </div>

            <div className="bg-indigo-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden">
              <h4 className="font-bold text-lg mb-2 relative z-10">Sinkronisasi Data</h4>
              <p className="text-xs text-indigo-200 leading-relaxed relative z-10">
                Data prestasi dan pelanggaran yang diinput pada menu ini akan otomatis terakumulasi dalam profil siswa di database utama sekolah.
              </p>
              <svg className="w-24 h-24 absolute -bottom-4 -right-4 text-white/5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>

          {/* Konten Tab */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              <button
                onClick={() => setActiveTab('prestasi')}
                className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'prestasi' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Data Prestasi
              </button>
              <button
                onClick={() => setActiveTab('pelanggaran')}
                className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === 'pelanggaran' ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Data Pelanggaran
              </button>
            </div>

            {activeTab === 'prestasi' ? (
              <div className="space-y-6 animate-fadeIn">
                <form onSubmit={handleAddAch} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500"></div> Tambah Prestasi Baru
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nama Prestasi / Juara</label>
                      <input type="text" required value={achTitle} onChange={e => setAchTitle(e.target.value)} className="w-full px-6 py-4 text-sm font-bold border-2 border-slate-50 bg-slate-50 rounded-2xl outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="Juara 1 Lomba Debat Bahasa Inggris" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Lembaga Penyelenggara</label>
                      <input type="text" value={achOrg} onChange={e => setAchOrg(e.target.value)} className="w-full px-6 py-4 text-sm font-bold border-2 border-slate-50 bg-slate-50 rounded-2xl outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="Dinas Pendidikan Prov." />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Tahun Pelaksanaan</label>
                      <input type="text" value={achYear} onChange={e => setAchYear(e.target.value)} className="w-full px-6 py-4 text-sm font-bold border-2 border-slate-50 bg-slate-50 rounded-2xl outline-none focus:border-green-500 focus:bg-white transition-all" placeholder="2024" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95">
                    Simpan Prestasi Siswa
                  </button>
                </form>

                <div className="space-y-4">
                  {studentAchievements.map(a => (
                    <div key={a.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-green-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800">{a.title}</h5>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{a.organizer} • {a.year}</p>
                        </div>
                      </div>
                      <button onClick={() => onDeleteAchievement(a.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  {studentAchievements.length === 0 && (
                    <div className="text-center py-12 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem]">
                       <p className="text-slate-400 font-bold italic text-sm">Belum ada catatan prestasi untuk siswa ini.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <form onSubmit={handleAddVio} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500"></div> Tambah Pelanggaran Baru
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Deskripsi Pelanggaran</label>
                      <input type="text" required value={vioDesc} onChange={e => setVioDesc(e.target.value)} className="w-full px-6 py-4 text-sm font-bold border-2 border-slate-50 bg-slate-50 rounded-2xl outline-none focus:border-red-500 focus:bg-white transition-all" placeholder="Terlambat masuk sekolah (>3x)" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Tanggal Kejadian</label>
                      <input type="date" value={vioDate} onChange={e => setVioDate(e.target.value)} className="w-full px-6 py-4 text-sm font-bold border-2 border-slate-50 bg-slate-50 rounded-2xl outline-none focus:border-red-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Sanksi Diberikan</label>
                      <input type="text" value={vioSanc} onChange={e => setVioSanc(e.target.value)} className="w-full px-6 py-4 text-sm font-bold border-2 border-slate-50 bg-slate-50 rounded-2xl outline-none focus:border-red-500 focus:bg-white transition-all" placeholder="Point 5 / Skorsing" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95">
                    Catat Pelanggaran Kedisiplinan
                  </button>
                </form>

                <div className="space-y-4">
                  {studentViolations.map(v => (
                    <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center group border-l-8 border-l-red-500 hover:border-red-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800">{v.description}</h5>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                             Tanggal: {v.date} • Sanksi: <span className="text-red-600">{v.sanction}</span>
                          </p>
                        </div>
                      </div>
                      <button onClick={() => onDeleteViolation(v.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  {studentViolations.length === 0 && (
                    <div className="text-center py-12 px-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem]">
                       <p className="text-slate-400 font-bold italic text-sm">Siswa ini tidak memiliki catatan pelanggaran.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-6">
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-300 shadow-inner">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Pilih Siswa</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Silakan cari nama siswa pada menu pilihan di atas untuk melihat sinkronisasi data prestasi dan pelanggaran secara mendetail.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRecords;
