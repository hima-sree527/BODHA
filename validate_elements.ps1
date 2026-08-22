# Validation Script for Bodha Single Page App with Pricing & Modal
$htmlContent = Get-Content -Path "c:\Users\naren\OneDrive\Documents\Desktop\BODHA\index.html" -Raw

$requiredElements = @(
  # Section 0 Opening Animation
  "openingIntroOverlay", "introSkipBtn",
  # Navbar & Brand
  "nav-brand-link", "nav-demo-btn", "nav-signup-btn",
  # Hero Section Dashboard & Actions
  "hero-demo-cta", "hero-school-cta", "heroDashboardCard", "dashHeaderTitle", "dashStatusPill",
  "dashStatVal1", "dashStatVal2", "dashStatVal3", "dashAlertBanner", "dashAlertTitle", "dashAlertDesc", "dashStudentsList", "personaPillGroup",
  # Simulator Controls
  "ageSlider", "ageDisplay", "ageBandPill",
  "chip-cricket", "chip-gaming", "chip-space", "chip-animals", "chip-music", "chip-movies",
  "customInterestInput", "applyCustomInterestBtn", "btnRandomize", "btnResetDemo",
  # AI Output & Mascot
  "aiResponseCard", "thinkingOverlay", "thinkingMascot", "thinkingStatusText",
  "metaConceptBadge", "metaToneBadge", "metaInterestBadge",
  "mascotAvatarContainer", "aiExplanationBody", "fractionVisualContainer",
  # Socratic Check
  "understandingCheckBlock", "checkQuestionText", "checkOptionsContainer", "checkFeedbackText",
  # Multilingual Tabs
  "lang-en", "lang-hi", "lang-ta", "lang-te", "lang-mr", "langPreviewText",
  # Section 5 Showcase
  "lessons",
  # Section 6 Pricing & Sign-Up Modal
  "pricing", "pricing-card-starter", "pricing-card-school", "pricing-card-enterprise",
  "signUpModal", "modalPlanBadge", "modalFormContent", "modalFullName", "modalSchoolName", "modalEmail", "modalPassword",
  "mockCardNum", "mockExpiry", "mockCvc", "modalSubmitBtn", "modalSuccessState",
  # Section 7 B2B School Form
  "schools", "demoFormCard", "schoolPilotForm", "adminName", "schoolName", "adminEmail",
  "studentCount", "boardAffiliation", "submitPilotBtn", "formSuccessBlock",
  # Conversational Demo Chat
  "tutorChatThread", "initialAiMsgRow", "tutorFollowupForm", "tutorFollowupInput", "btnSendFollowup",
  # Floating Site-Wide Help Widget
  "floatingHelpWidget", "floatingHelpTrigger", "floatingHelpPanel", "helpChatMessages", "helpSuggestions", "helpQueryForm", "helpQueryInput", "helpSendBtn"
)

$missing = @()
foreach ($id in $requiredElements) {
  if ($htmlContent -notmatch "id=['""]$id['""]") {
    $missing += $id
  }
}

if ($missing.Count -eq 0) {
  Write-Host "SUCCESS: All $($requiredElements.Count) interactive elements and IDs are present!"
} else {
  Write-Host "FAILED: Missing $($missing.Count) element(s): $($missing -join ', ')"
  exit 1
}
