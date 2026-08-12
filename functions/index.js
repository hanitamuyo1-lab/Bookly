const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

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

function confirmationHtml(booking, manageUrl) {
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <h2 style="margin-bottom: 4px;">You're booked!</h2>
      <p style="color: #555;">Your ${escapeHtml(booking.eventName)} is confirmed.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #888;">Date</td><td style="padding: 6px 0;"><strong>${escapeHtml(booking.date)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Time</td><td style="padding: 6px 0;"><strong>${escapeHtml(booking.time)} – ${escapeHtml(booking.endTime)}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Location</td><td style="padding: 6px 0;">${escapeHtml(booking.location || "TBD")}</td></tr>
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
