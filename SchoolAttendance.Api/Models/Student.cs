using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolAttendance.Api.Models;

public class Student
{
    [Key]
    public int StudentId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string AdmissionNumber { get; set; } = string.Empty;

    [MaxLength(10)]
    public string? Gender { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    [MaxLength(300)]
    public string? Address { get; set; }

    [Required]
    [ForeignKey(nameof(Parent))]
    public int ParentId { get; set; }

    [Required]
    [ForeignKey(nameof(Class))]
    public int ClassId { get; set; }

    [Required]
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

    public virtual Parent Parent { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
    public virtual User User { get; set; } = null!;

    public virtual ICollection<Attendance> AttendanceRecords { get; set; } = new List<Attendance>();
}