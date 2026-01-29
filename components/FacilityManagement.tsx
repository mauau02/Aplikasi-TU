
import React, { useState } from 'react';
import { Facility, FacilityType, FacilityCondition, FacilityState } from '../types';

interface FacilityManagementProps {
  facilities: Facility[];
  onAddFacility: (f: Facility) => void;
  onUpdateFacility: (f: Facility) => void;
  onDeleteFacility: (id: string) => void;
}

const FacilityManagement: React.FC<FacilityManagementProps> = ({
  facilities,
  onAddFacility,
  onUpdateFacility,
  onDeleteFacility
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialForm: Partial<Facility> = {
    type: 'Elektronik',
    brand: '',
    quantity: 1,
    code: '',
    photoUrl: '',
    purchaseYear: new Date().getFullYear().toString(),
    condition: 'Baru',
    state: 'Baik'
  };

  const [formData, setFormData] = useState<Partial<Facility>>(initialForm);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.brand && formData.code) {
      if (isEditing) {
        onUpdateFacility(formData as Facility);
      } else {
        onAddFacility({
          ...formData,
          id: Math.random().toString(36).substr(2, 9)
        } as Facility);
      }
      setShowModal(false);
      setFormData(initialForm);
      setIsEditing(false);
    }
  };

  const handleEdit = (facility: Facility) => {
    setFormData(facility);
    setIsEditing(true);
    setShowModal(true);
  };

  const getStateBadge = (state: FacilityState) => {
    switch (state) {
      case 'Baik': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rusak Sedang': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Rusak Berat': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sarana Prasarana</h2>
          <p className="text-slate-500 font-medium">Manajemen aset sekolah: inventarisasi, kondisi, dan pemeliharaan.</p>
        </div>
        <button
          onClick={() => { setFormData(initialForm); setIsEditing(false); setShowModal(true); }}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Input Sarpras Baru
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {facilities.map(item => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col">
            <div className="h-64 bg-slate-50 relative overflow-hidden">
              {item.photoUrl ? (
                <img src={item.photoUrl} alt={item.brand} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-200">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-md ${getStateBadge(item.state)}`}>
                  {item.state}
                </span>
                <span className="bg-white/90 backdrop-blur-md text-slate-800 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm">
                  {item.quantity} Unit
                </span>
              </div>
            </div>
            
            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">{item.type}</span>
                  <span className="text-xs font-mono font-bold text-slate-300">#{item.code}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{item.brand}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tahun Beli</p>
                  <p className="text-sm font-bold text-slate-700">{item.purchaseYear}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Keterangan</p>
                  <p className="text-sm font-bold text-slate-700">{item.condition}</p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                >
                  Edit Aset
                </button>
                <button 
                  onClick={() => onDeleteFacility(item.id)}
                  className="px-5 bg-white border-2 border-slate-100 text-red-500 py-4 rounded-2xl hover:bg-red-50 hover:border-red-100 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {facilities.length === 0 && (
          <div className="col-span-full py-40 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-300 uppercase tracking-widest">Gudang Kosong</h3>
            <p className="text-slate-400 font-medium mt-4 max-w-xs mx-auto">Mulai daftarkan sarana dan prasarana sekolah untuk mempermudah inventarisasi.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-5xl h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
            <div className="px-12 py-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">{isEditing ? 'Perbarui Aset' : 'Registrasi Aset'}</h3>
                <p className="text-indigo-500 font-black uppercase text-[10px] tracking-[0.3em] mt-2">EduManage Facility System</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-16 h-16 flex items-center justify-center bg-white border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-red-500 hover:rotate-90 transition-all shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Upload Foto & Preview */}
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dokumentasi Foto Barang</label>
                  <div className="relative group h-80">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={handlePhotoUpload}
                    />
                    <div className="w-full h-full rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center text-slate-300 group-hover:border-indigo-200 group-hover:bg-indigo-50/30 transition-all overflow-hidden relative">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-8">
                          <svg className="w-16 h-16 mb-4 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Ketuk untuk mengambil atau<br/>mengunggah foto aset</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-4 ml-1 tracking-widest">Kategori Sarana</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Elektronik', 'Mebeler', 'Bangunan'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: t as FacilityType })}
                          className={`py-4 rounded-2xl text-[10px] font-black border-2 transition-all ${formData.type === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Merek / Deskripsi Aset</label>
                      <input type="text" required className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold text-slate-700 transition-all" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="E.g. Laptop ASUS ROG Strix" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Jumlah (Unit)</label>
                      <input type="number" required min="1" className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-bold text-slate-700 transition-all text-center" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Kode Barang / Inventaris</label>
                    <input type="text" required className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-mono font-black text-indigo-600 uppercase tracking-widest transition-all" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="KODE-001/2024" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-50">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Tahun Pembelian</label>
                  <input type="text" className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-black text-slate-700" value={formData.purchaseYear} onChange={e => setFormData({ ...formData, purchaseYear: e.target.value })} placeholder="2024" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Keterangan Kondisi</label>
                  <select className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-black text-slate-700 cursor-pointer" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value as FacilityCondition })}>
                    <option value="Baru">Kondisi Baru (Gress)</option>
                    <option value="Bekas">Kondisi Bekas / Hibah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest">Keadaan Aset Saat Ini</label>
                  <select className="w-full px-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none bg-slate-50 font-black text-slate-700 cursor-pointer" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value as FacilityState })}>
                    <option value="Baik">Keadaan Baik & Layak</option>
                    <option value="Rusak Sedang">Keadaan Rusak Sedang</option>
                    <option value="Rusak Berat">Keadaan Rusak Berat / Afkir</option>
                  </select>
                </div>
              </div>

              <div className="pt-12 sticky bottom-0 bg-white/95 pb-4">
                <button type="submit" className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black text-2xl hover:bg-indigo-600 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-5">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  {isEditing ? 'Simpan Perubahan Aset' : 'Registrasi Aset Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityManagement;
