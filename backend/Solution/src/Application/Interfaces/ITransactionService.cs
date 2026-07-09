
using Application.DTOs.TransactionsDTOs;
using Domain;

namespace Application.Interfaces
{
    public interface ITransactionService
    {
         Task CreateTransactionAsync(CreateTransactionDto transaction);
         Task<IEnumerable<Transaction>> GetAllTransactionsAsync();
         Task<Transaction> UptadeTransactionAsync(int id, UpdateTransactionDto transactionUpdated);
         Task<Transaction> DeleteTransactionAsync(int id);
    }
}