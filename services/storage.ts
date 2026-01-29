
import { Student, Grade, Teacher, Achievement, Violation, Facility } from '../types';

const KEYS = {
  STUDENTS: 'sma_students',
  GRADES: 'sma_grades',
  TEACHERS: 'sma_teachers',
  ACHIEVEMENTS: 'sma_achievements',
  VIOLATIONS: 'sma_violations',
  FACILITIES: 'sma_facilities'
};

export const storage = {
  getStudents: (): Student[] => {
    const data = localStorage.getItem(KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },
  saveStudents: (students: Student[]) => {
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  },
  getGrades: (): Grade[] => {
    const data = localStorage.getItem(KEYS.GRADES);
    return data ? JSON.parse(data) : [];
  },
  saveGrades: (grades: Grade[]) => {
    localStorage.setItem(KEYS.GRADES, JSON.stringify(grades));
  },
  getTeachers: (): Teacher[] => {
    const data = localStorage.getItem(KEYS.TEACHERS);
    return data ? JSON.parse(data) : [];
  },
  saveTeachers: (teachers: Teacher[]) => {
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
  },
  getAchievements: (): Achievement[] => {
    const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
  },
  saveAchievements: (achievements: Achievement[]) => {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },
  getViolations: (): Violation[] => {
    const data = localStorage.getItem(KEYS.VIOLATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveViolations: (violations: Violation[]) => {
    localStorage.setItem(KEYS.VIOLATIONS, JSON.stringify(violations));
  },
  getFacilities: (): Facility[] => {
    const data = localStorage.getItem(KEYS.FACILITIES);
    return data ? JSON.parse(data) : [];
  },
  saveFacilities: (facilities: Facility[]) => {
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(facilities));
  }
};
