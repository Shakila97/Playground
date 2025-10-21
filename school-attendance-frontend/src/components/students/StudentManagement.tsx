import React, { useState, useEffect } from 'react';
import type { Student, Class, Parent } from '../../types';
import { formatDate, getInitials } from '../../utils/helpers';
import { 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  UserPlus,
  Filter,
  Download
} from 'lucide-react';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - in a real app, this would come from the API
  useEffect(() => {
    const mockClasses: Class[] = [
      { classId: 1, className: 'Grade 10A', section: 'A', academicYear: '2024' },
      { classId: 2, className: 'Grade 10B', section: 'B', academicYear: '2024' },
      { classId: 3, className: 'Grade 11A', section: 'A', academicYear: '2024' },
    ];

    const mockParents: Parent[] = [
      { parentId: 1, firstName: 'Robert', lastName: 'Doe', email: 'robert.doe@email.com', phone: '123-456-7890', userId: 1 },
      { parentId: 2, firstName: 'Mary', lastName: 'Smith', email: 'mary.smith@email.com', phone: '123-456-7891', userId: 2 },
      { parentId: 3, firstName: 'David', lastName: 'Johnson', email: 'david.johnson@email.com', phone: '123-456-7892', userId: 3 },
      { parentId: 4, firstName: 'Lisa', lastName: 'Wilson', email: 'lisa.wilson@email.com', phone: '123-456-7893', userId: 4 },
    ];

    const mockStudents: Student[] = [
      { 
        studentId: 1, 
        firstName: 'John', 
        lastName: 'Doe', 
        admissionNumber: 'ST001', 
        gender: 'Male',
        dateOfBirth: '2008-05-15',
        address: '123 Main St, City',
        classId: 1, 
        parentId: 1, 
        userId: 1,
        class: mockClasses[0],
        parent: mockParents[0]
      },
      { 
        studentId: 2, 
        firstName: 'Jane', 
        lastName: 'Smith', 
        admissionNumber: 'ST002', 
        gender: 'Female',
        dateOfBirth: '2008-03-22',
        address: '456 Oak Ave, City',
        classId: 1, 
        parentId: 2, 
        userId: 2,
        class: mockClasses[0],
        parent: mockParents[1]
      },
      { 
        studentId: 3, 
        firstName: 'Mike', 
        lastName: 'Johnson', 
        admissionNumber: 'ST003', 
        gender: 'Male',
        dateOfBirth: '2007-11-10',
        address: '789 Pine St, City',
        classId: 2, 
        parentId: 3, 
        userId: 3,
        class: mockClasses[1],
        parent: mockParents[2]
      },
      { 
        studentId: 4, 
        firstName: 'Sarah', 
        lastName: 'Wilson', 
        admissionNumber: 'ST004', 
        gender: 'Female',
        dateOfBirth: '2007-08-30',
        address: '321 Elm St, City',
        classId: 2, 
        parentId: 4, 
        userId: 4,
        class: mockClasses[1],
        parent: mockParents[3]
      },
    ];

    setClasses(mockClasses);
    setStudents(mockStudents);
  }, []);

  const getFilteredStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(student => student.classId === selectedClass.classId);
    }

    return filtered;
  };

  const handleDeleteStudent = (studentId: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.studentId !== studentId));
    }
  };


  const filteredStudents = getFilteredStudents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student information and enrollment
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlus className="-ml-1 mr-2 h-4 w-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            <Filter className="inline h-5 w-5 mr-2" />
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or admission number"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

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

          <div className="flex items-end">
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Download className="-ml-1 mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Students ({filteredStudents.length})
            </h3>
          </div>

          {filteredStudents.length > 0 ? (
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
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.studentId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">
                              {getInitials(student.firstName, student.lastName)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.admissionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class?.className} {student.class?.section && `- ${student.class.section}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.gender || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.dateOfBirth ? formatDate(student.dateOfBirth) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.parent ? `${student.parent.firstName} ${student.parent.lastName}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => console.log('Edit student:', student)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.studentId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or add a new student.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Student Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Student</h3>
              <p className="text-sm text-gray-500 mb-4">
                This is a placeholder for the add student form. In a real application, 
                this would contain a comprehensive form with all student fields.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;