
import React, { useState, useEffect, useRef } from 'react';
import { Student, Grade } from '../types';

interface GradeManagementProps {
  students: Student[];
  grades: Grade[];
  onAddGrade: (grade: Grade) => void;
}

const CLASS_OPTIONS = [
  'X 1', 'X 2', 'X 3', 'X 4', 'X 5', 'X 6',
  'XI 1', 'XI 2', 'XI 3', 'XI 4', 'XI 5', 'XI 6',
  'XII 1', 'XII 2', 'XII 3', 'XII 4', 'XII 5', 'XII 6'
];

const SUBJECT_OPTIONS = [
  'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 
  'Fisika', 'Kimia', 'Biologi', 'Ekonomi', 'Sosiologi', 'Geografi', 'Sejarah'
];

const GradeManagement: React.FC<GradeManagementProps> = ({ students, grades, onAddGrade }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0]);
  const [academicYear, setAcademicYear] = useState('2023/2024');
  const [semester, setSemester] = useState('Ganjil');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [tempScores, setTempScores] = useState<Record<string, number>>({});
  const filteredStudents = students.filter(s => s.classRoom === selectedClass);

  useEffect(() => {
    const initialScores: Record<string, number> = {};
    filteredStudents.forEach(s => {
      const existingGrade = grades.find(g => 
        g.studentId === s.id && 
        g.subject === selectedSubject && 
        g.semester === semester && 
        g.academicYear === academicYear
      );
      initialScores[s.id] = existingGrade ? existingGrade.score : 0;
    });
    setTempScores(initialScores);
  }, [selectedClass, selectedSubject, semester, academicYear, students]);

  const handleScoreChange = (studentId: string, score: number) => {
    const val = Math.min(100, Math.max(0, score));
    setTempScores(prev => ({ ...prev, [studentId]: val }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) {
      alert("Silakan pilih kelas terlebih dahulu");
      return;
    }

    filteredStudents.forEach(s => {
      onAddGrade({
        id: Math.random().toString(36).substr(2, 9),
        studentId: s.id,
        subject: selectedSubject,
        score: tempScores[s.id] || 0,
        semester,
        academicYear
      });
    });

    alert(`Berhasil menyimpan nilai ${selectedSubject} untuk kelas ${selectedClass}`);
  };

  const downloadTemplate = () => {
    if (!selectedClass) {
      alert("Pilih kelas terlebih dahulu untuk mengunduh template spesifik.");
      return;
    }

    const headers = ["NISN", "Nama", "Nilai"];
    const rows = filteredStudents.map(s => [s.nisn, s.name, tempScores[s.id] || 0]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Template_Nilai_${selectedClass.replace(' ', '_')}_${selectedSubject}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const newScores = { ...tempScores };
      
      // Skip header (i=1)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [nisn, name, scoreStr] = line.split(",");
        const score = parseInt(scoreStr);
        
        // Cari siswa berdasarkan NISN di kelas terpilih
        const student = filteredStudents.find(s => s.nisn === nisn);
        if (student && !isNaN(score)) {
          newScores[student.id] = Math.min(100, Math.max(0, score));
        }
      }
      
      setTempScores(newScores);
      alert("Data dari file berhasil dimuat ke tabel. Silakan periksa dan klik Simpan Nilai Kelas.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Input Nilai Kolektif</h2>
          <p className="text-slate-500">Gunakan form di bawah atau unggah template untuk efisiensi.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            disabled={!selectedClass}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Unduh Template
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedClass}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-all disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Nilai (CSV)
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv" 
            className="hidden" 
          />
        </div>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Pilih Kelas</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-sm font-semibold"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            <option value="">-- Pilih Kelas --</option>
            {CLASS_OPTIONS.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mata Pelajaran</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-sm font-semibold"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
          >
            {SUBJECT_OPTIONS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Semester / TA</label>
          <div className="flex gap-2">
            <select
              className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-sm font-semibold"
              value={semester}
              onChange={e => setSemester(e.target.value)}
            >
              <option>Ganjil</option>
              <option>Genap</option>
            </select>
            <select
              className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-sm font-semibold"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
            >
              <option>2023/2024</option>
              <option>2024/2025</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveAll}
            disabled={!selectedClass || filteredStudents.length === 0}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Simpan Nilai Kelas
          </button>
        </div>
      </div>

      {selectedClass ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Daftar Siswa Kelas {selectedClass}</h3>
              <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">Total: {filteredStudents.length} Siswa</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 border-b border-slate-100">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">No</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">NISN</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Nama Lengkap</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-center w-40">Nilai (0-100)</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => {
                    const score = tempScores[student.id] || 0;
                    let badgeColor = 'bg-slate-100 text-slate-600';
                    let predikat = 'E';
                    
                    if (score >= 85) { predikat = 'A'; badgeColor = 'bg-green-100 text-green-700'; }
                    else if (score >= 75) { predikat = 'B'; badgeColor = 'bg-blue-100 text-blue-700'; }
                    else if (score >= 60) { predikat = 'C'; badgeColor = 'bg-orange-100 text-orange-700'; }
                    else if (score > 0) { predikat = 'D'; badgeColor = 'bg-red-100 text-red-700'; }

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 text-sm font-medium text-slate-400">{index + 1}</td>
                        <td className="px-8 py-4 text-xs font-mono text-slate-500">{student.nisn}</td>
                        <td className="px-8 py-4 text-sm font-bold text-slate-800">{student.name}</td>
                        <td className="px-8 py-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-24 text-center px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600"
                            value={score}
                            onChange={e => handleScoreChange(student.id, Number(e.target.value))}
                          />
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${badgeColor}`}>
                            {predikat} ({score >= 75 ? 'LULUS' : 'TIDAK LULUS'})
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 italic font-medium">
                      Tidak ada siswa yang terdaftar di kelas ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-400">Pilih Kelas Terlebih Dahulu</h4>
            <p className="text-slate-400 text-sm">Silakan pilih kelas pada filter di atas untuk memulai pengisian nilai atau mengunduh template.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeManagement;
