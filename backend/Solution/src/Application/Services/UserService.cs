using Application.DTOs.UserDTOs;
using Application.DTOs.TotalsDTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Interfaces;

namespace Application.Services
{
    public class UserService: IUserService
    {

        IMapper _mapper;
        IUserRepository _repository;
        ITransactionRepository _transactionRepository;

        public UserService(IMapper mapper, IUserRepository repository, ITransactionRepository transactionRepository)
        {
            _mapper = mapper;
            _repository = repository;
            _transactionRepository = transactionRepository;
        }

        public async Task CreateUserAsync(CreateUserDto userDto)
        {
            var user = new User
            {
                Name = userDto.Name,
                Age = userDto.Age
            };

            await _repository.CreateAsync(user);
        }
        public async Task<IEnumerable<User>> GetAllUsersAsync() => await _repository.GetAllAsync();
        public async Task<User> UptadeUserAsync(int id, UpdateUserDto userUpdated)
        {
            var existing = await _repository.GetByIdAsync(id);
        
            // O AutoMapper aplica o DTO sobre a entidade existente
            _mapper.Map(userUpdated, existing);
            
            await _repository.UpdateAsync();
            return existing;
        }
        public async Task<User> DeleteTUserAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);

            if (user == null)
            {
                throw new Exception("Usuário não encontrada");
            }

            
            await _repository.DeleteAsync(id);
            return user;
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
            {
                throw new Exception("Usuário não encontrada");
            }
            return user;
        }

        public async Task<TotalsResponseDto> GetTotalsAsync()
        {
            var users = await _repository.GetAllAsync();
            var transactions = await _transactionRepository.GetAllAsync();

            var userTotals = users.Select(user =>
            {
                // O cálculo é feito por pessoa para refletir exatamente o resumo solicitado na especificação.
                var userTransactions = transactions.Where(transaction => transaction.UserId == user.Id);
                var totalIncome = userTransactions.Where(transaction => transaction.Type == TransactionType.Income).Sum(transaction => transaction.Value);
                var totalExpense = userTransactions.Where(transaction => transaction.Type == TransactionType.Expense).Sum(transaction => transaction.Value);

                return new UserTotalDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Age = user.Age,
                    TotalIncome = totalIncome,
                    TotalExpense = totalExpense,
                    Balance = totalIncome - totalExpense
                };
            }).ToList();

            return new TotalsResponseDto
            {
                Users = userTotals,
                TotalIncome = userTotals.Sum(user => user.TotalIncome),
                TotalExpense = userTotals.Sum(user => user.TotalExpense),
                Balance = userTotals.Sum(user => user.Balance)
            };
        }
    }
}