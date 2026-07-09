FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["backend.csproj", "./"]
RUN dotnet restore "backend.csproj"

COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:$PORT
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .

EXPOSE 10000

ENTRYPOINT ["dotnet", "backend.dll"]
