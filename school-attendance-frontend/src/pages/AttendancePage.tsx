import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, AttendanceStatus, AttendanceViewDto, MarkAttendanceRequest } from '../types';
import { apiService } from '../services/api';

export const AttendancePage: React.FC = () => {
  const { role } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceViewDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for classes
  const classes = [
    { id: 1, name: 'Grade 10A', section: 'A' },
    { id: 2, name: 'Grade 10B', section: 'B' },
    { id: 3, name: 'Grade 9A', section: 'A' },
    { id: 4, name: 'Grade 9B', section: 'B' },
    { id: 5, name: 'Grade 8A', section: 'A' },
  ];

  // Mock students data
  const students = [
    { id: 1, name: 'John Doe', admissionNumber: 'ST001', classId: 1 },
    { id: 2, name: 'Jane Smith', admissionNumber: 'ST002', classId: 1 },
    { id: 3, name: 'Mike Johnson', admissionNumber: 'ST003', classId: 1 },
    { id: 4, name: 'Sarah Wilson', admissionNumber: 'ST004', classId: 2 },
    { id: 5, name: 'David Brown', admissionNumber: 'ST005', classId: 2 },
  ];

  // Mock attendance data
  const mockAttendanceData: AttendanceViewDto[] = [
    {
      attendanceId: 1,
      studentId: 1,
      classId: 1,
      date: selectedDate,
      status: 'Present',
      markedById: 1,
      remarks: ''
    },
    {
      attendanceId: 2,
      studentId: 2,
      classId: 1,
      date: selectedDate,
      status: 'Absent',
      markedById: 1,
      remarks: 'Sick'
    },
    {
      attendanceId: 3,
      studentId: 3,
      classId: 1,
      date: selectedDate,
      status: 'Late',
      markedById: 1,
      remarks: 'Traffic'
    }
  ];

  useEffect(() => {
    if (selectedClass) {
      loadAttendanceData();
    }
  }, [selectedDate, selectedClass]);

  const loadAttendanceData = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    try {
      // In a real app, this would call the API
      // const data = await apiService.getClassAttendanceByDate(selectedClass, selectedDate);
      setAttendanceData(mockAttendanceData);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Late':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Excused':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800';
      case 'Excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => 
    selectedClass ? student.classId === selectedClass : true
  ).filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canMarkAttendance = role === UserRole.Teacher || role === UserRole.Admin;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage student attendance records
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <select
              id="class"
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - Section {cls.section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="search"
                placeholder="Search by name or admission number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {canMarkAttendance && selectedClass && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowMarkForm(!showMarkForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Mark Attendance
            </button>
          </div>
        )}
      </div>

      {/* Attendance List */}
      {selectedClass ? (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Attendance for {classes.find(c => c.id === selectedClass)?.name} - {selectedDate}
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admission Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
                      </th>
                      {canMarkAttendance && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => {
                      const attendance = attendanceData.find(a => a.studentId === student.id);
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.admissionNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {attendance ? (
                              <div className="flex items-center">
                                {getStatusIcon(attendance.status)}
                                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(attendance.status)}`}>
                                  {attendance.status}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">Not marked</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attendance?.remarks || '-'}
                          </td>
                          {canMarkAttendance && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900">
                                Edit
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No class selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please select a class to view attendance records.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      {selectedClass && attendanceData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Present
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {attendanceData.filter(a => a.status === 'Present').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Absent
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {attendanceData.filter(a => a.status === 'Absent').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Late
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {attendanceData.filter(a => a.status === 'Late').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Excused
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {attendanceData.filter(a => a.status === 'Excused').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};