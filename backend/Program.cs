using Application.Interfaces;
using Application.Services;
using Application.Mappings;
using Domain.Interfaces;
using Infrastructure;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
// O banco usado é MySQL; a connection string vem do appsettings.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("AppDbConnectionString"),
        new MySqlServerVersion(new Version(8, 0, 36))));

// Registro das camadas da aplicação.
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddAutoMapper(typeof(MappingProfile));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Minha API v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
