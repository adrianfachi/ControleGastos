namespace Application.DTOs.TotalsDTOs
{
    /// <summary>
    /// Resumo financeiro de uma pessoa para a consulta de totais.
    /// </summary>
    public class UserTotalDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal Balance { get; set; }
    }
}