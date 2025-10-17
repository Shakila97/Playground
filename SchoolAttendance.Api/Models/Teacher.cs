using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolAttendance.Api.Models;

public class Teacher
{
    [Key]
    public int TeacherId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(30)]
    public string? Phone { get; set; }

    [MaxLength(200)]
    public string? SubjectSpecialization { get; set; }

    [Required]
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

    public virtual User User { get; set; } = null!;

    // Navigation
    public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();
    public virtual ICollection<Class> ClassTeacherOf { get; set; } = new List<Class>();
}