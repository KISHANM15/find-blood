/**
 * Blood Donor Finder — Firebase Firestore integration
 * Uses ES modules + async/await (CDN — no npm required).
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/** Your web app's Firebase configuration */
const firebaseConfig = {
  apiKey: "AIzaSyDn5tX9jYDLG0DMs_3_WrUvFgDiot2des8",
  authDomain: "blood-donar-e1975.firebaseapp.com",
  projectId: "blood-donar-e1975",
  storageBucket: "blood-donar-e1975.firebasestorage.app",
  messagingSenderId: "887857474495",
  appId: "1:887857474495:web:7472479a64747433a8cf0a",
  measurementId: "G-GF9ZYMHCBE",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const THEME_KEY = "blood-donor-theme";
const THEMES = ["light", "dark", "night"];

let db = null;
let firebaseReady = false;

function safeGetStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_) {
    // Ignore storage failures (private mode / blocked storage)
  }
}

function resolvePreferredTheme() {
  const stored = safeGetStorage(THEME_KEY);
  if (THEMES.includes(stored)) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const safeTheme = THEMES.includes(theme) ? theme : "light";
  document.documentElement.setAttribute("data-theme", safeTheme);
  safeSetStorage(THEME_KEY, safeTheme);
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) themeSelect.value = safeTheme;
}

function initThemeControls() {
  applyTheme(resolvePreferredTheme());
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return;
  themeSelect.addEventListener("change", (event) => {
    applyTheme(event.target.value);
  });
}

function setupFirebase() {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Analytics (browser only; safe to ignore if blocked or unsupported)
    try {
      getAnalytics(app);
    } catch (_) {}
    firebaseReady = true;
  } catch (_) {
    firebaseReady = false;
  }
}

function setMessage(element, text, type = "") {
  if (!element) return;
  element.textContent = text;
  element.classList.remove("success", "error");
  if (type) element.classList.add(type);
}

function setFieldError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  if (errorElement) errorElement.textContent = message;
}

function clearFieldError(fieldId) {
  setFieldError(fieldId, "");
}

function digitsOnly(value) {
  return String(value).replace(/\D/g, "");
}

function validateRegisterForm({ name, bloodGroup, location, phone }) {
  let isValid = true;

  clearFieldError("name");
  clearFieldError("bloodGroup");
  clearFieldError("location");
  clearFieldError("phone");

  if (!name.trim()) {
    setFieldError("name", "Name is required.");
    isValid = false;
  }

  if (!BLOOD_GROUPS.includes(bloodGroup)) {
    setFieldError("bloodGroup", "Please select a valid blood group.");
    isValid = false;
  }

  if (!location.trim()) {
    setFieldError("location", "Location is required.");
    isValid = false;
  }

  const cleanPhone = digitsOnly(phone);
  if (!/^\d{10}$/.test(cleanPhone)) {
    setFieldError("phone", "Phone number must be exactly 10 digits.");
    isValid = false;
  }

  return { isValid, cleanPhone };
}

function initRegisterPage() {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("formMessage");
  const registerBtn = document.getElementById("registerBtn");

  if (!form || !message || !registerBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(message, "");

    if (!firebaseReady) {
      setMessage(
        message,
        "Firebase is not configured. Replace firebaseConfig in app.js with your keys.",
        "error"
      );
      return;
    }

    const name = document.getElementById("name")?.value || "";
    const bloodGroup = document.getElementById("bloodGroup")?.value || "";
    const location = document.getElementById("location")?.value || "";
    const phone = document.getElementById("phone")?.value || "";

    const { isValid, cleanPhone } = validateRegisterForm({
      name,
      bloodGroup,
      location,
      phone,
    });

    if (!isValid) {
      setMessage(message, "Please fix the highlighted errors.", "error");
      return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Saving...";

    try {
      await addDoc(collection(db, "donors"), {
        name: name.trim(),
        bloodGroup,
        location: location.trim(),
        phone: cleanPhone,
        createdAt: serverTimestamp(),
      });

      setMessage(message, "Donor registered successfully.", "success");
      form.reset();
      clearFieldError("name");
      clearFieldError("bloodGroup");
      clearFieldError("location");
      clearFieldError("phone");
    } catch (_) {
      setMessage(
        message,
        "Could not save donor right now. Check Firestore rules and try again.",
        "error"
      );
    } finally {
      registerBtn.disabled = false;
      registerBtn.textContent = "Register Donor";
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function donorCardTemplate(donor) {
  return `
    <article class="donor-card">
      <h3 class="donor-name">${escapeHtml(donor.name)}</h3>
      <span class="donor-tag">${escapeHtml(donor.bloodGroup)}</span>
      <p class="donor-meta"><strong>Location:</strong> ${escapeHtml(donor.location)}</p>
      <p class="donor-meta"><strong>Phone:</strong> ${escapeHtml(donor.phone)}</p>
    </article>
  `;
}

function initSearchPage() {
  const bloodGroupSelect = document.getElementById("searchBloodGroup");
  const searchBtn = document.getElementById("searchBtn");
  const results = document.getElementById("results");
  const searchMessage = document.getElementById("searchMessage");
  const loadingState = document.getElementById("loadingState");
  const resultCount = document.getElementById("resultCount");
  const searchBloodGroupError = document.getElementById("searchBloodGroupError");

  if (
    !bloodGroupSelect ||
    !searchBtn ||
    !results ||
    !searchMessage ||
    !loadingState ||
    !resultCount ||
    !searchBloodGroupError
  ) {
    return;
  }

  const fetchDonors = async () => {
    setMessage(searchMessage, "");
    searchBloodGroupError.textContent = "";
    results.innerHTML = "";
    resultCount.textContent = "Total donors found: 0";

    const selectedGroup = bloodGroupSelect.value;

    if (!BLOOD_GROUPS.includes(selectedGroup)) {
      searchBloodGroupError.textContent = "Please select a valid blood group.";
      setMessage(searchMessage, "Select blood group before searching.", "error");
      return;
    }

    if (!firebaseReady) {
      setMessage(
        searchMessage,
        "Firebase is not configured. Replace firebaseConfig in app.js with your keys.",
        "error"
      );
      return;
    }

    loadingState.classList.remove("hidden");
    searchBtn.disabled = true;

    try {
      const donorsQuery = query(
        collection(db, "donors"),
        where("bloodGroup", "==", selectedGroup)
      );

      const snapshot = await getDocs(donorsQuery);
      const donors = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      resultCount.textContent = `Total donors found: ${donors.length}`;

      if (donors.length === 0) {
        setMessage(searchMessage, "No donors found for this blood group.", "error");
        return;
      }

      results.innerHTML = donors.map(donorCardTemplate).join("");
      setMessage(searchMessage, "Donors loaded successfully.", "success");
    } catch (_) {
      setMessage(
        searchMessage,
        "Could not fetch donors. Check Firestore rules and network, then try again.",
        "error"
      );
    } finally {
      loadingState.classList.add("hidden");
      searchBtn.disabled = false;
    }
  };

  searchBtn.addEventListener("click", fetchDonors);
  bloodGroupSelect.addEventListener("change", () => {
    searchBloodGroupError.textContent = "";
  });
}

function initApp() {
  initThemeControls();
  setupFirebase();
  const page = document.body.dataset.page;
  if (page === "register") initRegisterPage();
  else if (page === "search") initSearchPage();
}

initApp();
