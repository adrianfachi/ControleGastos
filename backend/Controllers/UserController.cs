using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public UserController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(User user)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _appDbContext.Users.Add(user);
            await _appDbContext.SaveChangesAsync();

            return StatusCode(201, user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _appDbContext.Users.ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Usuário não encontrado");
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<User>> UpdateUserById(int id, [FromBody] User userUpdated)
        {
            var user = await _appDbContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Usuário não encontrado");
            }

            _appDbContext.Users.Entry(user).CurrentValues.SetValues(userUpdated);

            await _appDbContext.SaveChangesAsync();
            return StatusCode(204, user);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUserById(int id)
        {
            var user = await _appDbContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            _appDbContext.Users.Remove(user);

            await _appDbContext.SaveChangesAsync();
            return StatusCode(204, user);
        }
    }
}