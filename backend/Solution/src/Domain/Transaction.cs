
namespace Domain
{
    public class Transaction
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Value { get; set; }
        public TransactionType Type { get; set; }
        public DateTime Date { get; set;}
        public int UserId { get; set; }
    }
}