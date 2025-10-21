import { UserRole, AttendanceStatus } from '../types';

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.Admin:
      return 'Administrator';
    case UserRole.Teacher:
      return 'Teacher';
    case UserRole.Student:
      return 'Student';
    case UserRole.Parent:
      return 'Parent';
    default:
      return 'Unknown';
  }
};

export const getAttendanceStatusDisplayName = (status: AttendanceStatus | string): string => {
  switch (status) {
    case AttendanceStatus.Present:
    case 'Present':
      return 'Present';
    case AttendanceStatus.Absent:
    case 'Absent':
      return 'Absent';
    case AttendanceStatus.Late:
    case 'Late':
      return 'Late';
    case AttendanceStatus.Excused:
    case 'Excused':
      return 'Excused';
    default:
      return 'Unknown';
  }
};

export const getAttendanceStatusColor = (status: AttendanceStatus | string): string => {
  switch (status) {
    case AttendanceStatus.Present:
    case 'Present':
      return 'text-green-600 bg-green-100';
    case AttendanceStatus.Absent:
    case 'Absent':
      return 'text-red-600 bg-red-100';
    case AttendanceStatus.Late:
    case 'Late':
      return 'text-yellow-600 bg-yellow-100';
    case AttendanceStatus.Excused:
    case 'Excused':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getWeekDays = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

export const getMonthNames = (): string[] => {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};