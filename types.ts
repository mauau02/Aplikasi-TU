
export enum View {
  DASHBOARD = 'dashboard',
  STUDENTS = 'students',
  TEACHERS = 'teachers',
  RECORDS = 'records',
  FACILITIES = 'facilities',
  AI_INSIGHTS = 'ai_insights'
}

export type Major = 'IPA' | 'IPS' | 'Bahasa';
export type StudentStatus = 'Baru' | 'Mutasi';
export type ParentStatus = 'Hidup' | 'Meninggal' | 'Cerai Hidup' | 'Cerai Mati';

export type FacilityType = 'Elektronik' | 'Mebeler' | 'Bangunan';
export type FacilityCondition = 'Baru' | 'Bekas';
export type FacilityState = 'Baik' | 'Rusak Sedang' | 'Rusak Berat';

export interface Facility {
  id: string;
  type: FacilityType;
  brand: string;
  quantity: number;
  code: string;
  photoUrl?: string;
  purchaseYear: string;
  condition: FacilityCondition;
  state: FacilityState;
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  organizer: string;
  year: string;
}

export interface Violation {
  id: string;
  studentId: string;
  description: string;
  date: string;
  sanction: string;
}

export interface Student {
  id: string;
  name: string;
  nisn: string;
  nisSuffix: string;
  birthPlace: string;
  birthDate: string;
  previousSchool: string;
  nik: string;
  
  // Tempat Tinggal Siswa
  residenceStreet: string;
  residenceRT: string;
  residenceRW: string;
  residenceVillage: string;
  residenceDistrict: string;
  residenceCity: string;
  residenceProvince: string;
  
  // Alamat Keluarga
  familyStreet: string;
  familyRT: string;
  familyRW: string;
  familyVillage: string;
  familyDistrict: string;
  familyCity: string;
  familyProvince: string;

  email: string;
  phone: string;
  childOrder: number;
  kipNumber: string;
  status: StudentStatus;
  weight: number;
  height: number;
  classRoom: string;
  major: Major;
  gender: 'Laki-laki' | 'Perempuan';
  entryYear: number;

  // Data Keluarga
  familyKK: string;
  
  // Ibu
  motherName: string;
  motherNIK: string;
  motherBirthPlace: string;
  motherBirthDate: string;
  motherJob: string;
  motherEducation: string;
  motherIncome: string;
  motherStatus: ParentStatus;

  // Ayah
  fatherName: string;
  fatherNIK: string;
  fatherBirthPlace: string;
  fatherBirthDate: string;
  fatherJob: string;
  fatherEducation: string;
  fatherIncome: string;
  fatherStatus: ParentStatus;

  // Wali
  guardianName: string;
  guardianNIK: string;
  guardianBirthPlace: string;
  guardianBirthDate: string;
  guardianJob: string;
  guardianEducation: string;
  guardianIncome: string;
  guardianStatus: ParentStatus;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  semester: string;
  academicYear: string;
}

export interface Teacher {
  id: string;
  name: string;
  birthPlace: string;
  birthDate: string;
  nik: string;
  subjects: string[];
  position: string;
  skFileName?: string;
}
