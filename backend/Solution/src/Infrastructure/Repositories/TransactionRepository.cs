using Domain;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _context;
        public TransactionRepository(AppDbContext context) => _context = context;

        public async Task CreateAsync(Transaction transaction) 
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Transaction>> GetAllAsync() => await _context.Transactions.ToListAsync();
        public async Task UpdateAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            
            var transaction = await _context.Transactions.FindAsync(id);

            //Se a entidade não estiver carregada (null), Cria um objeto "fantasma" apenas com o ID
            if (transaction == null)
            {
                transaction = new Transaction { Id = id };
                _context.Transactions.Attach(transaction);
            }

            _context.Transactions.Remove(transaction);
            
            await _context.SaveChangesAsync();
        }

        public async Task<Transaction> GetByIdAsync(int id) => await _context.Transactions.FindAsync(id);
        
    }
}