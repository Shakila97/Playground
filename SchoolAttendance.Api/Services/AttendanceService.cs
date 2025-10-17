using Microsoft.EntityFrameworkCore;
using SchoolAttendance.Api.Data;
using SchoolAttendance.Api.DTOs;
using SchoolAttendance.Api.Models;

namespace SchoolAttendance.Api.Services;

public interface IAttendanceService
{
    Task<AttendanceViewDto> MarkAsync(MarkAttendanceRequest request, int markedByTeacherId);
    Task<List<AttendanceViewDto>> GetStudentAsync(int studentId);
    Task<List<AttendanceViewDto>> GetClassByDateAsync(int classId, DateOnly date);
}

public class AttendanceService : IAttendanceService
{
    private readonly ApplicationDbContext _db;

    public AttendanceService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<AttendanceViewDto> MarkAsync(MarkAttendanceRequest request, int markedByTeacherId)
    {
        if (!Enum.TryParse<AttendanceStatus>(request.Status, true, out var status))
            throw new ArgumentException("Invalid status");

        // ensure student belongs to class
        var student = await _db.Students.AsNoTracking().FirstOrDefaultAsync(s => s.StudentId == request.StudentId);
        if (student is null || student.ClassId != request.ClassId)
            throw new InvalidOperationException("Student not in class");

        // if subject is provided, ensure it belongs to class
        if (request.SubjectId.HasValue)
        {
            var subject = await _db.Subjects.AsNoTracking().FirstOrDefaultAsync(s => s.SubjectId == request.SubjectId.Value);
            if (subject is null || subject.ClassId != request.ClassId)
                throw new InvalidOperationException("Subject not in class");
        }

        var existing = await _db.Attendances.FirstOrDefaultAsync(a =>
            a.StudentId == request.StudentId && a.Date == request.Date && a.SubjectId == request.SubjectId);
        if (existing is not null)
        {
            existing.Status = status;
            existing.Remarks = request.Remarks;
            existing.MarkedById = markedByTeacherId;
            await _db.SaveChangesAsync();
            return ToDto(existing);
        }

        var attendance = new Attendance
        {
            StudentId = request.StudentId,
            ClassId = request.ClassId,
            SubjectId = request.SubjectId,
            Date = request.Date,
            Status = status,
            MarkedById = markedByTeacherId,
            Remarks = request.Remarks
        };
        _db.Attendances.Add(attendance);
        await _db.SaveChangesAsync();
        return ToDto(attendance);
    }

    public async Task<List<AttendanceViewDto>> GetStudentAsync(int studentId)
    {
        return await _db.Attendances
            .Where(a => a.StudentId == studentId)
            .OrderByDescending(a => a.Date)
            .Select(a => ToDto(a))
            .ToListAsync();
    }

    public async Task<List<AttendanceViewDto>> GetClassByDateAsync(int classId, DateOnly date)
    {
        return await _db.Attendances
            .Where(a => a.ClassId == classId && a.Date == date)
            .Select(a => ToDto(a))
            .ToListAsync();
    }

    private static AttendanceViewDto ToDto(Attendance a) => new AttendanceViewDto
    {
        AttendanceId = a.AttendanceId,
        StudentId = a.StudentId,
        ClassId = a.ClassId,
        SubjectId = a.SubjectId,
        Date = a.Date,
        Status = a.Status.ToString(),
        MarkedById = a.MarkedById,
        Remarks = a.Remarks
    };
}