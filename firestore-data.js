import { db } from "./firebase-init.js";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  runTransaction,
  serverTimestamp,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return timeToMinutes(aStart) < timeToMinutes(bEnd) && timeToMinutes(bStart) < timeToMinutes(aEnd);
}

// ---- Handles / users ----

export async function resolveHandle(handle) {
  const snap = await getDoc(doc(db, "handles", handle));
  return snap.exists() ? snap.data().uid : null;
}

export async function isHandleTaken(handle) {
  const snap = await getDoc(doc(db, "handles", handle));
  return snap.exists();
}

// Finds a handle already reserved for this uid — used to self-heal a missing
// users/{uid} profile doc (e.g. after an accidental Firestore deletion) without
// re-prompting for a new handle when the original reservation still exists.
export async function findHandleForUid(uid) {
  const snap = await getDocs(query(collection(db, "handles"), where("uid", "==", uid)));
  return snap.empty ? null : snap.docs[0].id;
}

// Same Mon-Fri 9-5 default shown (but not persisted) on the Availability
// screen when no schedule exists yet (see DEFAULT_WEEKLY in screens-more.js).
const DEFAULT_WEEKLY_AVAILABILITY = {
  mon: { enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
  tue: { enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
  wed: { enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
  thu: { enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
  fri: { enabled: true, ranges: [{ start: "09:00", end: "17:00" }] },
  sat: { enabled: false, ranges: [{ start: "09:00", end: "13:00" }] },
  sun: { enabled: false, ranges: [{ start: "09:00", end: "13:00" }] },
};

export async function reserveHandle(uid, handle, profile) {
  await setDoc(doc(db, "handles", handle), { uid, createdAt: serverTimestamp() });
  await setDoc(doc(db, "users", uid), { ...profile, handle, createdAt: serverTimestamp() }, { merge: true });

  // Without this, a host's public booking page shows "no times available" on
  // every single date until they separately visit Availability and click
  // Save — which looks completely broken to anyone testing right after
  // signup. Only write if nothing exists yet, so this never clobbers a real
  // schedule (relevant for the self-heal / re-login call sites too).
  const availabilityRef = doc(db, "users", uid, "availability", "default");
  const existing = await getDoc(availabilityRef);
  if (!existing.exists()) {
    await setDoc(availabilityRef, {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Lisbon",
      weekly: DEFAULT_WEEKLY_AVAILABILITY,
      overrides: [],
      updatedAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveIntegrationLink(uid, provider, url) {
  await setDoc(doc(db, "users", uid), { [`${provider}Link`]: url }, { merge: true });
}

// ---- Event types ----

export async function listEventTypes(uid) {
  const snap = await getDocs(collection(db, "users", uid, "eventTypes"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getEventType(uid, slug) {
  const snap = await getDoc(doc(db, "users", uid, "eventTypes", slug));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveEventType(uid, slug, data) {
  const ref = doc(db, "users", uid, "eventTypes", slug);
  const existing = await getDoc(ref);
  await setDoc(
    ref,
    {
      ...data,
      slug,
      updatedAt: serverTimestamp(),
      createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
    },
    { merge: true },
  );
}

export async function countBookingsForEventType(hostUid, slug) {
  const q = query(
    collection(db, "bookings"),
    where("hostUid", "==", hostUid),
    where("eventTypeSlug", "==", slug),
    where("status", "==", "confirmed"),
  );
  const snap = await getCountFromServer(q);
  return snap.data().count;
}

// ---- Availability ----

export async function getAvailability(uid) {
  const snap = await getDoc(doc(db, "users", uid, "availability", "default"));
  return snap.exists() ? snap.data() : null;
}

export async function saveAvailability(uid, data) {
  await setDoc(doc(db, "users", uid, "availability", "default"), { ...data, updatedAt: serverTimestamp() });
}

// ---- Bookings ----

export async function listBookingsForHost(uid) {
  const q = query(collection(db, "bookings"), where("hostUid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export async function getBookingsForDate(hostUid, dateISO) {
  const q = query(
    collection(db, "bookings"),
    where("hostUid", "==", hostUid),
    where("date", "==", dateISO),
    where("status", "==", "confirmed"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getBooking(bookingId) {
  const snap = await getDoc(doc(db, "bookings", bookingId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function slotIsFree(existingBookings, time, endTime) {
  return !existingBookings.some((b) => rangesOverlap(time, endTime, b.time, b.endTime));
}

export async function createBooking(booking) {
  const { hostUid, date, time } = booking;
  const bookingId = `${hostUid}__${date}__${time}`;
  const ref = doc(db, "bookings", bookingId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists() && snap.data().status !== "cancelled") {
      throw new Error("slot-taken");
    }
    tx.set(ref, { ...booking, status: "confirmed", createdAt: serverTimestamp() });
  });
  return bookingId;
}

export async function cancelBooking(bookingId, reason) {
  await updateDoc(doc(db, "bookings", bookingId), {
    status: "cancelled",
    cancelledAt: serverTimestamp(),
    cancelReason: reason || "",
  });
}

export async function addGuestToBooking(bookingId, email) {
  await updateDoc(doc(db, "bookings", bookingId), { guests: arrayUnion(email) });
}

export async function removeGuestFromBooking(bookingId, email) {
  await updateDoc(doc(db, "bookings", bookingId), { guests: arrayRemove(email) });
}

window.BooklyData = {
  resolveHandle,
  isHandleTaken,
  reserveHandle,
  getUserProfile,
  saveIntegrationLink,
  findHandleForUid,
  listEventTypes,
  getEventType,
  saveEventType,
  countBookingsForEventType,
  getAvailability,
  saveAvailability,
  listBookingsForHost,
  getBookingsForDate,
  getBooking,
  slotIsFree,
  createBooking,
  cancelBooking,
  addGuestToBooking,
  removeGuestFromBooking,
};
