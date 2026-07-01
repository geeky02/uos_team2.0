# PowerShell script to add lazy loading to all HTML files

$lazyLoadScriptBlock = @"
    <!-- Lazy loading script -->

    <script src="assets/js/lazy-load.js" defer></script>
"@

$searchPattern = '    <script src="assets/js/script.js" defer></script>'

Get-ChildItem -Filter "*.html" -File | ForEach-Object {
    $filePath = $_.FullName
    $fileName = $_.Name
    
    try {
        $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
        
        if ($content -notmatch 'lazy-load\.js') {
            # Replace the script.js line with script.js + lazy-load.js
            $newContent = $content -replace [regex]::Escape($searchPattern), ($searchPattern + "" + $lazyLoadScriptBlock)
            
            [System.IO.File]::WriteAllText($filePath, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "✓ Updated: $fileName"
        } else {
            Write-Host "✓ Already has lazy-load.js: $fileName"
        }
    } catch {
        Write-Host "✗ Error updating $fileName : $_"
    }
}

Write-Host "Done!"
