namespace SchoolAttendance.Api.DTOs;

public class MarkAttendanceRequest
{
    public int StudentId { get; set; }
    public int ClassId { get; set; }
    public int? SubjectId { get; set; }
    public DateOnly Date { get; set; }
    public string Status { get; set; } = "Present"; // Present, Absent, Late, Excused
    public string? Remarks { get; set; }
}

public class AttendanceViewDto
{
    public int AttendanceId { get; set; }
    public int StudentId { get; set; }
    public int ClassId { get; set; }
    public int? SubjectId { get; set; }
    public DateOnly Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public int MarkedById { get; set; }
    public string? Remarks { get; set; }
}