FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY PalTur.Api/PalTur.Api.csproj PalTur.Api/
RUN dotnet restore PalTur.Api/PalTur.Api.csproj

COPY PalTur.Api/ PalTur.Api/
RUN dotnet publish PalTur.Api/PalTur.Api.csproj \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "PalTur.Api.dll"]
