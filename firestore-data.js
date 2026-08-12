import { db } from "./firebase-init.js";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
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

export async function reserveHandle(uid, handle, profile) {
  await setDoc(doc(db, "handles", handle), { uid, createdAt: serverTimestamp() });
  await setDoc(doc(db, "users", uid), { ...profile, handle, createdAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
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

window.BooklyData = {
  resolveHandle,
  isHandleTaken,
  reserveHandle,
  getUserProfile,
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
};
