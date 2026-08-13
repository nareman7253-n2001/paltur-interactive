using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PalTur.Api.Models;

namespace PalTur.Api.Data;

public static class ProductionDatabaseInitializer
{
    public static async Task InitializeAsync(IServiceProvider services, IConfiguration configuration)
    {
        using var scope = services.CreateScope();
        var database = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        if (configuration.GetValue<bool>("Database:ApplyMigrationsOnStartup"))
        {
            await database.Database.MigrateAsync();
        }

        var email = configuration["BootstrapAdmin:Email"];
        var password = configuration["BootstrapAdmin:Password"];
        var fullName = configuration["BootstrapAdmin:FullName"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        var administratorRole = await database.Roles
            .SingleOrDefaultAsync(role => role.Name == "Administrator");

        if (administratorRole is null)
        {
            administratorRole = new Role
            {
                Name = "Administrator",
                Description = "Platform administrator"
            };
            database.Roles.Add(administratorRole);
            await database.SaveChangesAsync();
        }

        var administrator = await database.Users
            .SingleOrDefaultAsync(user => user.Email == email);

        if (administrator is null)
        {
            administrator = new User
            {
                Email = email,
                FullName = fullName ?? "PalTur Administrator",
                FullNameAr = fullName ?? "مدير منصة بالتور",
                Role = "Administrator",
                IsActive = true
            };

            administrator.PasswordHash = new PasswordHasher<User>()
                .HashPassword(administrator, password);
            database.Users.Add(administrator);
            await database.SaveChangesAsync();
        }

        var isAssigned = await database.UserRoles.AnyAsync(userRole =>
            userRole.UserId == administrator.Id && userRole.RoleId == administratorRole.Id);

        if (!isAssigned)
        {
            database.UserRoles.Add(new UserRole
            {
                UserId = administrator.Id,
                RoleId = administratorRole.Id
            });
            await database.SaveChangesAsync();
        }
    }
}
