using Microsoft.EntityFrameworkCore;
using SchoolAttendance.Api.Models;

namespace SchoolAttendance.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Teacher> Teachers => Set<Teacher>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Parent> Parents => Set<Parent>();
    public DbSet<Class> Classes => Set<Class>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Attendance> Attendances => Set<Attendance>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Unique constraints
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Student>().HasIndex(s => s.AdmissionNumber).IsUnique();

        // One User -> One Teacher/Student/Parent
        modelBuilder.Entity<User>()
            .HasOne(u => u.Teacher)
            .WithOne(t => t.User)
            .HasForeignKey<Teacher>(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Student)
            .WithOne(s => s.User)
            .HasForeignKey<Student>(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasOne(u => u.Parent)
            .WithOne(p => p.User)
            .HasForeignKey<Parent>(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // One Teacher -> Many Subjects
        modelBuilder.Entity<Teacher>()
            .HasMany(t => t.Subjects)
            .WithOne(s => s.Teacher)
            .HasForeignKey(s => s.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // One Class -> Many Students
        modelBuilder.Entity<Class>()
            .HasMany(c => c.Students)
            .WithOne(s => s.Class)
            .HasForeignKey(s => s.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        // Class Teacher
        modelBuilder.Entity<Class>()
            .HasOne(c => c.ClassTeacher)
            .WithMany(t => t.ClassTeacherOf)
            .HasForeignKey(c => c.ClassTeacherId)
            .OnDelete(DeleteBehavior.SetNull);

        // Subject in Class
        modelBuilder.Entity<Class>()
            .HasMany(c => c.Subjects)
            .WithOne(s => s.Class)
            .HasForeignKey(s => s.ClassId)
            .OnDelete(DeleteBehavior.Cascade);

        // Attendance relationships
        modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Student)
            .WithMany(s => s.AttendanceRecords)
            .HasForeignKey(a => a.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Class)
            .WithMany()
            .HasForeignKey(a => a.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Attendance>()
            .HasOne(a => a.Subject)
            .WithMany(s => s.AttendanceRecords)
            .HasForeignKey(a => a.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Attendance>()
            .HasOne(a => a.MarkedBy)
            .WithMany()
            .HasForeignKey(a => a.MarkedById)
            .OnDelete(DeleteBehavior.Restrict);

        // Derived/consistency constraints
        modelBuilder.Entity<Attendance>()
            .HasIndex(a => new { a.StudentId, a.Date, a.SubjectId })
            .IsUnique();

        modelBuilder.Entity<Attendance>()
            .Property(a => a.Date)
            .HasConversion(
                d => d.ToDateTime(TimeOnly.MinValue),
                dt => DateOnly.FromDateTime(DateTime.SpecifyKind(dt, DateTimeKind.Utc))
            );

        modelBuilder.Entity<Student>()
            .Property(s => s.DateOfBirth)
            .HasConversion(
                d => d.HasValue ? d.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                dt => dt.HasValue ? DateOnly.FromDateTime(DateTime.SpecifyKind(dt.Value, DateTimeKind.Utc)) : (DateOnly?)null
            );
    }
}