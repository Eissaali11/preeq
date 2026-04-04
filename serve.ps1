param(
  [string]$Path = "C:\Users\TWc\bareeq-agency",
  [int]$Port = 8000
)
Set-Location $Path
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $Path on http://localhost:$Port"
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $req = $context.Request
      $local = $req.Url.LocalPath.TrimStart('/')
      if ([string]::IsNullOrEmpty($local)) { $local = 'index.html' }
      $file = Join-Path $Path $local
      if (-not (Test-Path $file)) {
        $context.Response.StatusCode = 404
        $bytes = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
        $context.Response.ContentType = 'text/plain'
      } else {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        switch ([IO.Path]::GetExtension($file).ToLower()) {
          ".css" { $context.Response.ContentType = 'text/css' }
          ".js" { $context.Response.ContentType = 'application/javascript' }
          ".png" { $context.Response.ContentType = 'image/png' }
          ".jpg" { $context.Response.ContentType = 'image/jpeg' }
          ".jpeg" { $context.Response.ContentType = 'image/jpeg' }
          ".svg" { $context.Response.ContentType = 'image/svg+xml' }
          default { $context.Response.ContentType = 'text/html; charset=utf-8' }
        }
        $context.Response.ContentLength64 = $bytes.Length
      }
      $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
      $context.Response.OutputStream.Close()
    } catch {
      # ignore per-request errors
    }
  }
} finally {
  $listener.Stop()
  $listener.Close()
}
