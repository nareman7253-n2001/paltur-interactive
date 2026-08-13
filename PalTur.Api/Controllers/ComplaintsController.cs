using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PalTur.Api.Data;
using PalTur.Api.Models;

namespace PalTur.Api.Controllers
{
    [ApiController]
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
            return await _ctx.Complaints.OrderByDescending(c => c.CreatedAt).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Complaint>> PostComplaint(ComplaintDto dto)
        {
            var complaint = new Complaint
            {
                Title = dto.Title,
                Location = dto.Location,
                Description = dto.Description,
                Category = dto.Category ?? "general",
                UserId = dto.UserId,
                TrackingId = "PLT-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                CreatedAt = DateTime.UtcNow,
                Status = "pending"
            };

            _ctx.Complaints.Add(complaint);
            await _ctx.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComplaints), new { id = complaint.Id }, complaint);
        }
    }

    public class ComplaintDto
    {
        public string Title { get; set; } = "";
        public string Location { get; set; } = "";
        public string Description { get; set; } = "";
        public string? Category { get; set; }
        public int UserId { get; set; }
    }
}
