using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolAttendance.Api.Models;

public class User
{
    [Key]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    // links to the domain entity id (TeacherId, StudentId, or ParentId)
    public int? LinkedId { get; set; }

    [MaxLength(50)]
    public string? Status { get; set; }

    // Navigation (one-to-one optional)
    public virtual Teacher? Teacher { get; set; }
    public virtual Student? Student { get; set; }
    public virtual Parent? Parent { get; set; }
}