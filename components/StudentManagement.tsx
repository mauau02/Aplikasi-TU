
import React, { useState } from 'react';
import { Student, Major, ParentStatus } from '../types';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewRecords: (id: string) => void;
}

const NIS_PREFIX = "131232100028";

const CLASS_OPTIONS = [
  'X 1', 'X 2', 'X 3', 'X 4', 'X 5', 'X 6',
  'XI 1', 'XI 2', 'XI 3', 'XI 4', 'XI 5', 'XI 6',
  'XII 1', 'XII 2', 'XII 3', 'XII 4', 'XII 5', 'XII 6'
];

const PARENT_STATUS_OPTIONS: ParentStatus[] = ['Hidup', 'Meninggal', 'Cerai Hidup', 'Cerai Mati'];

const StudentManagement: React.FC<StudentManagementProps> = ({ 
  students, 
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent,
  onViewRecords
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormData: Partial<Student> = {
    name: '',
    nisn: '',
    nisSuffix: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki',
    weight: 0,
    height: 0,
    residenceStreet: '',
    residenceRT: '',
    residenceRW: '',
    residenceVillage: '',
    residenceDistrict: '',
    residenceCity: '',
    residenceProvince: '',
    familyKK: '',
    
    // Ibu
    motherName: '',
    motherNIK: '',
    motherBirthPlace: '',
    motherBirthDate: '',
    motherJob: '',
    motherEducation: '',
    motherIncome: '',
    motherStatus: 'Hidup',
    
    // Ayah
    fatherName: '',
    fatherNIK: '',
    fatherBirthPlace: '',
    fatherBirthDate: '',
    fatherJob: '',
    fatherEducation: '',
    fatherIncome: '',
    fatherStatus: 'Hidup',
    
    // Wali
    guardianName: '',
    guardianNIK: '',
    guardianBirthPlace: '',
    guardianBirthDate: '',
    guardianJob: '',
    guardianEducation: '',
    guardianIncome: '',
    guardianStatus: 'Hidup',
    
    // Alamat Ortu
    familyStreet: '',
    familyRT: '',
    familyRW: '',
    familyVillage: '',
    familyDistrict: '',
    familyCity: '',
    familyProvince: '',
    
    classRoom: 'X 1',
    major: 'IPA',
    entryYear: new Date().getFullYear(),
  };

  const [formData, setFormData] = useState<Partial<Student>>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
  };

  const handleEdit = (student: Student) => {
    setFormData(student);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.nisn && formData.nisSuffix?.length === 6) {
      if (isEditing) {
        onUpdateStudent(formData as Student);
      } else {
        onAddStudent({
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
        } as Student);
      }
      setShowModal(false);
      resetForm();
    } else {
      alert("Mohon lengkapi Nama, NISN, dan 6 digit NIS manual.");
    }
  };

  const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-slate-100 mt-10 first:mt-0">
      <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">{icon}</div>
      <h4 className="text-base font-black text-slate-800 uppercase tracking-tight">{title}</h4>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Data Siswa</h2>
          <p className="text-slate-500 font-medium">Kelola informasi akademik dan data keluarga secara terpusat.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Input Siswa Baru
        </button>
      </header>

      {/* Tabel Utama */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400">
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest">Siswa</th>
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest">NIS / NISN</th>
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest">Kelas</th>
                <th className="px-10 py-6 text-xs font-bold uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.length > 0 ? students.map((student) => (
                <tr key={student.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{student.gender} • {student.major}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <div className="text-sm font-black text-indigo-600">{NIS_PREFIX}{student.nisSuffix}</div>
                    <div className="text-xs text-slate-400 font-mono">{student.nisn}</div>
                  </td>
                  <td className="px-10 py-5">
                    <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-black">{student.classRoom}</span>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onViewRecords(student.id)} 
                        className="px-4 py-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-all text-xs font-black uppercase flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Catatan
                      </button>
                      <button onClick={() => handleEdit(student)} className="p-3 bg-white border border-slate-200 text-indigo-600 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => onDeleteStudent(student.id)} className="p-3 bg-white border border-slate-200 text-red-600 rounded-2xl hover:border-red-600 hover:bg-red-50 transition-all shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="max-w-xs mx-auto text-slate-400">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <p className="text-lg font-bold">Belum ada siswa</p>
                      <p className="text-sm">Klik tombol di atas untuk menginput data pertama.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
            <div className="px-12 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-3xl font-black text-slate-800">{isEditing ? 'Edit Data Siswa' : 'Input Data Siswa'}</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Formulir Pendataan Terintegrasi</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-14 h-14 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm group">
                <svg className="w-8 h-8 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar bg-white">
              
              {/* SECTION: IDENTITAS */}
              <section>
                <SectionHeader title="A. Identitas Pribadi & Fisik" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nama Lengkap Siswa</label>
                    <input type="text" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold text-slate-800 transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">NIS (6 Digit Manual)</label>
                    <div className="flex">
                      <span className="bg-slate-200 px-4 py-4 rounded-l-2xl text-[10px] font-black text-slate-500 border-2 border-r-0 border-slate-100">{NIS_PREFIX}</span>
                      <input type="text" required maxLength={6} className="flex-1 px-4 py-4 rounded-r-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-mono font-bold text-indigo-600" value={formData.nisSuffix} onChange={e => setFormData({ ...formData, nisSuffix: e.target.value.replace(/\D/g,'') })} />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">NISN (10 Digit)</label>
                    <input type="text" required maxLength={10} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-mono font-bold" value={formData.nisn} onChange={e => setFormData({ ...formData, nisn: e.target.value.replace(/\D/g,'') })} />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Jenis Kelamin</label>
                    <div className="flex gap-3">
                      {['Laki-laki', 'Perempuan'].map(jk => (
                        <button key={jk} type="button" onClick={() => setFormData({ ...formData, gender: jk as any })} className={`flex-1 py-4 rounded-2xl text-xs font-black border-2 transition-all ${formData.gender === jk ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}>
                          {jk}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Tempat Lahir</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.birthPlace} onChange={e => setFormData({ ...formData, birthPlace: e.target.value })} />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Tanggal Lahir</label>
                    <input type="date" required className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold" value={formData.birthDate} onChange={e => setFormData({ ...formData, birthDate: e.target.value })} />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Berat Badan (Kg)</label>
                    <input type="number" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.weight} onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Tinggi Badan (Cm)</label>
                    <input type="number" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.height} onChange={e => setFormData({ ...formData, height: Number(e.target.value) })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Kelas</label>
                    <select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold" value={formData.classRoom} onChange={e => setFormData({ ...formData, classRoom: e.target.value })}>
                      {CLASS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Jurusan</label>
                    <select className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold" value={formData.major} onChange={e => setFormData({ ...formData, major: e.target.value as any })}>
                      <option value="IPA">IPA</option>
                      <option value="IPS">IPS</option>
                      <option value="Bahasa">Bahasa</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* SECTION: ALAMAT SISWA */}
              <section>
                <SectionHeader title="B. Alamat Domisili Siswa" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Blok atau Jalan</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.residenceStreet} onChange={e => setFormData({ ...formData, residenceStreet: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">RT</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.residenceRT} onChange={e => setFormData({ ...formData, residenceRT: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">RW</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.residenceRW} onChange={e => setFormData({ ...formData, residenceRW: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Desa/Kelurahan</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.residenceVillage} onChange={e => setFormData({ ...formData, residenceVillage: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Kecamatan</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.residenceDistrict} onChange={e => setFormData({ ...formData, residenceDistrict: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Kabupaten/Kota</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.residenceCity} onChange={e => setFormData({ ...formData, residenceCity: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Provinsi</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.residenceProvince} onChange={e => setFormData({ ...formData, residenceProvince: e.target.value })} />
                  </div>
                </div>
              </section>

              {/* SECTION: DATA KELUARGA */}
              <section>
                <SectionHeader title="C. Data Keluarga & Orang Tua" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                <div className="space-y-12">
                  <div className="md:col-span-12 max-w-md">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nomor Kartu Keluarga (KK)</label>
                    <input type="text" maxLength={16} className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-black tracking-widest text-indigo-900" value={formData.familyKK} onChange={e => setFormData({ ...formData, familyKK: e.target.value })} />
                  </div>

                  {/* FORM IBU */}
                  <div className="bg-pink-50/30 p-10 rounded-[2.5rem] border-2 border-pink-100 space-y-6">
                    <h5 className="font-black text-pink-600 text-sm uppercase tracking-widest flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-pink-500"></div> Data Ibu Kandung
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input type="text" placeholder="Nama Lengkap Ibu" className="px-6 py-4 rounded-2xl border-2 border-white bg-white font-bold" value={formData.motherName} onChange={e => setFormData({ ...formData, motherName: e.target.value })} />
                      <input type="text" placeholder="NIK Ibu" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.motherNIK} onChange={e => setFormData({ ...formData, motherNIK: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Tpt Lahir" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.motherBirthPlace} onChange={e => setFormData({ ...formData, motherBirthPlace: e.target.value })} />
                        <input type="date" className="px-4 py-4 rounded-2xl border-2 border-white bg-white text-xs" value={formData.motherBirthDate} onChange={e => setFormData({ ...formData, motherBirthDate: e.target.value })} />
                      </div>
                      <input type="text" placeholder="Pekerjaan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.motherJob} onChange={e => setFormData({ ...formData, motherJob: e.target.value })} />
                      <input type="text" placeholder="Pendidikan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.motherEducation} onChange={e => setFormData({ ...formData, motherEducation: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Penghasilan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.motherIncome} onChange={e => setFormData({ ...formData, motherIncome: e.target.value })} />
                        <select className="px-6 py-4 rounded-2xl border-2 border-white bg-white text-xs font-black" value={formData.motherStatus} onChange={e => setFormData({ ...formData, motherStatus: e.target.value as any })}>
                          {PARENT_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FORM AYAH */}
                  <div className="bg-blue-50/30 p-10 rounded-[2.5rem] border-2 border-blue-100 space-y-6">
                    <h5 className="font-black text-blue-600 text-sm uppercase tracking-widest flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-blue-500"></div> Data Ayah Kandung
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input type="text" placeholder="Nama Lengkap Ayah" className="px-6 py-4 rounded-2xl border-2 border-white bg-white font-bold" value={formData.fatherName} onChange={e => setFormData({ ...formData, fatherName: e.target.value })} />
                      <input type="text" placeholder="NIK Ayah" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.fatherNIK} onChange={e => setFormData({ ...formData, fatherNIK: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Tpt Lahir" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.fatherBirthPlace} onChange={e => setFormData({ ...formData, fatherBirthPlace: e.target.value })} />
                        <input type="date" className="px-4 py-4 rounded-2xl border-2 border-white bg-white text-xs" value={formData.fatherBirthDate} onChange={e => setFormData({ ...formData, fatherBirthDate: e.target.value })} />
                      </div>
                      <input type="text" placeholder="Pekerjaan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.fatherJob} onChange={e => setFormData({ ...formData, fatherJob: e.target.value })} />
                      <input type="text" placeholder="Pendidikan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.fatherEducation} onChange={e => setFormData({ ...formData, fatherEducation: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Penghasilan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.fatherIncome} onChange={e => setFormData({ ...formData, fatherIncome: e.target.value })} />
                        <select className="px-6 py-4 rounded-2xl border-2 border-white bg-white text-xs font-black" value={formData.fatherStatus} onChange={e => setFormData({ ...formData, fatherStatus: e.target.value as any })}>
                          {PARENT_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* FORM WALI */}
                  <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-100 space-y-6">
                    <h5 className="font-black text-slate-600 text-sm uppercase tracking-widest flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-slate-500"></div> Data Wali (Opsional)
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <input type="text" placeholder="Nama Lengkap Wali" className="px-6 py-4 rounded-2xl border-2 border-white bg-white font-bold" value={formData.guardianName} onChange={e => setFormData({ ...formData, guardianName: e.target.value })} />
                      <input type="text" placeholder="NIK Wali" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.guardianNIK} onChange={e => setFormData({ ...formData, guardianNIK: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Tpt Lahir" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.guardianBirthPlace} onChange={e => setFormData({ ...formData, guardianBirthPlace: e.target.value })} />
                        <input type="date" className="px-4 py-4 rounded-2xl border-2 border-white bg-white text-xs" value={formData.guardianBirthDate} onChange={e => setFormData({ ...formData, guardianBirthDate: e.target.value })} />
                      </div>
                      <input type="text" placeholder="Pekerjaan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.guardianJob} onChange={e => setFormData({ ...formData, guardianJob: e.target.value })} />
                      <input type="text" placeholder="Pendidikan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.guardianEducation} onChange={e => setFormData({ ...formData, guardianEducation: e.target.value })} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Penghasilan" className="px-6 py-4 rounded-2xl border-2 border-white bg-white" value={formData.guardianIncome} onChange={e => setFormData({ ...formData, guardianIncome: e.target.value })} />
                        <select className="px-6 py-4 rounded-2xl border-2 border-white bg-white text-xs font-black" value={formData.guardianStatus} onChange={e => setFormData({ ...formData, guardianStatus: e.target.value as any })}>
                          {PARENT_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: ALAMAT ORTU */}
              <section>
                <SectionHeader title="D. Alamat Orang Tua / Wali" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-6">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Blok atau Jalan (Ortu)</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.familyStreet} onChange={e => setFormData({ ...formData, familyStreet: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">RT</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.familyRT} onChange={e => setFormData({ ...formData, familyRT: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">RW</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.familyRW} onChange={e => setFormData({ ...formData, familyRW: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Desa/Kelurahan</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.familyVillage} onChange={e => setFormData({ ...formData, familyVillage: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Kecamatan</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.familyDistrict} onChange={e => setFormData({ ...formData, familyDistrict: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Kabupaten/Kota</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.familyCity} onChange={e => setFormData({ ...formData, familyCity: e.target.value })} />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Provinsi</label>
                    <input type="text" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50" value={formData.familyProvince} onChange={e => setFormData({ ...formData, familyProvince: e.target.value })} />
                  </div>
                </div>
              </section>

              {/* FOOTER: SIMPAN */}
              <div className="pt-10 border-t-2 border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md pb-4">
                <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-2xl hover:bg-indigo-700 shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {isEditing ? 'Simpan Perubahan Profil' : 'Simpan Profil Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
