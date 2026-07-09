using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;
using Application.DTOs.TransactionsDTOs;

namespace API
{
    // Controlador das transações exposto pela API REST.
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController: ControllerBase
    {

        private readonly ITransactionService _service;
        public TransactionController(ITransactionService service) {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction(CreateTransactionDto transaction)
        {
            // O ModelState garante que o DTO chegou com os campos obrigatórios preenchidos.
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try 
            {
                await _service.CreateTransactionAsync(transaction);
                return StatusCode(201, transaction);
            }
            catch (Exception ex) 
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> getTransactions()
        {
            var transactions = await _service.GetAllTransactionsAsync();

            return Ok(transactions);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<Transaction>> updateTransaction(int id, [FromBody] UpdateTransactionDto transactionUpdated)
        {
            
            try 
            {
                var transaction = await _service.UptadeTransactionAsync(id, transactionUpdated);
                return StatusCode(204, transaction);
            }
            catch (Exception ex) 
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Transaction>> deleteTransaction(int id)
        {

            try 
            {
                var transaction = await _service.DeleteTransactionAsync(id);
                return StatusCode(204, transaction);
            }
            catch (Exception ex) 
            {
                return NotFound(ex.Message);
            }
        }
        
    }
}