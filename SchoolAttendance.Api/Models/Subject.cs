using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolAttendance.Api.Models;

public class Subject
{
    [Key]
    public int SubjectId { get; set; }

    [Required]
    [MaxLength(100)]
    public string SubjectName { get; set; } = string.Empty;

    [Required]
    [ForeignKey(nameof(Class))]
    public int ClassId { get; set; }

    [Required]
    [ForeignKey(nameof(Teacher))]
    public int TeacherId { get; set; }

    public virtual Class Class { get; set; } = null!;
    public virtual Teacher Teacher { get; set; } = null!;

    public virtual ICollection<Attendance> AttendanceRecords { get; set; } = new List<Attendance>();
}