# ============================================================
#  Normalize Sitecore item names (URL-safe)
#  Run inside Sitecore PowerShell ISE (SPE module)
#
#  Rules:
#   1. Strip unsafe characters (commas, periods, apostrophes,
#      other special chars). Keep letters, digits and hyphens.
#   2. Replace spaces / whitespace with hyphens.
#   3. Collapse repeated hyphens and trim leading/trailing hyphens.
#   4. Transliterate accented / special letters to ASCII
#      (a -> a, n -> n, c -> c, a -> a, ss for ss).
#
#  Examples:
#     /doctor's-office!   -> /doctors-office
#     /our team           -> /our-team
#     /---our--team---    -> /our-team
#     /cirugia            -> /cirugia   (accents removed)
# ============================================================

# ===================== CONFIG =====================
# Where to start scanning (this item + all descendants).
$rootPath = "master:/sitecore/content/HenrySchein/Websites/NA/HenryScheinUS/Home"

# $true  = only report what WOULD change (no edits).
# $false = actually rename the items.
$dryRun = $false

# Only process items whose template NAME is in this list (page items).
$pageTemplates = @(
    "Home","SitePage","Page-Basic","Article-Basic","Article-Ecom-LongForm",
    "Article-Ecom-ShortForm","Article-Multimedia","CategoryLandingPage",
    "ContentDetailPage","ContentLandingPage","ContentListingPage","ErrorHandling",
    "FormPage","Testpage","ProductLisitingPage","StorefrontCategoryPage",
    "StorefrontContentDetailPage","StorefrontContentLandingPage",
    "StorefrontProductLisitingPage","StorefrontSearchPage","StorefrontSitePage",
    "DashboardSitePage"
)
# =================================================

# Characters that do NOT decompose via Unicode normalization and need
# an explicit ASCII mapping (German, French, Nordic, etc.).
# Case-sensitive hashtable so 'æ' and 'Æ' are treated as distinct keys.
$script:SpecialCharMap = New-Object 'System.Collections.Hashtable' ([System.StringComparer]::Ordinal)
$script:SpecialCharMap["ß"] = "ss"; $script:SpecialCharMap["ẞ"] = "SS"
$script:SpecialCharMap["æ"] = "ae"; $script:SpecialCharMap["Æ"] = "AE"
$script:SpecialCharMap["œ"] = "oe"; $script:SpecialCharMap["Œ"] = "OE"
$script:SpecialCharMap["ø"] = "o";  $script:SpecialCharMap["Ø"] = "O"
$script:SpecialCharMap["ł"] = "l";  $script:SpecialCharMap["Ł"] = "L"
$script:SpecialCharMap["đ"] = "d";  $script:SpecialCharMap["Đ"] = "D"
$script:SpecialCharMap["ð"] = "d";  $script:SpecialCharMap["Ð"] = "D"
$script:SpecialCharMap["þ"] = "th"; $script:SpecialCharMap["Þ"] = "Th"

function ConvertTo-Ascii {
    param([string]$text)

    # Replace non-decomposable specials first (e.g. ß -> ss)
    foreach ($key in $script:SpecialCharMap.Keys) {
        $text = $text.Replace($key, $script:SpecialCharMap[$key])
    }

    # Decompose accented letters (á -> a + combining accent) and drop the accents
    $decomposed = $text.Normalize([System.Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    foreach ($ch in $decomposed.ToCharArray()) {
        $category = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch)
        if ($category -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($ch)
        }
    }
    return $sb.ToString().Normalize([System.Text.NormalizationForm]::FormC)
}

function Get-NormalizedName {
    param([string]$name)

    if ([string]::IsNullOrWhiteSpace($name)) { return $name }

    # transliterate accented / special letters to ASCII (á->a, ñ->n, ç->c, ä->a, ß->ss)
    $result = ConvertTo-Ascii -text $name

    # 2) whitespace -> hyphen
    $result = [System.Text.RegularExpressions.Regex]::Replace($result, '\s+', '-')

    # normalize typographic apostrophes/quotes to nothing-safe removal below
    $result = $result -replace '[\u2018\u2019\u201C\u201D]', ''

    # 1) remove anything that is not an ASCII letter, digit or hyphen
    $result = [System.Text.RegularExpressions.Regex]::Replace($result, '[^A-Za-z0-9-]', '')

    # 3) collapse multiple hyphens, then trim leading/trailing hyphens
    $result = [System.Text.RegularExpressions.Regex]::Replace($result, '-{2,}', '-')
    $result = $result.Trim('-')

    return $result
}

$rootItem = Get-Item -Path $rootPath -ErrorAction SilentlyContinue
if (-not $rootItem) {
    Write-Host "Root item not found: $rootPath" -ForegroundColor Red
    return
}

$items = @(Get-Item -Path $rootPath) + @(Get-ChildItem -Path $rootPath -Recurse) |
    Where-Object { $pageTemplates -contains $_.TemplateName }

Write-Host "Scanning $($items.Count) page item(s). DryRun = $dryRun" -ForegroundColor Cyan

$affected = 0
$renamed  = 0
$skipped  = 0

foreach ($item in $items) {

    $oldName = $item.Name
    $newName = Get-NormalizedName -name $oldName

    # No change needed
    if ($newName -eq $oldName) { continue }

    # Safety: never rename to an empty name
    if ([string]::IsNullOrWhiteSpace($newName)) {
        Write-Host "[SKIP - empty result] $($item.Paths.FullPath)" -ForegroundColor DarkYellow
        $skipped++
        continue
    }

    # Safety: avoid a name collision with an existing sibling
    $sibling = $item.Parent.Children | Where-Object {
        $_.ID -ne $item.ID -and $_.Name -eq $newName
    }
    if ($sibling) {
        Write-Host "[SKIP - name exists] $($item.Paths.FullPath)  ->  '$newName'" -ForegroundColor DarkYellow
        $skipped++
        continue
    }

    $affected++
    Write-Host "[$($item.Paths.FullPath)]" -ForegroundColor Gray
    Write-Host "    '$oldName'  ->  '$newName'" -ForegroundColor Yellow

    if (-not $dryRun) {
        try {
            $item.Editing.BeginEdit()
            $item.Name = $newName
            $item.Editing.EndEdit() | Out-Null
            $renamed++
            Write-Host "    RENAMED" -ForegroundColor Green
        } catch {
            $item.Editing.CancelEdit()
            Write-Host "    ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "" 
Write-Host "Done. Affected: $affected | Renamed: $renamed | Skipped: $skipped | DryRun: $dryRun" -ForegroundColor Cyan
