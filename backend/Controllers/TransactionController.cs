using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController: ControllerBase
    {

        private readonly AppDbContext _appDbContext;

        public TransactionController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction(Transaction transaction)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userExists = await _appDbContext.Users.AnyAsync(u => u.Id == transaction.UserId);

            if (!userExists)
            {
                return NotFound("Usuário não encontrado");
            }

            _appDbContext.Transactions.Add(transaction);
            await _appDbContext.SaveChangesAsync();

            return StatusCode(201, transaction);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> getTransactions()
        {
            var transactions = await _appDbContext.Transactions.ToListAsync();

            return Ok(transactions);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Transaction>> updateTransaction(int id, [FromBody] Transaction transactionUpdated)
        {
            var transaction = await _appDbContext.Transactions.FindAsync(id);

            if (transaction == null)
            {
                return NotFound("Transação não encontrada");
            }

            _appDbContext.Transactions.Entry(transaction).CurrentValues.SetValues(transactionUpdated);
            await _appDbContext.SaveChangesAsync();

            return StatusCode(204, transaction);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Transaction>> deleteTransaction(int id)
        {
            var transaction = await _appDbContext.Transactions.FindAsync(id);

            if (transaction == null)
            {
                return NotFound("Transação não encontrada");
            }

            _appDbContext.Transactions.Remove(transaction);

            return StatusCode(204, transaction);
        }
        
    }
}