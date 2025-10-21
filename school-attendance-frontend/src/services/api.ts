import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  AttendanceViewDto, 
  MarkAttendanceRequest,
  User 
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://localhost:7000/api'; // Update this to match your API URL

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
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
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<string> = await this.api.post('/auth/login', credentials);
    return {
      token: response.data,
      user: JSON.parse(localStorage.getItem('user') || '{}')
    };
  }

  // Attendance endpoints
  async markAttendance(request: MarkAttendanceRequest): Promise<AttendanceViewDto> {
    const response: AxiosResponse<AttendanceViewDto> = await this.api.post('/attendance/mark', request);
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

  // Helper method to set teacher ID for attendance marking
  setTeacherId(teacherId: number): void {
    this.api.defaults.headers.common['X-Teacher-Id'] = teacherId.toString();
  }
}

export const apiService = new ApiService();