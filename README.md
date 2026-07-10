# ControleGastos

Aplicação full stack para controle de pessoas, transações e totais financeiros.

## Tecnologias

- Backend: ASP.NET Core + Entity Framework Core + PostgreSQL
- Frontend: React + TypeScript + Vite + Tailwind CSS

## Requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- .NET SDK 10
- Node.js 20+
- npm ou pnpm
- PostgreSQL em execução localmente

## Estrutura do projeto

- backend/: API ASP.NET Core
- frontend/: aplicação React/Vite

## Configuração do backend

1. Entre na pasta do backend:
   ```bash
   cd backend
   ```

2. Ajuste a connection string no arquivo `backend/appsettings.json` com as credenciais do seu PostgreSQL.

3. Restaure as dependências:
   ```bash
   dotnet restore
   ```

4. Execute as migrations (se ainda não tiver criado o banco):
   ```bash
   dotnet ef database update
   ```

5. Rode a API:
   ```bash
   dotnet run
   ```

A API ficará disponível em:
- http://localhost:5038
- ou na porta configurada pelo `launchSettings.json`

## Configuração do frontend

1. Entre na pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```

A interface ficará disponível em:
- http://localhost:5173

## Comandos úteis

### Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
npm run build
```

## Observações importantes

- O frontend está configurado para consumir a API via proxy no ambiente de desenvolvimento.
- Se o backend estiver rodando em outra porta, ajuste a URL no arquivo de configuração do frontend.
