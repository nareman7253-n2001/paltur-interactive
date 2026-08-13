using Microsoft.EntityFrameworkCore;
using PalTur.Api.Models;

namespace PalTur.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

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

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);
        }
    }
}
