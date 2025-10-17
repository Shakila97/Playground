namespace SchoolAttendance.Api.Models;

public enum UserRole
{
    Admin = 0,
    Teacher = 1,
    Student = 2,
    Parent = 3
}

public enum AttendanceStatus
{
    Present = 0,
    Absent = 1,
    Late = 2,
    Excused = 3
}