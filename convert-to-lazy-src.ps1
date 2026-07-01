# Robust conversion: replace local <img src="..."> with data-src and a tiny SVG placeholder
$placeholder = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1 1%27%3E%3C/svg%3E'

$files = Get-ChildItem -Filter "*.html" -File
foreach ($f in $files) {
    $path = $f.FullName
    $name = $f.Name
    try {
        $text = Get-Content -Raw -Encoding UTF8 $path
    } catch {
        Write-Host "Error reading $name"
        continue
    }

    if ($text -match 'data-src') {
        Write-Host "Skipping (already converted): $name"
        continue
    }

    $pattern = '<img\b[^>]*\bsrc="([^"]+)"[^>]*>'
    $matches = [System.Text.RegularExpressions.Regex]::Matches($text, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($matches.Count -eq 0) {
        Write-Host "No img tags: $name"
        continue
    }

    $newText = $text
    # Replace matches in reverse order to preserve indices
    for ($i = $matches.Count - 1; $i -ge 0; $i--) {
        $m = $matches[$i]
        $tag = $m.Value
        $src = $m.Groups[1].Value
        if ($src -match '^(https?:|data:|//)') { continue }
        $tagNoSrc = [System.Text.RegularExpressions.Regex]::Replace($tag, '\s+src="[^"]+"', '', 1)
        if ($tagNoSrc -match '\sloading=') { $loading = '' } else { $loading = ' loading="lazy"' }
        $replacement = [System.Text.RegularExpressions.Regex]::Replace($tagNoSrc, '(<img\b)', ('<img data-src="' + $src + '" src="' + $placeholder + '"' + $loading))
        # perform replacement at correct position
        $newText = $newText.Substring(0, $m.Index) + $replacement + $newText.Substring($m.Index + $m.Length)
    }

    if ($newText -ne $text) {
        try {
            [System.IO.File]::WriteAllText($path, $newText, [System.Text.Encoding]::UTF8)
            Write-Host "Updated: $name"
        } catch {
            Write-Host "Error writing $name"
        }
    } else {
        Write-Host "No changes: $name"
    }
}

Write-Host "Done converting images to data-src."
