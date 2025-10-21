// User and Authentication Types
export interface User {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
  linkedId?: number;
  status?: string;
}

export const UserRole = {
  Admin: 0,
  Teacher: 1,
  Student: 2,
  Parent: 3
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Student Types
export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  parentId: number;
  classId: number;
  userId: number;
  parent?: Parent;
  class?: Class;
  user?: User;
}

// Teacher Types
export interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subjectSpecialization?: string;
  userId: number;
  user?: User;
}

// Class Types
export interface Class {
  classId: number;
  className: string;
  classTeacherId?: number;
  academicYear?: string;
  section?: string;
  classTeacher?: Teacher;
  students?: Student[];
  subjects?: Subject[];
}

// Subject Types
export interface Subject {
  subjectId: number;
  subjectName: string;
  classId: number;
  teacherId?: number;
  class?: Class;
  teacher?: Teacher;
}

// Parent Types
export interface Parent {
  parentId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  userId: number;
  user?: User;
}

// Attendance Types
export interface Attendance {
  attendanceId: number;
  studentId: number;
  classId: number;
  subjectId?: number;
  date: string;
  status: AttendanceStatus;
  markedById: number;
  remarks?: string;
  student?: Student;
  class?: Class;
  subject?: Subject;
  markedBy?: Teacher;
}

export const AttendanceStatus = {
  Present: 0,
  Absent: 1,
  Late: 2,
  Excused: 3
} as const;

export type AttendanceStatus = typeof AttendanceStatus[keyof typeof AttendanceStatus];

export interface MarkAttendanceRequest {
  studentId: number;
  classId: number;
  subjectId?: number;
  date: string;
  status: string;
  remarks?: string;
}

export interface AttendanceViewDto {
  attendanceId: number;
  studentId: number;
  classId: number;
  subjectId?: number;
  date: string;
  status: string;
  markedById: number;
  remarks?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Form Types
export interface AttendanceFormData {
  studentId: number;
  classId: number;
  subjectId?: number;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

// Filter Types
export interface AttendanceFilter {
  classId?: number;
  date?: string;
  status?: AttendanceStatus;
  studentId?: number;
}