import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  BookOpen,
  User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Class } from '../types';

export const ClassesPage: React.FC = () => {
  const { role } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock teachers data
  const teachers = [
    { id: 1, name: 'Ms. Johnson', email: 'johnson@school.com' },
    { id: 2, name: 'Mr. Smith', email: 'smith@school.com' },
    { id: 3, name: 'Dr. Brown', email: 'brown@school.com' },
  ];

  // Mock classes data
  const mockClasses: Class[] = [
    {
      classId: 1,
      className: 'Grade 10A',
      section: 'A',
      classTeacherId: 1,
      academicYear: '2024-2025',
      classTeacher: {
        teacherId: 1,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'johnson@school.com',
        userId: 1
      },
      students: [],
      subjects: []
    },
    {
      classId: 2,
      className: 'Grade 10B',
      section: 'B',
      classTeacherId: 2,
      academicYear: '2024-2025',
      classTeacher: {
        teacherId: 2,
        firstName: 'John',
        lastName: 'Smith',
        email: 'smith@school.com',
        userId: 2
      },
      students: [],
      subjects: []
    },
    {
      classId: 3,
      className: 'Grade 9A',
      section: 'A',
      classTeacherId: 3,
      academicYear: '2024-2025',
      classTeacher: {
        teacherId: 3,
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'brown@school.com',
        userId: 3
      },
      students: [],
      subjects: []
    },
    {
      classId: 4,
      className: 'Grade 9B',
      section: 'B',
      classTeacherId: 1,
      academicYear: '2024-2025',
      classTeacher: {
        teacherId: 1,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'johnson@school.com',
        userId: 1
      },
      students: [],
      subjects: []
    },
    {
      classId: 5,
      className: 'Grade 8A',
      section: 'A',
      classTeacherId: 2,
      academicYear: '2024-2025',
      classTeacher: {
        teacherId: 2,
        firstName: 'John',
        lastName: 'Smith',
        email: 'smith@school.com',
        userId: 2
      },
      students: [],
      subjects: []
    }
  ];

  // Mock student counts for each class
  const studentCounts = {
    1: 25,
    2: 23,
    3: 28,
    4: 26,
    5: 24
  };

  // Mock subject counts for each class
  const subjectCounts = {
    1: 6,
    2: 6,
    3: 5,
    4: 5,
    5: 5
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the API
      setClasses(mockClasses);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.academicYear?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageClasses = role === UserRole.Admin || role === UserRole.Teacher;

  const getTotalStudents = () => {
    return Object.values(studentCounts).reduce((sum, count) => sum + count, 0);
  };

  const getTotalSubjects = () => {
    return Object.values(subjectCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage class information and assignments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GraduationCap className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Classes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {classes.length}
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
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Students
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {getTotalStudents()}
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
                <BookOpen className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Subjects
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {getTotalSubjects()}
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
                <User className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Class Teachers
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {teachers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Classes
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="search"
                placeholder="Search by class name, section, or academic year"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-end">
            {canManageClasses && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          filteredClasses.map((cls) => (
            <div key={cls.classId} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <GraduationCap className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {cls.className}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Section {cls.section}
                      </p>
                    </div>
                  </div>
                  {canManageClasses && (
                    <div className="flex space-x-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Academic Year: {cls.academicYear}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    <span>Class Teacher: {cls.classTeacher?.firstName} {cls.classTeacher?.lastName}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Students: {studentCounts[cls.classId as keyof typeof studentCounts] || 0}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Subjects: {subjectCounts[cls.classId as keyof typeof subjectCounts] || 0}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Class ID</span>
                    <span className="font-medium text-gray-900">#{cls.classId}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3">
                <div className="flex justify-between">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                    View Attendance
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredClasses.length === 0 && !loading && (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or add a new class.
          </p>
        </div>
      )}

      {/* Class Teachers Overview */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Class Teachers Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => {
              const teacherClasses = classes.filter(cls => cls.classTeacherId === teacher.id);
              return (
                <div key={teacher.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {teacher.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {teacher.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Classes: {teacherClasses.length}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};