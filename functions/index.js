const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const resendApiKey = defineSecret("RESEND_API_KEY");
// booklylive.net is verified with Resend (SPF/DKIM/MX), so sending is fully authenticated —
// booklylive@outlook.com itself can't be the "from" (Microsoft blocks basic SMTP auth on that
// mailbox and we don't own outlook.com's DNS), so it's set as reply-to instead.
const FROM_ADDRESS = "Bookly <bookings@booklylive.net>";
const REPLY_TO = "booklylive@outlook.com";
const APP_URL = "https://www.booklylive.net/app.html";

async function sendEmail({ to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey.value()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_ADDRESS, reply_to: REPLY_TO, to: [to], subject, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend send failed (${res.status}): ${body}`);
  }
  return res.json();
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function getHostEmail(hostUid) {
  try {
    const snap = await db.doc(`users/${hostUid}`).get();
    return snap.data()?.email || null;
  } catch (err) {
    console.error("Failed to look up host email:", err);
    return null;
  }
}

// booking.date/time are wall-clock values in the host's availability timezone (no UTC
// offset is stored on the booking itself) — resolve the instant by taking a UTC guess,
// checking what that instant's wall-clock reads as in the target zone via formatToParts
// (timezone-independent, unlike toLocaleString+Date parsing which depends on the *runtime's*
// local timezone), and correcting for the difference.
function zonedTimeToUtc(dateISO, time, timeZone) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const utcGuess = Date.UTC(y, m - 1, d, hh, mm);

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false,
    }).formatToParts(utcGuess).map((p) => [p.type, p.value]),
  );
  const hour24 = Number(parts.hour) === 24 ? 0 : Number(parts.hour);
  const asUtcIfSameWallClock = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), hour24, Number(parts.minute), Number(parts.second));
  return new Date(utcGuess + (utcGuess - asUtcIfSameWallClock));
}

const hostTimezoneCache = new Map();
async function getHostTimezone(hostUid) {
  if (hostTimezoneCache.has(hostUid)) return hostTimezoneCache.get(hostUid);
  let tz = "UTC";
  try {
    const snap = await db.doc(`users/${hostUid}/availability/default`).get();
    tz = snap.data()?.timezone || "UTC";
  } catch (err) {
    console.error("Failed to look up host timezone:", err);
  }
  hostTimezoneCache.set(hostUid, tz);
  return tz;
}

function locationRowHtml(booking) {
  const location = escapeHtml(booking.location || "TBD");
  if (booking.meetingLink) {
    return `<tr><td style="padding: 6px 0; color: #888;">Location</td><td style="padding: 6px 0;"><a href="${escapeHtml(booking.meetingLink)}" style="color: #d11124;">${location}: ${escapeHtml(booking.meetingLink)}</a></td></tr>`;
  }
  return `<tr><td style="padding: 6px 0; color: #888;">Location</td><td style="padding: 6px 0;">${location}</td></tr>`;
}

function reminderHtml(booking, manageUrl, label) {
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="margin-bottom: 4px;">Reminder: ${label}</h2>
      <p style="color: #555;">Your ${escapeHtml(booking.eventName)} is coming up.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #888;">Date</td><td style="padding: 6px 0;"><strong>${escapeHtml(booking.date)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Time</td><td style="padding: 6px 0;"><strong>${escapeHtml(booking.time)} – ${escapeHtml(booking.endTime)}</strong></td></tr>
        ${locationRowHtml(booking)}
      </table>
      <p><a href="${manageUrl}" style="display: inline-block; background: #d11124; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600;">Manage or cancel booking</a></p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">— The Bookly team</p>
    </div>`;
}

function confirmationHtml(booking, manageUrl) {
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="margin-bottom: 4px;">You're booked!</h2>
      <p style="color: #555;">Your ${escapeHtml(booking.eventName)} is confirmed.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #888;">Date</td><td style="padding: 6px 0;"><strong>${escapeHtml(booking.date)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Time</td><td style="padding: 6px 0;"><strong>${escapeHtml(booking.time)} – ${escapeHtml(booking.endTime)}</strong></td></tr>
        ${locationRowHtml(booking)}
      </table>
      <p><a href="${manageUrl}" style="display: inline-block; background: #d11124; color: #fff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600;">Manage or cancel booking</a></p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">— The Bookly team</p>
    </div>`;
}

function cancellationHtml(booking) {
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="margin-bottom: 4px;">Booking cancelled</h2>
      <p style="color: #555;">Your ${escapeHtml(booking.eventName)} on ${escapeHtml(booking.date)} at ${escapeHtml(booking.time)} has been cancelled.</p>
      ${booking.cancelReason ? `<p style="color: #555;">Reason: ${escapeHtml(booking.cancelReason)}</p>` : ""}
      <p style="color: #999; font-size: 12px; margin-top: 24px;">— The Bookly team</p>
    </div>`;
}

exports.sendBookingConfirmation = onDocumentCreated(
  { document: "bookings/{bookingId}", secrets: [resendApiKey], region: "europe-west1" },
  async (event) => {
    const booking = event.data?.data();
    if (!booking || booking.status !== "confirmed") return;

    const manageUrl = `${APP_URL}#manage?b=${encodeURIComponent(event.params.bookingId)}`;
    const tasks = [];

    if (booking.inviteeEmail) {
      tasks.push(
        sendEmail({
          to: booking.inviteeEmail,
          subject: `Confirmed: ${booking.eventName} on ${booking.date}`,
          html: confirmationHtml(booking, manageUrl),
        }),
      );
    }

    const hostEmail = await getHostEmail(booking.hostUid);
    if (hostEmail) {
      tasks.push(
        sendEmail({
          to: hostEmail,
          subject: `New booking: ${booking.eventName} with ${booking.inviteeName || "a guest"}`,
          html: `<div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
            <h2>New booking</h2>
            <p><strong>${escapeHtml(booking.inviteeName || "Guest")}</strong> (${escapeHtml(booking.inviteeEmail || "")}) booked
            <strong>${escapeHtml(booking.eventName)}</strong> on ${escapeHtml(booking.date)} at ${escapeHtml(booking.time)}.</p>
          </div>`,
        }),
      );
    }

    const results = await Promise.allSettled(tasks);
    results.forEach((r) => { if (r.status === "rejected") console.error("Email send failed:", r.reason); });
  },
);

exports.sendBookingCancellation = onDocumentUpdated(
  { document: "bookings/{bookingId}", secrets: [resendApiKey], region: "europe-west1" },
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) return;
    if (before.status !== "confirmed" || after.status !== "cancelled") return;

    const tasks = [];

    if (after.inviteeEmail) {
      tasks.push(
        sendEmail({
          to: after.inviteeEmail,
          subject: `Cancelled: ${after.eventName} on ${after.date}`,
          html: cancellationHtml(after),
        }),
      );
    }

    const hostEmail = await getHostEmail(after.hostUid);
    if (hostEmail) {
      tasks.push(
        sendEmail({
          to: hostEmail,
          subject: `Booking cancelled: ${after.eventName} with ${after.inviteeName || "a guest"}`,
          html: `<div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
            <p><strong>${escapeHtml(after.inviteeName || "Guest")}</strong> cancelled their ${escapeHtml(after.eventName)}
            on ${escapeHtml(after.date)} at ${escapeHtml(after.time)}.</p>
          </div>`,
        }),
      );
    }

    const results = await Promise.allSettled(tasks);
    results.forEach((r) => { if (r.status === "rejected") console.error("Email send failed:", r.reason); });
  },
);

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

// Runs every 15 minutes; sends a "day before" reminder once between 24h and 1h before a
// confirmed booking, and an "hour before" reminder once between 1h and 2min before it.
// Firestore doesn't have a real "fire at this instant" primitive, so this polls a narrow
// date-range window and tracks what's already been sent on the booking doc to stay idempotent.
exports.sendBookingReminders = onSchedule(
  { schedule: "every 15 minutes", secrets: [resendApiKey], region: "europe-west1" },
  async () => {
    const now = new Date();
    const dateFrom = new Date(now.getTime() - DAY_MS).toISOString().slice(0, 10);
    const dateTo = new Date(now.getTime() + DAY_MS + HOUR_MS).toISOString().slice(0, 10);

    const snap = await db
      .collection("bookings")
      .where("status", "==", "confirmed")
      .where("date", ">=", dateFrom)
      .where("date", "<=", dateTo)
      .get();

    for (const doc of snap.docs) {
      try {
        const booking = doc.data();
        if (!booking.date || !booking.time || !booking.hostUid) continue;

        const tz = await getHostTimezone(booking.hostUid);
        const startUtc = zonedTimeToUtc(booking.date, booking.time, tz);
        const msUntil = startUtc.getTime() - now.getTime();
        if (msUntil <= 2 * 60 * 1000) continue; // already started, or about to — too late to be useful

        const reminders = booking.reminders || {};
        const manageUrl = `${APP_URL}#manage?b=${encodeURIComponent(doc.id)}`;
        const updates = {};

        const sendReminder = async (label, subjectSuffix) => {
          const tasks = [];
          if (booking.inviteeEmail) {
            tasks.push(sendEmail({ to: booking.inviteeEmail, subject: `Reminder: ${booking.eventName} ${subjectSuffix}`, html: reminderHtml(booking, manageUrl, label) }));
          }
          const hostEmail = await getHostEmail(booking.hostUid);
          if (hostEmail) {
            tasks.push(sendEmail({ to: hostEmail, subject: `Reminder: ${booking.eventName} with ${booking.inviteeName || "a guest"} ${subjectSuffix}`, html: reminderHtml(booking, manageUrl, label) }));
          }
          const results = await Promise.allSettled(tasks);
          results.forEach((r) => { if (r.status === "rejected") console.error("Reminder email failed:", r.reason); });
        };

        if (!reminders.dayBeforeSentAt && msUntil <= DAY_MS && msUntil > HOUR_MS) {
          await sendReminder("your booking is coming up", "tomorrow");
          updates["reminders.dayBeforeSentAt"] = FieldValue.serverTimestamp();
        }
        if (!reminders.hourBeforeSentAt && msUntil <= HOUR_MS) {
          await sendReminder("your booking starts soon", "in about an hour");
          updates["reminders.hourBeforeSentAt"] = FieldValue.serverTimestamp();
        }

        if (Object.keys(updates).length) await doc.ref.update(updates);
      } catch (err) {
        console.error(`Failed to process reminder for booking ${doc.id}:`, err);
      }
    }
  },
);
