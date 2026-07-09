using System.ComponentModel.DataAnnotations;
using Domain;

namespace Application.DTOs.TransactionsDTOs
{
    public class UpdateTransactionDto
    {
        [MaxLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
        public string Description { get; set; }

        [Range(0.01, 100000000, ErrorMessage = "O valor deve ser maior do que zero.")]
        public decimal? Value { get; set; }

        public TransactionType? Type { get; set; }

        [DataType(DataType.Date)]
        public DateTime? Date { get; set;}

        public int? UserId { get; set; }
    }
}