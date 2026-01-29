
import React, { useState } from 'react';
import { Teacher } from '../types';

interface TeacherManagementProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onUpdateTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
}

const POSITION_OPTIONS = [
  'Kepala Madrasah', 'Waka Kurikulum', 'Waka Kesiswaan', 'Waka Keguruan', 
  'Waka Sarpras', 'Kaur Tata Usaha', 'Staff Tata Usaha', 'Tim PTN Sukses', 
  'Kepala Pesantren', 'Pembina OSIS', 'Pembina Esktrakurikuler Pramuka', 
  'Pembina Esktrakurikuler Media', 'Pembina Esktrakurikuler Voli', 
  'Pembina Esktrakurikuler Futsal', 'Pembina Esktrakurikuler Hadroh', 
  'Pengurus Pesantren', 'Guru'
];

const TeacherManagement: React.FC<TeacherManagementProps> = ({ 
  teachers, 
  onAddTeacher, 
  onUpdateTeacher, 
  onDeleteTeacher 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subjectInput, setSubjectInput] = useState('');
  
  const initialFormData: Partial<Teacher> = {
    name: '',
    birthPlace: '',
    birthDate: '',
    nik: '',
    subjects: [],
    position: 'Guru',
    skFileName: '',
  };

  const [formData, setFormData] = useState<Partial<Teacher>>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setSubjectInput('');
  };

  const handleEdit = (teacher: Teacher) => {
    setFormData(teacher);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddSubject = () => {
    if (subjectInput.trim() && !formData.subjects?.includes(subjectInput.trim())) {
      setFormData({
        ...formData,
        subjects: [...(formData.subjects || []), subjectInput.trim()]
      });
      setSubjectInput('');
    }
  };

  const removeSubject = (index: number) => {
    const newSubjects = [...(formData.subjects || [])];
    newSubjects.splice(index, 1);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, skFileName: e.target.files[0].name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.nik) {
      if (isEditing) {
        onUpdateTeacher(formData as Teacher);
      } else {
        onAddTeacher({
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        } as Teacher);
      }
      setShowModal(false);
      resetForm();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Data Guru</h2>
          <p className="text-slate-500 font-medium">Manajemen tenaga pendidik dan jabatan fungsionaris.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Input Guru Baru
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400">
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest">Nama Guru</th>
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest">NIK</th>
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest">Jabatan</th>
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest">Mata Pelajaran</th>
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teachers.length > 0 ? teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-800">{teacher.name}</div>
                        <div className="text-xs text-slate-400 font-bold">{teacher.birthPlace}, {teacher.birthDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-5 font-mono text-xs text-slate-600 font-bold">{teacher.nik}</td>
                  <td className="px-10 py-5">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-tight">
                      {teacher.position}
                    </span>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {teacher.subjects.map((sub, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold border border-slate-200 uppercase">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(teacher)} className="p-3 bg-white border border-slate-200 text-indigo-600 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => onDeleteTeacher(teacher.id)} className="p-3 bg-white border border-slate-200 text-red-600 rounded-2xl hover:border-red-600 hover:bg-red-50 transition-all shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-slate-400 italic">Belum ada data guru.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
            <div className="px-12 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-800">{isEditing ? 'Edit Data Guru' : 'Input Data Guru'}</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Sistem Informasi Tenaga Pendidik</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 transition-all shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
              <section className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nama Lengkap Guru</label>
                    <input type="text" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold text-slate-800 transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">NIK (16 Digit)</label>
                    <input type="text" maxLength={16} required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-mono font-bold" value={formData.nik} onChange={e => setFormData({ ...formData, nik: e.target.value.replace(/\D/g,'') })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Tempat Lahir</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.birthPlace} onChange={e => setFormData({ ...formData, birthPlace: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Tanggal Lahir</label>
                    <input type="date" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold" value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Jabatan Fungsionaris</label>
                  <select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold text-slate-700" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })}>
                    {POSITION_OPTIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Mata Pelajaran Diampu</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 outline-none bg-slate-50 text-sm font-bold" 
                      placeholder="Contoh: Matematika" 
                      value={subjectInput}
                      onChange={e => setSubjectInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubject())}
                    />
                    <button type="button" onClick={handleAddSubject} className="bg-indigo-600 text-white px-6 rounded-2xl font-black">Tambah</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects?.map((sub, idx) => (
                      <div key={idx} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-indigo-100">
                        {sub}
                        <button type="button" onClick={() => removeSubject(idx)} className="text-red-500 hover:text-red-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    ))}
                    {formData.subjects?.length === 0 && <p className="text-[10px] text-slate-400 font-bold italic">Belum ada mata pelajaran ditambahkan.</p>}
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Upload SK Mengajar</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={handleFileChange}
                    />
                    <div className="w-full px-6 py-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
                      <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <p className="text-xs font-bold uppercase tracking-widest">{formData.skFileName || 'Pilih File SK (PDF/JPG)'}</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-10 border-t-2 border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md pb-4">
                <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-indigo-700 shadow-2xl transition-all active:scale-95">
                  {isEditing ? 'Simpan Perubahan Guru' : 'Simpan Data Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
