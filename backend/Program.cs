using Application.Interfaces;
using Application.Services;
using Application.Mappings;
using Domain.Interfaces;
using Infrastructure;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// --- Configuração de Ambiente e Conexão ---
builder.Configuration.AddJsonFile("appsettings.json", optional: false)
                     .AddEnvironmentVariables();

string connectionString = builder.Configuration.GetConnectionString("AppDbConnectionString")
    ?? Environment.GetEnvironmentVariable("AppDbConnectionString")
    ?? "Host=localhost;Port=5432;Database=controle_gastos;Username=postgres;Password=postgres";

if (connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
{
    if (Uri.TryCreate(connectionString, UriKind.Absolute, out var uri))
    {
        var pgBuilder = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.IsDefaultPort ? 5432 : uri.Port,
            Database = uri.AbsolutePath.Trim('/'),
            Username = Uri.UnescapeDataString(uri.UserInfo.Split(':')[0]),
            Password = uri.UserInfo.Contains(':') ? Uri.UnescapeDataString(uri.UserInfo.Split(':')[1]) : string.Empty,
            SslMode = SslMode.Require
        };
        connectionString = pgBuilder.ConnectionString;
    }
}

// --- Serviços ---
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddOpenApi();

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
        policy.WithOrigins("https://controle-gastos-azure.vercel.app")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// --- Pipeline HTTP (A ORDEM IMPORTA!) ---

// 1. Migrações automáticas
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate(); 
}

// 2. Middlewares de Segurança e Roteamento
app.UseHttpsRedirection();
app.UseRouting(); 

// O CORS deve ser aplicado aqui, antes da Autenticação/Autorização
app.UseCors("AllowVercel");

app.UseAuthorization();
app.MapControllers();

app.Run();