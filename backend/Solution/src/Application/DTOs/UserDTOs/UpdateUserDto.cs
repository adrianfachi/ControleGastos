using System.ComponentModel.DataAnnotations;

namespace Application.DTOs.UserDTOs
{
    public class UpdateUserDto
    {

        [StringLength(100, MinimumLength = 3, ErrorMessage = "O nome deve ter entre 3 e 100 caracteres.")]
        public string Name { get; set; }

        [Range(0, 120, ErrorMessage = "O idade deve ser entre 0 e 120 anos.")]
        public int? Age { get; set; }
    }
}