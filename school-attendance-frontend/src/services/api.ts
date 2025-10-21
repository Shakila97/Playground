import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  LoginRequest, 
  AttendanceViewDto, 
  MarkAttendanceRequest,
  Student,
  Class,
  Teacher,
  Subject,
  Parent
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://localhost:7000/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<string> {
    const response: AxiosResponse<string> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  // Attendance endpoints
  async markAttendance(request: MarkAttendanceRequest, teacherId?: number): Promise<AttendanceViewDto> {
    const headers = teacherId ? { 'X-Teacher-Id': teacherId.toString() } : {};
    const response: AxiosResponse<AttendanceViewDto> = await this.api.post('/attendance/mark', request, { headers });
    return response.data;
  }

  async getStudentAttendance(studentId: number): Promise<AttendanceViewDto[]> {
    const response: AxiosResponse<AttendanceViewDto[]> = await this.api.get(`/attendance/student/${studentId}`);
    return response.data;
  }

  async getClassAttendanceByDate(classId: number, date: string): Promise<AttendanceViewDto[]> {
    const response: AxiosResponse<AttendanceViewDto[]> = await this.api.get(`/attendance/class/${classId}/date/${date}`);
    return response.data;
  }

  // Student endpoints (placeholder - would need to be implemented in backend)
  async getStudents(): Promise<Student[]> {
    const response: AxiosResponse<Student[]> = await this.api.get('/students');
    return response.data;
  }

  async getStudentById(studentId: number): Promise<Student> {
    const response: AxiosResponse<Student> = await this.api.get(`/students/${studentId}`);
    return response.data;
  }

  // Class endpoints (placeholder - would need to be implemented in backend)
  async getClasses(): Promise<Class[]> {
    const response: AxiosResponse<Class[]> = await this.api.get('/classes');
    return response.data;
  }

  async getClassById(classId: number): Promise<Class> {
    const response: AxiosResponse<Class> = await this.api.get(`/classes/${classId}`);
    return response.data;
  }

  // Teacher endpoints (placeholder - would need to be implemented in backend)
  async getTeachers(): Promise<Teacher[]> {
    const response: AxiosResponse<Teacher[]> = await this.api.get('/teachers');
    return response.data;
  }

  async getTeacherById(teacherId: number): Promise<Teacher> {
    const response: AxiosResponse<Teacher> = await this.api.get(`/teachers/${teacherId}`);
    return response.data;
  }

  // Subject endpoints (placeholder - would need to be implemented in backend)
  async getSubjects(): Promise<Subject[]> {
    const response: AxiosResponse<Subject[]> = await this.api.get('/subjects');
    return response.data;
  }

  async getSubjectsByClass(classId: number): Promise<Subject[]> {
    const response: AxiosResponse<Subject[]> = await this.api.get(`/subjects/class/${classId}`);
    return response.data;
  }

  // Parent endpoints (placeholder - would need to be implemented in backend)
  async getParents(): Promise<Parent[]> {
    const response: AxiosResponse<Parent[]> = await this.api.get('/parents');
    return response.data;
  }

  async getParentById(parentId: number): Promise<Parent> {
    const response: AxiosResponse<Parent> = await this.api.get(`/parents/${parentId}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;