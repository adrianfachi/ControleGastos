using Application.DTOs.UserDTOs;
using Application.DTOs.TotalsDTOs;
using Domain;

namespace Application.Interfaces
{
    public interface IUserService
    {
         Task CreateUserAsync(CreateUserDto user);
         Task<IEnumerable<User>> GetAllUsersAsync();
         Task<User> UptadeUserAsync(int id, UpdateUserDto userUpdated);
         Task<User> DeleteTUserAsync(int id);
         Task<User> GetUserByIdAsync(int id);
         Task<TotalsResponseDto> GetTotalsAsync();
    }
}