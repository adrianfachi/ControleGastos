using System.Collections.Generic;

namespace Application.DTOs.TotalsDTOs
{
    /// <summary>
    /// Resposta consolidada da consulta de totais com detalhamento por pessoa.
    /// </summary>
    public class TotalsResponseDto
    {
        public List<UserTotalDto> Users { get; set; } = new();
        public decimal TotalIncome { get; set; }
        public decimal TotalExpense { get; set; }
        public decimal Balance { get; set; }
    }
}