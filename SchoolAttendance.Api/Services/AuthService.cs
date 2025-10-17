using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SchoolAttendance.Api.Data;
using SchoolAttendance.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SchoolAttendance.Api.Services;

public interface IAuthService
{
    Task<string?> LoginAsync(string username, string password);
}

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(ApplicationDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<string?> LoginAsync(string username, string password)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user is null)
            return null;

        if (user.PasswordHash != Hash(password))
            return null;

        return GenerateJwt(user);
    }

    private static string Hash(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes);
    }

    private string GenerateJwt(User user)
    {
        var jwtKey = _config.GetValue<string>("Jwt:Key") ?? "dev-secret-key-change-in-production-32chars";
        var issuer = _config.GetValue<string>("Jwt:Issuer") ?? "SchoolAttendance";
        var audience = _config.GetValue<string>("Jwt:Audience") ?? "SchoolAttendanceClients";
        var expireMinutes = _config.GetValue<int>("Jwt:ExpireMinutes", 120);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}