using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Transaction
    {
        public int Id { get; set; }

        [MaxLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "O valor é um campo obrigatório.")]
        [Range(0.01, 100000000, ErrorMessage = "O valor deve ser maior do que zero.")]
        public double Value { get; set; }

        [Required(ErrorMessage = "O tipo é um campo obrigatório.")]
        public TransactionType Type { get; set; }

        [Required(ErrorMessage = "A data é um campo obrigatório.")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set;}

        [Required(ErrorMessage = "O usuário é um campo obrigatório.")]
        public int UserId { get; set; }
    }
}