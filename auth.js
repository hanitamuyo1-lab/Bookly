import { auth, googleProvider } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const PUBLIC_SCREENS = new Set(["signup", "login", "about", "faq", "privacy", "terms"]);

const ERROR_MESSAGES = {
  "auth/email-already-in-use": "That email is already registered — try logging in instead.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
};

function friendlyError(err) {
  return ERROR_MESSAGES[err.code] || err.message || "Something went wrong. Please try again.";
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}

function setBusy(button, busy, label) {
  if (!button) return;
  button.disabled = busy;
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = label;
  } else if (button.dataset.label) {
    button.textContent = button.dataset.label;
  }
}

function currentScreen() {
  return (location.hash || "#signup").slice(1);
}

function paintUser(user) {
  document.querySelectorAll("[data-sidebar]").forEach((slot) => {
    const nameEl = slot.querySelector(".user-card strong");
    const emailEl = slot.querySelector(".user-card small");
    if (!user) return;
    if (nameEl) nameEl.textContent = user.displayName || "Your Name";
    if (emailEl) emailEl.textContent = user.email || "";
  });
}

// Repaint the sidebar every time the app navigates (new sidebar clones need it too).
const _go = window.go;
window.go = function (name) {
  _go(name);
  paintUser(auth.currentUser);
};

// PIN-gate the admin section. Re-asked on every entry — no persistence, by design.
const ADMIN_SCREENS = new Set(["admin-events", "admin-editor", "admin-availability", "admin-integrations"]);
const ADMIN_PIN = "7934";
let pinBypass = false;
let pendingAdminTarget = null;

function resetPinScreen() {
  const input = document.getElementById("admin-pin-input");
  if (input) input.value = "";
  clearError("admin-pin-error");
}

const _goWithUserPaint = window.go;
window.go = function (name) {
  if (ADMIN_SCREENS.has(name) && !pinBypass) {
    if (currentScreen() === "admin-pin" && pendingAdminTarget === name) return; // duplicate trigger while already prompting for this target
    pendingAdminTarget = name;
    resetPinScreen();
    _goWithUserPaint("admin-pin");
    document.getElementById("admin-pin-input")?.focus();
    return;
  }
  pinBypass = false;
  _goWithUserPaint(name);
};

const pinForm = document.getElementById("admin-pin-form");
const pinInput = document.getElementById("admin-pin-input");
if (pinForm) {
  pinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (pinInput.value === ADMIN_PIN && pendingAdminTarget) {
      pinBypass = true;
      const target = pendingAdminTarget;
      pendingAdminTarget = null;
      go(target);
    } else {
      showError("admin-pin-error", "Incorrect PIN. Try again.");
      pinInput.value = "";
      pinInput.focus();
    }
  });
}
pinInput?.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (e.target.value.length === 4) pinForm?.requestSubmit();
});

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError("signup-error");
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    setBusy(submitBtn, true, "Creating account…");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      // navigation to admin-events happens via onAuthStateChanged below
    } catch (err) {
      showError("signup-error", friendlyError(err));
    } finally {
      setBusy(submitBtn, false);
    }
  });
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError("login-error");
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    setBusy(submitBtn, true, "Logging in…");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // navigation to admin-events happens via onAuthStateChanged below
    } catch (err) {
      showError("login-error", friendlyError(err));
    } finally {
      setBusy(submitBtn, false);
    }
  });
}

async function handleGoogle(errorId) {
  clearError(errorId);
  try {
    await signInWithPopup(auth, googleProvider);
    // navigation to admin-events happens via onAuthStateChanged below
  } catch (err) {
    showError(errorId, friendlyError(err));
  }
}
document.getElementById("google-signup-btn")?.addEventListener("click", () => handleGoogle("signup-error"));
document.getElementById("google-login-btn")?.addEventListener("click", () => handleGoogle("login-error"));

document.addEventListener("click", (e) => {
  if (e.target.closest('[data-nav="logout"]')) {
    signOut(auth); // navigation to login happens via onAuthStateChanged below
  }
});

onAuthStateChanged(auth, (user) => {
  paintUser(user);
  const screen = currentScreen();
  if (!user && !PUBLIC_SCREENS.has(screen)) {
    go("login");
  } else if (user && (screen === "signup" || screen === "login")) {
    go("admin-events");
  } else if (user && ADMIN_SCREENS.has(screen)) {
    // Direct load / refresh landing straight on an admin screen still needs the PIN.
    go(screen);
  }
});
