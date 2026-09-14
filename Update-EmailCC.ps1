# ============================================================
#  Update EmailCC field on items of a specific template
#  Language: it-IT
#  Run inside Sitecore PowerShell ISE (SPE module)
# ============================================================

# ===================== CONFIG =====================
# Folder to scan (this item + all descendants are checked).
$rootPath = "master:/sitecore/content/HenrySchein/Websites/EU/HenryScheinIT/..."

# Only items of this template are updated.
$templateId = "{801FDA12-F71F-432F-AD80-A0E33FF50F4E}"

# Language version to update.
$language = "it-IT"

# Field to update (single-line text) and the value to set.
$fieldName  = "EmailCC"
$fieldValue = "claudio.consonni@henryschein.it, elisabetta.scortichini@henryschein.it, serena.guidone@henryschein.it"

# $true  = only report what WOULD change (no edits).
# $false = actually update the items.
$dryRun = $true
# =================================================

$rootItem = Get-Item -Path $rootPath -ErrorAction SilentlyContinue
if (-not $rootItem) {
    Write-Host "Root item not found: $rootPath" -ForegroundColor Red
    return
}

# All descendants matching the template
$items = @(Get-Item -Path $rootPath) + @(Get-ChildItem -Path $rootPath -Recurse) |
    Where-Object { $_.TemplateID.ToString() -eq $templateId }

Write-Host "Found $($items.Count) item(s) of template $templateId. Language: $language. DryRun = $dryRun" -ForegroundColor Cyan

$updated = 0
$skipped = 0

foreach ($item in $items) {

    # Get the it-IT version of the item
    $langItem = Get-Item -Path $item.Paths.FullPath -Language $language

    if ($langItem.Versions.Count -eq 0) {
        Write-Host "[SKIP - no $language version] $($item.Paths.FullPath)" -ForegroundColor DarkGray
        $skipped++
        continue
    }

    $currentValue = $langItem[$fieldName]

    if ($dryRun) {
        Write-Host "[DRYRUN] $($item.Paths.FullPath)" -ForegroundColor Yellow
        Write-Host "    '$currentValue'  ->  '$fieldValue'"
    } else {
        try {
            $langItem.Editing.BeginEdit()
            $langItem[$fieldName] = $fieldValue
            $langItem.Editing.EndEdit() | Out-Null
            $updated++
            Write-Host "[UPDATED] $($item.Paths.FullPath)" -ForegroundColor Green
        } catch {
            $langItem.Editing.CancelEdit()
            Write-Host "[ERROR] $($item.Paths.FullPath) : $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Done. Updated: $updated | Skipped: $skipped | DryRun: $dryRun" -ForegroundColor Cyan
