import { auth, googleProvider } from "./firebase-init.js";
import { isHandleTaken, reserveHandle, getUserProfile } from "./firestore-data.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const PUBLIC_SCREENS = new Set([
  "signup", "login", "about", "faq", "privacy", "terms",
  "public-pick", "public-form", "public-done", "manage", "cancelled",
]);

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
  return (location.hash || "#signup").slice(1).split("?")[0];
}

function paintUser(user) {
  document.querySelectorAll("[data-sidebar]").forEach((slot) => {
    const nameEl = slot.querySelector(".user-card strong");
    const emailEl = slot.querySelector(".user-card small");
    if (!user) return;
    if (nameEl) nameEl.textContent = user.displayName || "Your Name";
    if (emailEl) emailEl.textContent = user.email || "";
  });

  document.querySelectorAll('.screen-nav [data-screen="signup"], .screen-nav [data-screen="login"]').forEach((btn) => {
    btn.style.display = user ? "none" : "";
  });

  const profileName = document.getElementById("profile-name");
  const profileEmail = document.getElementById("profile-email");
  const profileAvatar = document.getElementById("profile-avatar");
  if (user) {
    if (profileName) profileName.textContent = user.displayName || "Your Name";
    if (profileEmail) profileEmail.textContent = user.email || "";
    if (profileAvatar) profileAvatar.textContent = (user.displayName || user.email || "?").trim().charAt(0).toUpperCase();
  }
}

async function paintProfileHandle(user) {
  if (!user) return;
  try {
    const profile = await getUserProfile(user.uid);
    if (profile?.handle) window.BooklyCurrentHandle = profile.handle;
    const handleEl = document.getElementById("profile-handle");
    if (handleEl) handleEl.textContent = profile?.handle || "—";
  } catch {
    const handleEl = document.getElementById("profile-handle");
    if (handleEl) handleEl.textContent = "—";
  }
}

// Repaint the sidebar every time the app navigates (new sidebar clones need it too).
const _go = window.go;
window.go = function (name) {
  _go(name);
  paintUser(auth.currentUser);
  if (name.split("?")[0] === "settings") paintProfileHandle(auth.currentUser);
};

// PIN-gate the admin section. Unlocked once per account per browser session
// (sessionStorage, keyed by uid) — asked again after logging out, or in a new tab/window.
const ADMIN_SCREENS = new Set(["admin-events", "admin-editor", "admin-availability", "admin-integrations", "bookings"]);
const ADMIN_PIN = "7934";
const PIN_UNLOCK_KEY = "bookly_admin_pin_unlocked_uid";
let pendingAdminTarget = null;

function isPinUnlocked() {
  return !!auth.currentUser && sessionStorage.getItem(PIN_UNLOCK_KEY) === auth.currentUser.uid;
}
function setPinUnlocked() {
  if (auth.currentUser) sessionStorage.setItem(PIN_UNLOCK_KEY, auth.currentUser.uid);
}
function clearPinUnlocked() {
  sessionStorage.removeItem(PIN_UNLOCK_KEY);
}

function resetPinScreen() {
  const input = document.getElementById("admin-pin-input");
  if (input) input.value = "";
  clearError("admin-pin-error");
}

const _goWithUserPaint = window.go;
window.go = function (name) {
  if (ADMIN_SCREENS.has(name)) {
    if (!isPinUnlocked()) {
      if (currentScreen() === "admin-pin" && pendingAdminTarget === name) return; // duplicate trigger while already prompting for this target
      pendingAdminTarget = name;
      resetPinScreen();
      _goWithUserPaint("admin-pin");
      document.getElementById("admin-pin-input")?.focus();
      return;
    }
    _goWithUserPaint(name);
    window.BooklyUI?.renderScreen?.(name, auth.currentUser?.uid);
    return;
  }
  _goWithUserPaint(name);
};

const pinForm = document.getElementById("admin-pin-form");
const pinInput = document.getElementById("admin-pin-input");
if (pinForm) {
  pinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (pinInput.value === ADMIN_PIN && pendingAdminTarget) {
      setPinUnlocked();
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

const signupHandleInput = document.getElementById("signup-handle");
const signupHandleHint = document.getElementById("signup-handle-hint");
let handleCheckToken = 0;
signupHandleInput?.addEventListener("input", () => {
  signupHandleInput.value = signupHandleInput.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
});
signupHandleInput?.addEventListener("blur", async () => {
  const handle = signupHandleInput.value.trim();
  if (!handle) return;
  const token = ++handleCheckToken;
  signupHandleHint.textContent = "Checking availability…";
  signupHandleHint.style.color = "";
  const taken = await isHandleTaken(handle);
  if (token !== handleCheckToken) return; // a newer check superseded this one
  signupHandleHint.textContent = taken ? "That handle is already taken." : "This becomes your public booking link.";
  signupHandleHint.style.color = taken ? "var(--danger)" : "";
});

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError("signup-error");
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const handle = signupHandleInput.value.trim();
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    setBusy(submitBtn, true, "Creating account…");
    try {
      if (!/^[a-z0-9-]{3,30}$/.test(handle)) {
        throw new Error("Choose a booking handle: lowercase letters, numbers, and hyphens, 3-30 characters.");
      }
      if (await isHandleTaken(handle)) {
        throw new Error("That booking handle is already taken.");
      }
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      await reserveHandle(cred.user.uid, handle, { displayName: name || "", email });
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
    clearPinUnlocked();
    signOut(auth); // navigation to login happens via onAuthStateChanged below
  }
});

const handleCheckedUids = new Set();
async function ensureHandle(user) {
  // Google sign-in skips the signup form's handle field entirely — backfill it here
  // so every account still ends up with a resolvable public booking URL.
  if (handleCheckedUids.has(user.uid)) return;
  handleCheckedUids.add(user.uid);
  const profile = await getUserProfile(user.uid);
  if (profile?.handle) return;
  const suggestion = (user.email || "").split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "");
  while (true) {
    const raw = prompt("Choose a public booking handle (bookly.io/<handle>) — lowercase letters, numbers, and hyphens:", suggestion);
    if (raw === null) return; // user dismissed — will be asked again next sign-in
    const handle = raw.trim().toLowerCase();
    if (!/^[a-z0-9-]{3,30}$/.test(handle)) {
      alert("Use lowercase letters, numbers, and hyphens, 3-30 characters.");
      continue;
    }
    if (await isHandleTaken(handle)) {
      alert("That handle is already taken.");
      continue;
    }
    await reserveHandle(user.uid, handle, { displayName: user.displayName || "", email: user.email || "" });
    return;
  }
}

// Cold-load entry point for a real public booking link, e.g. #public-pick?u=annie&e=demo.
// Runs once here (not tied to auth state) since anonymous visitors never trigger onAuthStateChanged.
if (currentScreen() === "public-pick" && location.hash.includes("?")) {
  window.BooklyUI?.resolvePublicBooking?.(location.hash.split("?")[1]);
}

// Cold-load entry point for a "manage this booking" link from a confirmation email: #manage?b=<bookingId>.
if (currentScreen() === "manage" && location.hash.includes("?")) {
  window.BooklyUI?.resolveManageBooking?.(location.hash.split("?")[1]);
}

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
  if (user) {
    ensureHandle(user);
    paintProfileHandle(user);
  }
});
