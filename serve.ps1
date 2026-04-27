# Blog local server
# Right-click → "Run with PowerShell" or run: powershell -ExecutionPolicy Bypass -File serve.ps1
Write-Host "Starting blog server at http://localhost:8080" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray

if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server 8080
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    python3 -m http.server 8080
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    npx serve . -p 8080 --no-clipboard
} else {
    Write-Host "ERROR: Install Python or Node.js for the local server." -ForegroundColor Red
    Write-Host "Python: https://python.org | Node: https://nodejs.org" -ForegroundColor Red
    pause
}
