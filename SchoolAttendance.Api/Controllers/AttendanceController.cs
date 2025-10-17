using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolAttendance.Api.DTOs;
using SchoolAttendance.Api.Services;

namespace SchoolAttendance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [Authorize(Roles = "Teacher,Admin")]
    [HttpPost("mark")] 
    public async Task<ActionResult<AttendanceViewDto>> Mark([FromBody] MarkAttendanceRequest request)
    {
        // For demo in absence of IUserContext, accept teacherId via header or default to 1
        int markedByTeacherId = 1;
        if (Request.Headers.TryGetValue("X-Teacher-Id", out var headerVal) && int.TryParse(headerVal, out var tid))
        {
            markedByTeacherId = tid;
        }

        var result = await _attendanceService.MarkAsync(request, markedByTeacherId);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Teacher,Student,Parent")]
    [HttpGet("student/{id}")]
    public async Task<ActionResult<List<AttendanceViewDto>>> GetStudent(int id)
    {
        var items = await _attendanceService.GetStudentAsync(id);
        return Ok(items);
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpGet("class/{id}/date/{date}")]
    public async Task<ActionResult<List<AttendanceViewDto>>> GetClassByDate(int id, DateOnly date)
    {
        var items = await _attendanceService.GetClassByDateAsync(id, date);
        return Ok(items);
    }
}