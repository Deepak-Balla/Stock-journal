# Publishes Stock Journal to Firebase Hosting and updates the Firestore security rules.
# Usage (from this folder):   powershell -ExecutionPolicy Bypass -File .\deploy.ps1
# First time only:            npx.cmd firebase-tools login   and   npx.cmd firebase-tools use --add
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$cfg = Get-Content firebase-config.js -Raw
if ($cfg -match 'apiKey:\s*""' -or $cfg -match 'projectId:\s*""') {
  Write-Host 'firebase-config.js is still empty. Fill it in first (see SETUP.md, step 2).' -ForegroundColor Red
  exit 1
}

# Build the site folder that Firebase Hosting serves
if (Test-Path site) { Remove-Item -Recurse -Force site }
New-Item -ItemType Directory site | Out-Null
Copy-Item stock_journal_main.html site\index.html
Copy-Item firebase-config.js, manifest.webmanifest, sw.js site\
Copy-Item icons site\icons -Recurse

npx.cmd --yes firebase-tools deploy --only "hosting,firestore:rules"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host 'Deployed. Open the Hosting URL shown above on any device.' -ForegroundColor Green
