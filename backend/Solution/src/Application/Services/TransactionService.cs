using Application.Interfaces;
using Domain.Interfaces;
using Domain;
using Application.DTOs.TransactionsDTOs;
using AutoMapper;

namespace Application.Services;

public class TransactionService : ITransactionService
{
    private readonly IMapper _mapper;
    private readonly ITransactionRepository _repository;
    private readonly IUserRepository _userRepository;

    public TransactionService(IMapper mapper, ITransactionRepository repository, IUserRepository userRepository)
    {
        _mapper = mapper;
        _repository = repository;
        _userRepository = userRepository;
    }

    public async Task CreateTransactionAsync(CreateTransactionDto transactionDto)
    {
        // Antes de salvar, confirmamos se a pessoa existe e se a regra de idade permite a operação.
        var userExists = await _userRepository.GetByIdAsync(transactionDto.UserId);
        
        if (userExists == null)
            throw new Exception("Usuário não encontrado.");

        // Menores de 18 anos só podem registrar despesas.
        if (userExists.Age < 18 && transactionDto.Type == TransactionType.Income)
            throw new Exception("Menores de idade não podem cadastrar receitas.");

        var transaction = new Transaction
        {
            Description = transactionDto.Description,
            Value = transactionDto.Value,
            Date = transactionDto.Date,
            Type = transactionDto.Type,
            UserId = transactionDto.UserId
        };

        await _repository.CreateAsync(transaction);
    }

    public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync() => await _repository.GetAllAsync();

    public async Task<Transaction> UptadeTransactionAsync(int id, UpdateTransactionDto transactionUpdated)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
        {
            throw new Exception("Transação não encontrada");
        }

        int userId = transactionUpdated.UserId ?? existing.UserId;

        // Se o DTO não mandar um campo, mantemos o valor atual da transação.
        TransactionType finalType = transactionUpdated.Type ?? existing.Type;

        // A validação usa o estado final para evitar atualizar algo inválido.
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new Exception("Usuário não encontrado.");

        if (user.Age < 18 && finalType == TransactionType.Income)
        {
            throw new Exception("Operação inválida: Usuário menor de 18 anos não pode ter receita.");
        }
        
        // O AutoMapper aplica os dados do DTO sobre o registro já encontrado.
        _mapper.Map(transactionUpdated, existing);
        
        await _repository.UpdateAsync();
        return existing;
    }

    public async Task<Transaction> DeleteTransactionAsync(int id)
    {
        var transaction = await _repository.GetByIdAsync(id);

        if (transaction == null)
        {
            throw new Exception("Transação não encontrada");
        }

        
        await _repository.DeleteAsync(id);
        return transaction;
    }
}