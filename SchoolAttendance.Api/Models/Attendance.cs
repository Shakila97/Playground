using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolAttendance.Api.Models;

public class Attendance
{
    [Key]
    public int AttendanceId { get; set; }

    [Required]
    [ForeignKey(nameof(Student))]
    public int StudentId { get; set; }

    [Required]
    [ForeignKey(nameof(Class))]
    public int ClassId { get; set; }

    [ForeignKey(nameof(Subject))]
    public int? SubjectId { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public AttendanceStatus Status { get; set; }

    [Required]
    [ForeignKey(nameof(MarkedBy))]
    public int MarkedById { get; set; }

    [MaxLength(500)]
    public string? Remarks { get; set; }

    public virtual Student Student { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
    public virtual Subject? Subject { get; set; }
    public virtual Teacher MarkedBy { get; set; } = null!;
}