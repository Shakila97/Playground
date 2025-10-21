import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { Class, Student, Subject, MarkAttendanceRequest } from '../../types';
import { AttendanceStatus } from '../../types';
import { getAttendanceStatusDisplayName } from '../../utils/helpers';
import { Calendar, Users, BookOpen, Save, RefreshCw } from 'lucide-react';

const AttendanceMarking: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Map<number, AttendanceStatus>>(new Map());
  const [remarks, setRemarks] = useState<Map<number, string>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Mock data - in a real app, this would come from the API
  useEffect(() => {
    const mockClasses: Class[] = [
      { classId: 1, className: 'Grade 10A', section: 'A', academicYear: '2024' },
      { classId: 2, className: 'Grade 10B', section: 'B', academicYear: '2024' },
      { classId: 3, className: 'Grade 11A', section: 'A', academicYear: '2024' },
    ];

    const mockSubjects: Subject[] = [
      { subjectId: 1, subjectName: 'Mathematics', classId: 1 },
      { subjectId: 2, subjectName: 'English', classId: 1 },
      { subjectId: 3, subjectName: 'Science', classId: 1 },
      { subjectId: 4, subjectName: 'History', classId: 1 },
    ];

    const mockStudents: Student[] = [
      { studentId: 1, firstName: 'John', lastName: 'Doe', admissionNumber: 'ST001', classId: 1, parentId: 1, userId: 1 },
      { studentId: 2, firstName: 'Jane', lastName: 'Smith', admissionNumber: 'ST002', classId: 1, parentId: 2, userId: 2 },
      { studentId: 3, firstName: 'Mike', lastName: 'Johnson', admissionNumber: 'ST003', classId: 1, parentId: 3, userId: 3 },
      { studentId: 4, firstName: 'Sarah', lastName: 'Wilson', admissionNumber: 'ST004', classId: 1, parentId: 4, userId: 4 },
    ];

    setClasses(mockClasses);
    setSubjects(mockSubjects);
    setStudents(mockStudents);
  }, []);

  const handleClassChange = (classId: number) => {
    const selectedClassData = classes.find(c => c.classId === classId);
    setSelectedClass(selectedClassData || null);
    
    // Filter students and subjects for selected class
    const classStudents = students.filter(s => s.classId === classId);
    const classSubjects = subjects.filter(s => s.classId === classId);
    
    setStudents(classStudents);
    setSubjects(classSubjects);
    setSelectedSubject(null);
    setAttendanceRecords(new Map());
    setRemarks(new Map());
  };

  const handleSubjectChange = (subjectId: number) => {
    const selectedSubjectData = subjects.find(s => s.subjectId === subjectId);
    setSelectedSubject(selectedSubjectData || null);
  };

  const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceRecords(prev => new Map(prev.set(studentId, status)));
  };

  const handleRemarksChange = (studentId: number, remark: string) => {
    setRemarks(prev => new Map(prev.set(studentId, remark)));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      setMessage({ type: 'error', text: 'Please select a class and date' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const promises = Array.from(attendanceRecords.entries()).map(([studentId, status]) => {
        const request: MarkAttendanceRequest = {
          studentId,
          classId: selectedClass.classId,
          subjectId: selectedSubject?.subjectId,
          date: selectedDate,
          status: status === 0 ? 'Present' : status === 1 ? 'Absent' : status === 2 ? 'Late' : 'Excused',
          remarks: remarks.get(studentId)
        };
        return request;
      });

      // In a real app, you would call the API here
      console.log('Saving attendance records:', promises);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Attendance records saved successfully!' });
      setAttendanceRecords(new Map());
      setRemarks(new Map());
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save attendance records' });
    } finally {
      setIsSaving(false);
    }
  };

  const getAttendanceStatusForStudent = (studentId: number): AttendanceStatus => {
    return attendanceRecords.get(studentId) || AttendanceStatus.Present;
  };

  const getRemarksForStudent = (studentId: number): string => {
    return remarks.get(studentId) || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record attendance for students in your classes
        </p>
      </div>

      {/* Selection Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Class
            </label>
            <select
              value={selectedClass?.classId || ''}
              onChange={(e) => handleClassChange(Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className} {cls.section && `- ${cls.section}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="inline h-4 w-4 mr-1" />
              Subject (Optional)
            </label>
            <select
              value={selectedSubject?.subjectId || ''}
              onChange={(e) => handleSubjectChange(Number(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All subjects</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

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
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-md p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Attendance Table */}
      {selectedClass && students.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Students in {selectedClass.className} {selectedClass.section && `- ${selectedClass.section}`}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admission No.
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
                  {students.map((student) => (
                    <tr key={student.studentId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.admissionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={getAttendanceStatusForStudent(student.studentId)}
                          onChange={(e) => handleAttendanceChange(student.studentId, Number(e.target.value) as AttendanceStatus)}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        >
                          {Object.values(AttendanceStatus)
                            .filter(value => typeof value === 'number')
                            .map((status) => (
                              <option key={status} value={status}>
                                {getAttendanceStatusDisplayName(status as AttendanceStatus)}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={getRemarksForStudent(student.studentId)}
                          onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                          placeholder="Optional remarks"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAttendance}
                disabled={isSaving || attendanceRecords.size === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-4 w-4" />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedClass && students.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no students enrolled in the selected class.
          </p>
        </div>
      )}

      {!selectedClass && (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Select a class</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose a class to start marking attendance.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;