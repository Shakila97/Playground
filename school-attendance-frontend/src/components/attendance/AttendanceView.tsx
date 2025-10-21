import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { AttendanceViewDto, Class, Student } from '../../types';
import { AttendanceStatus } from '../../types';
import { formatDate, getAttendanceStatusDisplayName, getAttendanceStatusColor } from '../../utils/helpers';
import { Calendar, Users, Eye, Filter, Download, Search } from 'lucide-react';

const AttendanceView: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceViewDto[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'class' | 'student'>('class');

  // Mock data - in a real app, this would come from the API
  useEffect(() => {
    const mockClasses: Class[] = [
      { classId: 1, className: 'Grade 10A', section: 'A', academicYear: '2024' },
      { classId: 2, className: 'Grade 10B', section: 'B', academicYear: '2024' },
      { classId: 3, className: 'Grade 11A', section: 'A', academicYear: '2024' },
    ];

    const mockStudents: Student[] = [
      { studentId: 1, firstName: 'John', lastName: 'Doe', admissionNumber: 'ST001', classId: 1, parentId: 1, userId: 1 },
      { studentId: 2, firstName: 'Jane', lastName: 'Smith', admissionNumber: 'ST002', classId: 1, parentId: 2, userId: 2 },
      { studentId: 3, firstName: 'Mike', lastName: 'Johnson', admissionNumber: 'ST003', classId: 1, parentId: 3, userId: 3 },
      { studentId: 4, firstName: 'Sarah', lastName: 'Wilson', admissionNumber: 'ST004', classId: 1, parentId: 4, userId: 4 },
    ];

    const mockAttendance: AttendanceViewDto[] = [
      {
        attendanceId: 1,
        studentId: 1,
        classId: 1,
        date: '2024-01-15',
        status: 'Present',
        markedById: 1,
        remarks: ''
      },
      {
        attendanceId: 2,
        studentId: 2,
        classId: 1,
        date: '2024-01-15',
        status: 'Absent',
        markedById: 1,
        remarks: 'Sick'
      },
      {
        attendanceId: 3,
        studentId: 3,
        classId: 1,
        date: '2024-01-15',
        status: 'Late',
        markedById: 1,
        remarks: 'Traffic'
      },
      {
        attendanceId: 4,
        studentId: 4,
        classId: 1,
        date: '2024-01-15',
        status: 'Present',
        markedById: 1,
        remarks: ''
      },
    ];

    setClasses(mockClasses);
    setStudents(mockStudents);
    setAttendanceRecords(mockAttendance);
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would call the API here based on the selected filters
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock search results would be set here
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredRecords = () => {
    let filtered = attendanceRecords;

    if (selectedClass) {
      filtered = filtered.filter(record => record.classId === selectedClass.classId);
    }

    if (selectedStudent) {
      filtered = filtered.filter(record => record.studentId === selectedStudent.studentId);
    }

    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate);
    }

    return filtered;
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.studentId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getClassName = (classId: number) => {
    const cls = classes.find(c => c.classId === classId);
    return cls ? `${cls.className} ${cls.section ? `- ${cls.section}` : ''}` : 'Unknown Class';
  };

  const getAttendanceStats = () => {
    const records = getFilteredRecords();
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;
    const excused = records.filter(r => r.status === 'Excused').length;

    return { total, present, absent, late, excused };
  };

  const stats = getAttendanceStats();
  const filteredRecords = getFilteredRecords();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">View Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and analyze attendance records
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            <Filter className="inline h-5 w-5 mr-2" />
            Filters
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                viewMode === 'class'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              By Class
            </button>
            <button
              onClick={() => setViewMode('student')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                viewMode === 'student'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              By Student
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {viewMode === 'class' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Class
              </label>
              <select
                value={selectedClass?.classId || ''}
                onChange={(e) => setSelectedClass(classes.find(c => c.classId === Number(e.target.value)) || null)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All classes</option>
                {classes.map((cls) => (
                  <option key={cls.classId} value={cls.classId}>
                    {cls.className} {cls.section && `- ${cls.section}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Student
              </label>
              <select
                value={selectedStudent?.studentId || ''}
                onChange={(e) => setSelectedStudent(students.find(s => s.studentId === Number(e.target.value)) || null)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All students</option>
                {students.map((student) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.firstName} {student.lastName} ({student.admissionNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="-ml-1 mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-green-600">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Present</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.present}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-red-600">A</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Absent</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.absent}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-yellow-600">L</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Late</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.late}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">E</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Excused</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.excused}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Attendance Records
            </h3>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Download className="-ml-0.5 mr-2 h-4 w-4" />
              Export
            </button>
          </div>

          {filteredRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.attendanceId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {getStudentName(record.studentId).split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getStudentName(record.studentId)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getClassName(record.classId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceStatusColor(record.status)}`}>
                          {getAttendanceStatusDisplayName(record.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceView;