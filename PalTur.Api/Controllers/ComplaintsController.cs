using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PalTur.Api.Data;
using PalTur.Api.Models;

namespace PalTur.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/complaints")]
public class ComplaintsController : ControllerBase
{
    private readonly ApplicationDbContext _ctx;

    public ComplaintsController(ApplicationDbContext ctx)
    {
        _ctx = ctx;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Complaint>>> GetComplaints()
    {
        if (!TryGetAuthenticatedUserId(out var userId))
        {
            return Unauthorized();
        }

        var query = _ctx.Complaints.AsNoTracking().OrderByDescending(c => c.CreatedAt);
        if (!User.IsInRole("Administrator"))
        {
            query = query.Where(complaint => complaint.UserId == userId)
                .OrderByDescending(complaint => complaint.CreatedAt);
        }

        return await query.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Complaint>> PostComplaint([FromBody] ComplaintDto dto)
    {
        if (!TryGetAuthenticatedUserId(out var userId))
        {
            return Unauthorized();
        }

        var complaint = new Complaint
        {
            Title = dto.Title,
            Location = dto.Location,
            Description = dto.Description,
            Category = dto.Category ?? "general",
            UserId = userId,
            TrackingId = "PLT-" + Guid.NewGuid().ToString("N")[..8].ToUpperInvariant(),
            CreatedAt = DateTime.UtcNow,
            Status = "pending"
        };

        _ctx.Complaints.Add(complaint);
        await _ctx.SaveChangesAsync();

        return CreatedAtAction(nameof(GetComplaints), new { id = complaint.Id }, complaint);
    }

    private bool TryGetAuthenticatedUserId(out int userId)
    {
        return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);
    }
}

public class ComplaintDto
{
    public string Title { get; set; } = "";
    public string Location { get; set; } = "";
    public string Description { get; set; } = "";
    public string? Category { get; set; }
}
