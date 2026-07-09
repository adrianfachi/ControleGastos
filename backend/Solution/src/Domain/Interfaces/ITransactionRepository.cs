namespace Domain.Interfaces
{
    public interface ITransactionRepository
    {
        Task CreateAsync(Transaction transaction);
        Task<IEnumerable<Transaction>> GetAllAsync();
        Task UpdateAsync ();
        Task DeleteAsync(int id);
        Task<Transaction> GetByIdAsync(int id);
    }
}