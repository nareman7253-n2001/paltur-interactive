using Microsoft.EntityFrameworkCore;
using PalTur.Api.Models;

namespace PalTur.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<AccessiblePath> AccessiblePaths => Set<AccessiblePath>();
    public DbSet<Obstacle> Obstacles => Set<Obstacle>();
    public DbSet<AssistiveRequest> AssistiveRequests => Set<AssistiveRequest>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Tour> Tours => Set<Tour>();
    public DbSet<Suggestion> Suggestions => Set<Suggestion>();
    public DbSet<Complaint> Complaints => Set<Complaint>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<PointsTransaction> PointsTransactions => Set<PointsTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.Email).HasMaxLength(320);
        });

        modelBuilder.Entity<Role>(entity => entity.HasIndex(role => role.Name).IsUnique());
        modelBuilder.Entity<Complaint>(entity => entity.HasIndex(complaint => complaint.TrackingId).IsUnique());
        modelBuilder.Entity<UserRole>(entity => entity.HasIndex(userRole => new { userRole.UserId, userRole.RoleId }).IsUnique());

        modelBuilder.Entity<UserRole>()
            .HasOne(userRole => userRole.User)
            .WithMany(user => user.UserRoles)
            .HasForeignKey(userRole => userRole.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(userRole => userRole.Role)
            .WithMany(role => role.UserRoles)
            .HasForeignKey(userRole => userRole.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AccessiblePath>()
            .HasOne(path => path.CreatedByUser)
            .WithMany(user => user.CreatedPaths)
            .HasForeignKey(path => path.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Obstacle>()
            .HasOne(obstacle => obstacle.ReportedByUser)
            .WithMany(user => user.ReportedObstacles)
            .HasForeignKey(obstacle => obstacle.ReportedBy)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Obstacle>()
            .HasOne(obstacle => obstacle.AssignedToUser)
            .WithMany()
            .HasForeignKey(obstacle => obstacle.AssignedTo)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AssistiveRequest>()
            .HasOne(request => request.User)
            .WithMany(user => user.AssistiveRequests)
            .HasForeignKey(request => request.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<AssistiveRequest>()
            .HasOne(request => request.AssignedToUser)
            .WithMany()
            .HasForeignKey(request => request.AssignedTo)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Event>()
            .HasOne(@event => @event.CreatedByUser)
            .WithMany(user => user.CreatedEvents)
            .HasForeignKey(@event => @event.CreatedBy)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Tour>()
            .HasOne(tour => tour.Guide)
            .WithMany(user => user.CreatedTours)
            .HasForeignKey(tour => tour.GuideId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Suggestion>()
            .HasOne(suggestion => suggestion.User)
            .WithMany(user => user.Suggestions)
            .HasForeignKey(suggestion => suggestion.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Complaint>()
            .HasOne(complaint => complaint.User)
            .WithMany(user => user.Complaints)
            .HasForeignKey(complaint => complaint.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(message => message.User)
            .WithMany(user => user.ChatMessages)
            .HasForeignKey(message => message.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(booking => booking.User)
            .WithMany(user => user.Bookings)
            .HasForeignKey(booking => booking.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(booking => booking.Event)
            .WithMany(@event => @event.Bookings)
            .HasForeignKey(booking => booking.EventId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(booking => booking.Tour)
            .WithMany(tour => tour.Bookings)
            .HasForeignKey(booking => booking.TourId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PointsTransaction>()
            .HasOne(transaction => transaction.User)
            .WithMany(user => user.PointsTransactions)
            .HasForeignKey(transaction => transaction.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
