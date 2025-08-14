using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBuddy.Data;
using ShopBuddy.Models;

namespace ShopBuddy.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly ShopBuddyContext _context;

    public ItemsController(ShopBuddyContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShoppingItem>>> GetItems()
    {
        return await _context.ShoppingItems
            .OrderBy(item => item.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingItem>> PostItem(ShoppingItemDto itemDto)
    {
        if (string.IsNullOrWhiteSpace(itemDto.Name))
        {
            return BadRequest("Item name cannot be empty.");
        }

        var item = new ShoppingItem
        {
            Name = itemDto.Name.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.ShoppingItems.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetItems), new { id = item.Id }, item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _context.ShoppingItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        _context.ShoppingItems.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}/toggle")]
    public async Task<IActionResult> ToggleItem(int id)
    {
        var item = await _context.ShoppingItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        item.IsCompleted = !item.IsCompleted;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class ShoppingItemDto
{
    public string Name { get; set; } = string.Empty;
}
