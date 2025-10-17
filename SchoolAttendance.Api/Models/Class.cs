using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolAttendance.Api.Models;

public class Class
{
    [Key]
    public int ClassId { get; set; }

    [Required]
    [MaxLength(50)]
    public string ClassName { get; set; } = string.Empty;

    [ForeignKey(nameof(ClassTeacher))]
    public int? ClassTeacherId { get; set; }

    [MaxLength(20)]
    public string? AcademicYear { get; set; }

    [MaxLength(10)]
    public string? Section { get; set; }

    public virtual Teacher? ClassTeacher { get; set; }

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
    public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();
}