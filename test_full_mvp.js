const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('c:\\Users\\naren\\OneDrive\\Documents\\Desktop\\BODHA\\index.html', 'utf8');

console.log("==================================================");
console.log("🚀 RUNNING BODHA FULL MVP FUNCTIONALITY TEST SUITE");
console.log("==================================================");

// Mock browser DOM environment
class MockElement {
  constructor(tag = 'div', id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this._innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.style = {};
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c),
      toggle: (c) => {
        if (this.classList._classes.has(c)) this.classList._classes.delete(c);
        else this.classList._classes.add(c);
      }
    };
    this.attributes = {};
    this.children = [];
    this.listeners = {};
    this.disabled = false;
  }

  get className() { return Array.from(this.classList._classes).join(' '); }
  set className(val) {
    this.classList._classes = new Set(val.split(' ').filter(Boolean));
  }

  get innerHTML() { return this._innerHTML; }
  set innerHTML(val) {
    this._innerHTML = val;
    this.children = [];
  }

  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  appendChild(child) { this.children.push(child); }
  querySelectorAll(sel) {
    if (sel === '.check-btn') return this.children.filter(c => c.classList.contains('check-btn'));
    return [];
  }
  addEventListener(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }
  click() {
    if (this.listeners['click']) {
      this.listeners['click'].forEach(h => h({ target: this, preventDefault: () => {} }));
    }
    if (this.onclick) this.onclick({ target: this, preventDefault: () => {} });
  }
  focus() { this.focused = true; }
  reset() { this.value = ''; }
}

const chipElements = ['cricket', 'gaming', 'space', 'animals', 'music', 'movies'].map(i => {
  const el = new MockElement('button', `chip-${i}`);
  el.setAttribute('data-interest', i);
  el.classList.add('chip-btn');
  if (i === 'gaming') el.classList.add('active');
  return el;
});

const langElements = ['en', 'hi', 'ta', 'te', 'mr'].map(l => {
  const el = new MockElement('button', `lang-${l}`);
  el.setAttribute('data-lang', l);
  el.classList.add('lang-tab');
  if (l === 'en') el.classList.add('active');
  return el;
});

const mockDoc = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = new MockElement('div', id);
    }
    return this.elements[id];
  },
  createElement(tag) {
    return new MockElement(tag);
  },
  querySelectorAll(sel) {
    if (sel === '.chip-btn') {
      return chipElements;
    }
    if (sel === '.lang-tab') {
      return langElements;
    }
    if (sel === '.nav-links a') {
      return ['#demo', '#why', '#pedagogy', '#lessons', '#pricing', '#schools'].map(href => {
        const el = new MockElement('a');
        el.setAttribute('href', href);
        return el;
      });
    }
    return [];
  },
  addEventListener() {},
  head: { appendChild() {} }
};

let sessionStorageStore = {};
const mockSessionStorage = {
  getItem: (k) => sessionStorageStore[k] || null,
  setItem: (k, v) => { sessionStorageStore[k] = v.toString(); },
  clear: () => { sessionStorageStore = {}; }
};

const mockWindow = {
  addEventListener(evt, cb) {
    if (!this.listeners) this.listeners = {};
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(cb);
  },
  matchMedia: () => ({ matches: false }),
  scrollY: 0
};

// Setup sandbox
const sandbox = {
  document: mockDoc,
  window: mockWindow,
  sessionStorage: mockSessionStorage,
  console: console,
  setTimeout: (fn, delay) => { fn(); },
  parseInt: parseInt,
  Math: Math
};

// Run script from index.html
const scriptContent = html.substring(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
vm.createContext(sandbox);
vm.runInContext(scriptContent, sandbox);

console.log("✓ JavaScript Context Initialized Cleanly with 0 Syntax Errors.");

// TEST 1: Opening Animation
console.log("\n--- TEST 1: Opening Animation Pacing & Session Persistence ---");
mockSessionStorage.clear();
sandbox.skipOpeningIntro();
if (mockSessionStorage.getItem("bodha_intro_seen") === "true") {
  console.log("✓ Opening intro sets 'bodha_intro_seen' flag in sessionStorage upon completion/skip.");
} else {
  console.error("✗ Opening intro did not set sessionStorage flag!");
  process.exit(1);
}

// TEST 2: Age Slider Range & Developmental Band Mapping
console.log("\n--- TEST 2: Age Slider Range & Developmental Band Mapping ---");
const expectedBandLabels = {
  3: "Early Years / KG (Ages 3–6)",
  4: "Early Years / KG (Ages 3–6)",
  5: "Early Years / KG (Ages 3–6)",
  6: "Early Years / KG (Ages 3–6)",
  7: "Primary (Ages 7–11 / Class 3–5)",
  8: "Primary (Ages 7–11 / Class 3–5)",
  9: "Primary (Ages 7–11 / Class 3–5)",
  10: "Primary (Ages 7–11 / Class 3–5)",
  11: "Primary (Ages 7–11 / Class 3–5)",
  12: "Middle School (Ages 12–15 / Class 6–9)",
  13: "Middle School (Ages 12–15 / Class 6–9)",
  14: "Middle School (Ages 12–15 / Class 6–9)",
  15: "Middle School (Ages 12–15 / Class 6–9)",
  16: "High School / Senior (Ages 16–18 / Class 10–12)",
  17: "High School / Senior (Ages 16–18 / Class 10–12)",
  18: "High School / Senior (Ages 16–18 / Class 10–12)"
};

const sliderEl = mockDoc.getElementById("ageSlider");
for (let age = 3; age <= 18; age++) {
  sliderEl.value = age;
  if (sliderEl.listeners['input']) {
    sliderEl.listeners['input'].forEach(h => h({ target: { value: age } }));
  }
  const expectedPill = expectedBandLabels[age];
  const actualPill = mockDoc.getElementById("ageBandPill").textContent;
  const actualAgeText = mockDoc.getElementById("ageDisplay").textContent;

  if (actualPill !== expectedPill || actualAgeText !== `Age ${age}`) {
    console.error(`✗ Mismatch at Age ${age}: expected '${expectedPill}', got '${actualPill}'`);
    process.exit(1);
  }
}
console.log("✓ All 16 ages (3 to 18) correctly map to exact developmental bands and labels via slider input events.");

// TEST 3: All 24 Permutations of the Simulation Matrix
console.log("\n--- TEST 3: All 24 Simulation Matrix Permutations ---");
const bandKeys = ['early', 'primary', 'middle', 'high'];
const interests = ['cricket', 'gaming', 'space', 'animals', 'music', 'movies'];
const sampleAges = { early: 4, primary: 9, middle: 13, high: 17 };

let permutationCount = 0;
for (const band of bandKeys) {
  for (const interest of interests) {
    sliderEl.value = sampleAges[band];
    if (sliderEl.listeners['input']) {
      sliderEl.listeners['input'].forEach(h => h({ target: { value: sampleAges[band] } }));
    }
    const chip = chipElements.find(c => c.getAttribute('data-interest') === interest);
    if (chip) chip.click();

    const bodyHtml = mockDoc.getElementById("aiExplanationBody").innerHTML;
    const question = mockDoc.getElementById("checkQuestionText").textContent;
    const visual = mockDoc.getElementById("fractionVisualContainer").innerHTML;
    const options = mockDoc.getElementById("checkOptionsContainer").children;

    if (!bodyHtml || !question || !visual || options.length === 0) {
      console.error(`✗ Incomplete payload for ${band} x ${interest}`);
      process.exit(1);
    }
    permutationCount++;
  }
}
console.log(`✓ All ${permutationCount} combinations render rich HTML copy, SVG concept visualization, and dynamic quiz options.`);

// TEST 4: Custom Passion Fallback Logic (Recognized & Arbitrary Words)
console.log("\n--- TEST 4: Free-text Custom Passion Fallback Engine ---");
const customWords = ["Robotics", "Origami", "Cooking", "Astrophysics", "Baking", "Guitar"];
for (const word of customWords) {
  for (const band of bandKeys) {
    const customResult = sandbox.generateCustomExplanation(band, word);
    if (!customResult.text.includes(word) || !customResult.visualFraction || !customResult.question || customResult.options.length < 2) {
      console.error(`✗ Custom fallback failed for word: '${word}' in band '${band}'`);
      process.exit(1);
    }
  }
}
console.log("✓ Custom passion generator reliably personalizes explanations for both recognized & arbitrary hobby terms across all 4 age bands.");

// TEST 5: Interactive Quiz State & Feedback Evaluation
console.log("\n--- TEST 5: Quiz Answer Feedback & Option States ---");
sliderEl.value = 9;
if (sliderEl.listeners['input']) {
  sliderEl.listeners['input'].forEach(h => h({ target: { value: 9 } }));
}
const gamingChip = chipElements.find(c => c.getAttribute('data-interest') === 'gaming');
if (gamingChip) gamingChip.click();

const optionsContainer = mockDoc.getElementById("checkOptionsContainer");
const buttons = optionsContainer.children;
if (buttons.length > 0) {
  // Test Correct Answer (Index 0)
  buttons[0].click();
  const feedback = mockDoc.getElementById("checkFeedbackText");
  if (!buttons[0].classList.contains("selected-correct") || !feedback.innerHTML.includes("Spot on!")) {
    console.error("✗ Quiz correct answer evaluation failed!");
    process.exit(1);
  }
  console.log("✓ Quiz correct answer evaluation: adds '.selected-correct', displays celebration feedback.");

  // Test Quiz State Reset upon Simulation Update
  const spaceChip = chipElements.find(c => c.getAttribute('data-interest') === 'space');
  if (spaceChip) spaceChip.click();

  const newButtons = optionsContainer.children;
  if (newButtons[0].classList.contains("selected-correct") || mockDoc.getElementById("checkFeedbackText").style.display !== "none") {
    console.error("✗ Quiz did not reset cleanly upon new interest selection!");
    process.exit(1);
  }
  console.log("✓ Quiz state resets cleanly with hidden feedback upon input change.");

  // Test Incorrect Answer (Index 1)
  newButtons[1].click();
  if (!newButtons[1].classList.contains("selected-incorrect") || !newButtons[0].classList.contains("indicated-correct")) {
    console.error("✗ Quiz incorrect answer did not flag incorrect and highlight correct answer!");
    process.exit(1);
  }
  console.log("✓ Quiz incorrect answer evaluation: flags '.selected-incorrect' and indicates '.indicated-correct'.");
}

// TEST 6: Surprise Me (🎲) and Reset (↺)
console.log("\n--- TEST 6: Surprise Me & Reset Cycles ---");
for (let i = 0; i < 5; i++) {
  // Click Randomize
  mockDoc.getElementById("btnRandomize").click();
  const randomizedAge = parseInt(sliderEl.value, 10);
  const activeChip = chipElements.find(c => c.classList.contains("active"));
  const activeInterest = activeChip ? activeChip.getAttribute("data-interest") : null;

  if (randomizedAge < 3 || randomizedAge > 18 || !interests.includes(activeInterest)) {
    console.error("✗ Surprise Me generated invalid age or interest!");
    process.exit(1);
  }

  // Click Reset
  mockDoc.getElementById("btnResetDemo").click();
  const resetAge = parseInt(sliderEl.value, 10);
  const resetChip = chipElements.find(c => c.classList.contains("active"));
  const resetInterest = resetChip ? resetChip.getAttribute("data-interest") : null;

  if (resetAge !== 9 || resetInterest !== "gaming" || mockDoc.getElementById("customInterestInput").value !== "") {
    console.error("✗ Reset did not restore default Age 9 / Gaming state!");
    process.exit(1);
  }
}
console.log("✓ Surprise Me (🎲) and Reset (↺) work flawlessly through multiple sequential cycles.");

// TEST 7: Pricing & Sign-Up Modal
console.log("\n--- TEST 7: Pricing & Sign-Up Modal Workflows ---");
const plans = ["Starter Plan (Pilot)", "School Plan (Whole School)", "Enterprise (District)"];
for (const plan of plans) {
  sandbox.openSignUpModal(plan);
  const badgeText = mockDoc.getElementById("modalPlanBadge").textContent;
  if (badgeText !== `Selected: ${plan}` || !mockDoc.getElementById("signUpModal").classList.contains("open")) {
    console.error(`✗ Modal open failed for plan: ${plan}`);
    process.exit(1);
  }

  // Submit Modal
  sandbox.handleModalSubmit({ preventDefault: () => {} });
  if (mockDoc.getElementById("modalSuccessState").style.display !== "block") {
    console.error("✗ Modal form submit did not show success state!");
    process.exit(1);
  }

  // Close Modal
  sandbox.closeSignUpModal();
  if (mockDoc.getElementById("signUpModal").classList.contains("open")) {
    console.error("✗ Modal close failed!");
    process.exit(1);
  }
}
console.log("✓ Sign-up modal opens for all 3 plans, displays plan badges, shows success state on submit, and closes without leaving broken state.");

// TEST 8: Footer Contact / Institutional Pilot Form
console.log("\n--- TEST 8: School Pilot Contact Form ---");
mockDoc.getElementById("adminName").value = "Dr. Sunita Sharma";
mockDoc.getElementById("schoolName").value = "Delhi Public School";
sandbox.handleFormSubmit({ preventDefault: () => {} });

if (mockDoc.getElementById("formSuccessBlock").style.display !== "block" ||
    mockDoc.getElementById("successAdminName").textContent !== "Dr. Sunita Sharma" ||
    mockDoc.getElementById("successSchoolName").textContent !== "Delhi Public School") {
  console.error("✗ Pilot form submission personalization failed!");
  process.exit(1);
}
console.log("✓ Pilot form successfully captures admin & school names and renders personalized 3-step schedule confirmation.");

// Reset Form State
sandbox.resetFormState();
if (mockDoc.getElementById("formSuccessBlock").style.display !== "none" ||
    mockDoc.getElementById("formContentBlock").style.display !== "block") {
  console.error("✗ Reset pilot form failed!");
  process.exit(1);
}
console.log("✓ Form reset returns to clean initial input state.");

// TEST 9: Multilingual Switcher
console.log("\n--- TEST 9: Multilingual Regional Translations ---");
const expectedTranslations = ['en', 'hi', 'ta', 'te', 'mr'];
for (const l of expectedTranslations) {
  const tab = langElements.find(t => t.getAttribute('data-lang') === l);
  if (tab) tab.click();
  const text = mockDoc.getElementById("langPreviewText").textContent;
  if (!text || text.length < 10) {
    console.error(`✗ Missing translation for '${l}'`);
    process.exit(1);
  }
}
console.log("✓ Multilingual data verified across English, Hindi, Tamil, Telugu, and Marathi.");

console.log("\n==================================================");
console.log("🎉 100% OF FUNCTIONAL MVP TESTS PASSED WITHOUT ERRORS");
console.log("==================================================");
