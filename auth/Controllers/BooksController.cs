using auth.Data;
using auth.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly DatabaseContext context;
        private readonly UserManager<AppUser> userManager;

        public BooksController(DatabaseContext context, UserManager<AppUser> userManager)
        {
            this.context = context;
            this.userManager = userManager;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var books = await context.Books.ToListAsync();
            return Ok(books);
        } 

        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] Book book)
        {

            await context.Books.AddAsync(book);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooks),book);
        }
        

    }
}
