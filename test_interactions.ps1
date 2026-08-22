# Verify All Interactive Functions in index.html
$html = Get-Content -Path "c:\Users\naren\OneDrive\Documents\Desktop\BODHA\index.html" -Raw

$functionChecks = @(
  "skipOpeningIntro",
  "openSignUpModal",
  "closeSignUpModal",
  "handleBackdropClick",
  "handleModalSubmit",
  "handleFormSubmit",
  "resetFormState",
  "updateTutorSimulation",
  "renderVisualFraction",
  "getMascotSvgHtml",
  "generateTutorFollowupResponse",
  "handleTutorFollowup",
  "sendQuickFollowup",
  "toggleFloatingHelp",
  "closeFloatingHelp",
  "generateSiteHelpResponse",
  "handleHelpQuery",
  "handleHelpFormSubmit",
  "navigateFromHelp",
  "switchHeroPersona",
  "scrollToSection"
)

$missingFuncs = @()
foreach ($func in $functionChecks) {
  if ($html -notmatch "function\s+$func") {
    $missingFuncs += $func
  }
}

if ($missingFuncs.Count -eq 0) {
  Write-Host "SUCCESS: All $($functionChecks.Count) JavaScript interaction functions are defined!"
} else {
  Write-Host "FAILED: Missing functions: $($missingFuncs -join ', ')"
  exit 1
}
