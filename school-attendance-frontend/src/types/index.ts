// Enums
export enum UserRole {
  Admin = 0,
  Teacher = 1,
  Student = 2,
  Parent = 3
}

export enum AttendanceStatus {
  Present = 0,
  Absent = 1,
  Late = 2,
  Excused = 3
}

// Core Models
export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  linkedId?: number;
  status?: string;
}

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
  attendanceRecords?: Attendance[];
}

export interface Teacher {
  teacherId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subjectSpecialization?: string;
  userId: number;
  user?: User;
  subjects?: Subject[];
  classTeacherOf?: Class[];
}

export interface Parent {
  parentId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  userId: number;
  user?: User;
  students?: Student[];
}

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

export interface Subject {
  subjectId: number;
  subjectName: string;
  classId: number;
  teacherId: number;
  class?: Class;
  teacher?: Teacher;
}

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

// DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

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

// UI State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface AttendanceFormData {
  studentId: number;
  classId: number;
  subjectId?: number;
  date: string;
  status: string;
  remarks: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}