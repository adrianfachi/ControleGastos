
namespace Domain.Interfaces
{
    public interface IUserRepository
    {    
         Task CreateAsync(User user);
         Task<IEnumerable<User>> GetAllAsync();
         Task UpdateAsync();
         Task DeleteAsync(int id);
         Task<User> GetByIdAsync(int id);
    }
}