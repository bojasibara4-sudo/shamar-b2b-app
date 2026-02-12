# Rebuild et relance du serveur
# 1. Arrêtez d'abord "npm run dev" (Ctrl+C) dans l'autre terminal
# 2. Puis exécutez ce script : .\rebuild-and-dev.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Suppression de .next ..." -ForegroundColor Cyan
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    if (Test-Path .next) {
        Write-Host "ERREUR: .next encore present. Arretez 'npm run dev' (Ctrl+C) puis relancez ce script." -ForegroundColor Red
        exit 1
    }
}
Write-Host "OK" -ForegroundColor Green

Write-Host "Build en cours ..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Build OK" -ForegroundColor Green

Write-Host "Demarrage du serveur dev ..." -ForegroundColor Cyan
npm run dev
