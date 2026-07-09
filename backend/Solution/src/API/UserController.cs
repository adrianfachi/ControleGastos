using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Infrastructure;
using Domain;
using Application.Interfaces;
using Application.DTOs.UserDTOs;

namespace API
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;

        public UserController(IUserService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto user)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

             try 
            {
                await _service.CreateUserAsync(user);
                return StatusCode(201, user);
            }
            catch (Exception ex) 
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var users = await _service.GetAllUsersAsync();

            return Ok(users);
        }

        [HttpGet("totals")]
        public async Task<ActionResult> GetTotals()
        {
            // Expõe o resumo por pessoa e o consolidado geral de receitas, despesas e saldo.
            var totals = await _service.GetTotalsAsync();
            return Ok(totals);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
             try 
            {
                var user = await _service.GetUserByIdAsync(id);
                return StatusCode(201, user);
            }
            catch (Exception ex) 
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<User>> UpdateUserById(int id, [FromBody] UpdateUserDto userUpdated)
        {
             try 
            {
                var user = await _service.UptadeUserAsync(id, userUpdated);
                return StatusCode(204, user);
            }
            catch (Exception ex) 
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUserById(int id)
        {
            try 
            {
                var transaction = await _service.DeleteTUserAsync(id);
                return StatusCode(204, transaction);
            }
            catch (Exception ex) 
            {
                return NotFound(ex.Message);
            }
        }
    }
}