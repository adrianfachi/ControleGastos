using System.ComponentModel.DataAnnotations;
using Domain;

namespace Application.DTOs.TransactionsDTOs
{
    public class CreateTransactionDto
    {

        [MaxLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "O valor é um campo obrigatório.")]
        [Range(0.01, 100000000, ErrorMessage = "O valor deve ser maior do que zero.")]
        public decimal Value { get; set; }

        [Required(ErrorMessage = "O tipo é um campo obrigatório.")]
        [Range(0, 1, ErrorMessage = "O tipo deve ser 0 (Despesa) ou 1 (Receita).")]
        public TransactionType Type { get; set; }

        [Required(ErrorMessage = "A data é um campo obrigatório.")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set;}

        [Required(ErrorMessage = "O usuário é um campo obrigatório.")]
        public int UserId { get; set; }
    }
}