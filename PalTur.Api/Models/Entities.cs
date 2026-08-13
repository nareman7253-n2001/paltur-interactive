using System;
using System.Collections.Generic;

namespace PalTur.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public string FullName { get; set; } = "";
        public string FullNameAr { get; set; } = "";
        public string? Phone { get; set; }
        public string Role { get; set; } = "User"; // User, Administrator, Moderator
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        public List<UserRole> UserRoles { get; set; } = new();
        public List<AccessiblePath> CreatedPaths { get; set; } = new();
        public List<Obstacle> ReportedObstacles { get; set; } = new();
        public List<AssistiveRequest> AssistiveRequests { get; set; } = new();
        public List<Event> CreatedEvents { get; set; } = new();
        public List<Tour> CreatedTours { get; set; } = new();
        public List<Suggestion> Suggestions { get; set; } = new();
        public List<Complaint> Complaints { get; set; } = new();
        public List<ChatMessage> ChatMessages { get; set; } = new();
        public List<Booking> Bookings { get; set; } = new();
        public List<PointsTransaction> PointsTransactions { get; set; } = new();
    }

    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public List<UserRole> UserRoles { get; set; } = new();
    }

    public class UserRole
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Role Role { get; set; } = null!;
    }

    public class AccessiblePath
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string NameAr { get; set; } = "";
        public string StartLocation { get; set; } = "";
        public string EndLocation { get; set; } = "";
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string Status { get; set; } = "active";
        public string? Notes { get; set; }
        public string? NotesAr { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User CreatedByUser { get; set; } = null!;
    }

    public class Obstacle
    {
        public int Id { get; set; }
        public string Location { get; set; } = "";
        public string LocationAr { get; set; } = "";
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string Type { get; set; } = "";
        public string Severity { get; set; } = "medium";
        public string Description { get; set; } = "";
        public string DescriptionAr { get; set; } = "";
        public string Status { get; set; } = "pending";
        public int ReportedBy { get; set; }
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
        public int? AssignedTo { get; set; }

        public User ReportedByUser { get; set; } = null!;
        public User? AssignedToUser { get; set; }
    }

    public class AssistiveRequest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string RequestType { get; set; } = "";
        public string Details { get; set; } = "";
        public string DetailsAr { get; set; } = "";
        public string Status { get; set; } = "open";
        public int? AssignedTo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public User User { get; set; } = null!;
        public User? AssignedToUser { get; set; }
    }

    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string TitleAr { get; set; } = "";
        public string Description { get; set; } = "";
        public string DescriptionAr { get; set; } = "";
        public string Category { get; set; } = "";
        public string Location { get; set; } = "";
        public string LocationAr { get; set; } = "";
        public double Lat { get; set; }
        public double Lng { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Capacity { get; set; }
        public int CurrentAttendees { get; set; }
        public decimal Price { get; set; }
        public int PointsRequired { get; set; }
        public int PointsReward { get; set; }
        public string Status { get; set; } = "upcoming";
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User CreatedByUser { get; set; } = null!;
        public List<Booking> Bookings { get; set; } = new();
    }

    public class Tour
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string TitleAr { get; set; } = "";
        public string Category { get; set; } = "";
        public string Description { get; set; } = "";
        public string DescriptionAr { get; set; } = "";
        public int DurationMinutes { get; set; }
        public int MaxParticipants { get; set; }
        public int CurrentParticipants { get; set; }
        public int PricePoints { get; set; }
        public int PointsReward { get; set; }
        public DateTime TourDate { get; set; }
        public string Status { get; set; } = "upcoming";
        public int GuideId { get; set; }
        public string GuideName { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User Guide { get; set; } = null!;
        public List<Booking> Bookings { get; set; } = new();
    }

    public class Suggestion
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string TitleAr { get; set; } = "";
        public string Category { get; set; } = "";
        public string Description { get; set; } = "";
        public string DescriptionAr { get; set; } = "";
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
        public string Status { get; set; } = "pending";
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }

    public class Complaint
    {
        public int Id { get; set; }
        public string TrackingId { get; set; } = "";
        public string Title { get; set; } = "";
        public string TitleAr { get; set; } = "";
        public string Description { get; set; } = "";
        public string DescriptionAr { get; set; } = "";
        public string Category { get; set; } = "";
        public string Location { get; set; } = "";
        public string LocationAr { get; set; } = "";
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string Status { get; set; } = "pending";
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }

        public User User { get; set; } = null!;
    }

    public class ChatMessage
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; } = "";
        public string Response { get; set; } = "";
        public string Intent { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }

    public class Booking
    {
        public int Id { get; set; }
        public int? EventId { get; set; }
        public int? TourId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; } = "booked";
        public DateTime BookedAt { get; set; } = DateTime.UtcNow;
        public string? BookingCode { get; set; }

        public Event? Event { get; set; }
        public Tour? Tour { get; set; }
        public User User { get; set; } = null!;
    }

    public class PointsTransaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Points { get; set; }
        public string Type { get; set; } = "";
        public string Category { get; set; } = "";
        public string Description { get; set; } = "";
        public string DescriptionAr { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}
