# ============================================================
#  Export EmailMessage (rich text -> plain text) to Excel/CSV
#  Language: it-IT
#  Run inside Sitecore PowerShell ISE (SPE module)
#
#  Output opens in a grid; use the toolbar Export button to
#  download as Excel / CSV through your browser.
# ============================================================

# ===================== CONFIG =====================
# Folder to scan (this item + all descendants are checked).
$rootPath = "master:/sitecore/content/HenrySchein/Websites/EU/HenryScheinIT/..."

# Only items of this template are included.
$templateId = "{801FDA12-F71F-432F-AD80-A0E33FF50F4E}"

# Language version to read.
$language = "it-IT"

# Rich text field to export.
$fieldName = "EmailMessage"
# =================================================

# Turn HTML from a rich text field into readable plain text
# (roughly what the "Show editor" view displays).
function Get-PlainText {
    param([string]$html)

    if ([string]::IsNullOrWhiteSpace($html)) { return "" }

    $text = $html

    # Drop script/style blocks entirely
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, '(?is)<(script|style).*?</\1>', '')

    # Block-level tags / line breaks -> newline
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, '(?i)<br\s*/?>', "`n")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, '(?i)</(p|div|li|tr|h[1-6]|table|ul|ol)>', "`n")

    # Remove all remaining tags
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, '(?s)<[^>]+>', '')

    # Decode HTML entities (&amp; &nbsp; &copy; etc.)
    $text = [System.Net.WebUtility]::HtmlDecode($text)

    # Tidy whitespace: treat non-breaking spaces as normal spaces,
    # collapse runs of spaces, and collapse blank lines into single breaks.
    $text = $text -replace [char]0x00A0, ' '
    $text = $text -replace '[ \t]+', ' '
    $text = ($text -split "`n" | ForEach-Object { $_.Trim() }) -join "`n"
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, '(\r?\n)+', "`n")

    return $text.Trim()
}

$rootItem = Get-Item -Path $rootPath -ErrorAction SilentlyContinue
if (-not $rootItem) {
    Write-Host "Root item not found: $rootPath" -ForegroundColor Red
    return
}

$items = @(Get-Item -Path $rootPath) + @(Get-ChildItem -Path $rootPath -Recurse) |
    Where-Object { $_.TemplateID.ToString() -eq $templateId }

Write-Host "Found $($items.Count) item(s). Language: $language" -ForegroundColor Cyan

$results = New-Object System.Collections.Generic.List[object]

foreach ($item in $items) {

    $langItem = Get-Item -Path $item.Paths.FullPath -Language $language

    if ($langItem.Versions.Count -eq 0) {
        Write-Host "[SKIP - no $language version] $($item.Paths.FullPath)" -ForegroundColor DarkGray
        continue
    }

    $rawHtml   = $langItem[$fieldName]
    $plainText = Get-PlainText -html $rawHtml

    $results.Add([pscustomobject]@{
        "Item Name"    = $item.Name
        "EmailMessage" = $plainText
    })
}

Write-Host "Done. Prepared $($results.Count) row(s)." -ForegroundColor Green

# Show results in an interactive grid. Use the toolbar Export button
# (Excel / CSV) to download the file through your browser.
$results |
    Show-ListView -Property "Item Name", "EmailMessage" `
                  -Title "EmailMessage Export ($language)" `
                  -InfoTitle "EmailMessage (plain text)" `
                  -InfoDescription "Item Name and EmailMessage rich text with HTML stripped"

Close-Window
