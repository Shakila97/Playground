import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  GraduationCap,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Student } from '../types';

export const StudentsPage: React.FC = () => {
  const { role } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock classes data
  const classes = [
    { id: 1, name: 'Grade 10A', section: 'A' },
    { id: 2, name: 'Grade 10B', section: 'B' },
    { id: 3, name: 'Grade 9A', section: 'A' },
    { id: 4, name: 'Grade 9B', section: 'B' },
    { id: 5, name: 'Grade 8A', section: 'A' },
  ];

  // Mock students data
  const mockStudents: Student[] = [
    {
      studentId: 1,
      firstName: 'John',
      lastName: 'Doe',
      admissionNumber: 'ST001',
      gender: 'Male',
      dateOfBirth: '2005-03-15',
      address: '123 Main St, City',
      parentId: 1,
      classId: 1,
      userId: 1,
      class: { classId: 1, className: 'Grade 10A', section: 'A' }
    },
    {
      studentId: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      admissionNumber: 'ST002',
      gender: 'Female',
      dateOfBirth: '2005-07-22',
      address: '456 Oak Ave, City',
      parentId: 2,
      classId: 1,
      userId: 2,
      class: { classId: 1, className: 'Grade 10A', section: 'A' }
    },
    {
      studentId: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      admissionNumber: 'ST003',
      gender: 'Male',
      dateOfBirth: '2005-11-08',
      address: '789 Pine St, City',
      parentId: 3,
      classId: 2,
      userId: 3,
      class: { classId: 2, className: 'Grade 10B', section: 'B' }
    },
    {
      studentId: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      admissionNumber: 'ST004',
      gender: 'Female',
      dateOfBirth: '2006-01-12',
      address: '321 Elm St, City',
      parentId: 4,
      classId: 2,
      userId: 4,
      class: { classId: 2, className: 'Grade 10B', section: 'B' }
    },
    {
      studentId: 5,
      firstName: 'David',
      lastName: 'Brown',
      admissionNumber: 'ST005',
      gender: 'Male',
      dateOfBirth: '2006-05-30',
      address: '654 Maple Ave, City',
      parentId: 5,
      classId: 3,
      userId: 5,
      class: { classId: 3, className: 'Grade 9A', section: 'A' }
    }
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the API
      setStudents(mockStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass ? student.classId === selectedClass : true;
    
    return matchesSearch && matchesClass;
  });

  const canManageStudents = role === UserRole.Admin || role === UserRole.Teacher;

  const getClassStats = () => {
    const stats: { [key: number]: number } = {};
    students.forEach(student => {
      stats[student.classId] = (stats[student.classId] || 0) + 1;
    });
    return stats;
  };

  const classStats = getClassStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage student information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Students
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {students.length}
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
                <GraduationCap className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Classes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Object.keys(classStats).length}
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
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Male Students
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {students.filter(s => s.gender === 'Male').length}
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
                <Users className="h-6 w-6 text-pink-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Female Students
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {students.filter(s => s.gender === 'Female').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Class
            </label>
            <select
              id="class"
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - Section {cls.section}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            {canManageStudents && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Students ({filteredStudents.length})
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
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    {canManageStudents && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.admissionNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.class?.className} - {student.class?.section}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.gender || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          {student.address && (
                            <MapPin className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="truncate max-w-32">
                            {student.address || '-'}
                          </span>
                        </div>
                      </td>
                      {canManageStudents && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredStudents.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Class Distribution */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Students by Class
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {cls.name} - Section {cls.section}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {classStats[cls.id] || 0}
                    </p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};