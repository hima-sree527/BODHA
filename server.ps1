$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Server running at http://localhost:8080/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $localPath = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "index.html"
        }

        $fullPath = Join-Path "c:\Users\naren\OneDrive\Documents\Desktop\BODHA" $localPath
        if (-not (Test-Path $fullPath) -or (Test-Path $fullPath -PathType Container)) {
            $fullPath = "c:\Users\naren\OneDrive\Documents\Desktop\BODHA\index.html"
        }

        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        if ($fullPath.EndsWith(".html")) {
            $res.ContentType = "text/html; charset=utf-8"
        } elseif ($fullPath.EndsWith(".css")) {
            $res.ContentType = "text/css"
        } elseif ($fullPath.EndsWith(".js")) {
            $res.ContentType = "application/javascript"
        } elseif ($fullPath.EndsWith(".jpg") -or $fullPath.EndsWith(".jpeg")) {
            $res.ContentType = "image/jpeg"
        } elseif ($fullPath.EndsWith(".png")) {
            $res.ContentType = "image/png"
        } else {
            $res.ContentType = "text/plain"
        }

        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.OutputStream.Close()
    } catch {
        # continue
    }
}
