using Microsoft.EntityFrameworkCore;
using SchoolAttendance.Api.Models;
using System.Security.Cryptography;
using System.Text;

namespace SchoolAttendance.Api.Data;

public class DbSeeder
{
    private readonly ApplicationDbContext _db;

    public DbSeeder(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task SeedAsync()
    {
        await _db.Database.EnsureCreatedAsync();

        if (await _db.Users.AnyAsync())
        {
            return; // already seeded
        }

        // Simple hash for demo purposes (not for production)
        string Hash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes);
        }

        var adminUser = new User
        {
            Username = "admin",
            Email = "admin@school.local",
            PasswordHash = Hash("admin123"),
            Role = UserRole.Admin,
            Status = "Active"
        };

        var teacherUser = new User
        {
            Username = "t.john",
            Email = "john.doe@school.local",
            PasswordHash = Hash("teacher123"),
            Role = UserRole.Teacher,
            Status = "Active"
        };

        var parentUser = new User
        {
            Username = "p.smith",
            Email = "parent.smith@school.local",
            PasswordHash = Hash("parent123"),
            Role = UserRole.Parent,
            Status = "Active"
        };

        var studentUser = new User
        {
            Username = "s.alice",
            Email = "alice.smith@school.local",
            PasswordHash = Hash("student123"),
            Role = UserRole.Student,
            Status = "Active"
        };

        _db.Users.AddRange(adminUser, teacherUser, parentUser, studentUser);
        await _db.SaveChangesAsync();

        var teacher = new Teacher
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@school.local",
            Phone = "+1-555-1000",
            SubjectSpecialization = "Mathematics",
            UserId = teacherUser.UserId
        };
        _db.Teachers.Add(teacher);
        await _db.SaveChangesAsync();
        teacherUser.LinkedId = teacher.TeacherId;

        var parent = new Parent
        {
            FirstName = "Mary",
            LastName = "Smith",
            Email = "parent.smith@school.local",
            Phone = "+1-555-2000",
            Address = "123 Maple St",
            UserId = parentUser.UserId
        };
        _db.Parents.Add(parent);
        await _db.SaveChangesAsync();
        parentUser.LinkedId = parent.ParentId;

        var classA = new Class
        {
            ClassName = "Grade 5",
            AcademicYear = "2024-2025",
            Section = "A",
            ClassTeacherId = teacher.TeacherId
        };
        _db.Classes.Add(classA);
        await _db.SaveChangesAsync();

        var student = new Student
        {
            FirstName = "Alice",
            LastName = "Smith",
            AdmissionNumber = "ADM-0001",
            Gender = "F",
            DateOfBirth = new DateOnly(2014, 3, 15),
            Address = "123 Maple St",
            ParentId = parent.ParentId,
            ClassId = classA.ClassId,
            UserId = studentUser.UserId
        };
        _db.Students.Add(student);
        await _db.SaveChangesAsync();
        studentUser.LinkedId = student.StudentId;

        var math = new Subject
        {
            SubjectName = "Mathematics",
            ClassId = classA.ClassId,
            TeacherId = teacher.TeacherId
        };
        _db.Subjects.Add(math);
        await _db.SaveChangesAsync();

        // Sample attendance record
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        _db.Attendances.Add(new Attendance
        {
            StudentId = student.StudentId,
            ClassId = classA.ClassId,
            SubjectId = math.SubjectId,
            Date = today,
            Status = AttendanceStatus.Present,
            MarkedById = teacher.TeacherId,
            Remarks = "On time"
        });

        await _db.SaveChangesAsync();
    }
}