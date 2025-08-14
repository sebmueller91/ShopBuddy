using Microsoft.EntityFrameworkCore;
using ShopBuddy.Models;

namespace ShopBuddy.Data;

public class ShopBuddyContext : DbContext
{
    public ShopBuddyContext(DbContextOptions<ShopBuddyContext> options) : base(options)
    {
    }

    public DbSet<ShoppingItem> ShoppingItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ShoppingItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.IsCompleted).IsRequired();
        });
    }
}
