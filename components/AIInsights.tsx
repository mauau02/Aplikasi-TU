
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Student, Grade } from '../types';

interface AIInsightsProps {
  students: Student[];
  grades: Grade[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ students, grades }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const avg = grades.length > 0 ? grades.reduce((a, b) => a + b.score, 0) / grades.length : 0;
      
      const prompt = `Analisis data akademik SMA berikut: 
      Total Siswa: ${students.length}
      Total Nilai Tercatat: ${grades.length}
      Rata-rata Nilai: ${avg.toFixed(2)}
      
      Berikan ringkasan performa sekolah dalam Bahasa Indonesia yang profesional. Sebutkan area yang mungkin butuh perhatian (misal jika rata-rata rendah). Sertakan 3 saran peningkatan kualitas belajar mengajar.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReport(response.text || 'Gagal menghasilkan laporan.');
    } catch (err) {
      console.error(err);
      setReport('Maaf, terjadi kesalahan saat menghubungi AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-indigo-900 text-white p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-4">Gemini AI Insights</h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-xl">
            Gunakan kecerdasan buatan untuk menganalisis performa akademik siswa secara otomatis berdasarkan data terbaru.
          </p>
          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
                Menganalisis...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Buat Laporan Performa
              </>
            )}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full -mr-20 -mb-20 blur-3xl"></div>
      </div>

      {report && (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 animate-slideUp">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Laporan Analisis Akademik
          </h3>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
            {report}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
