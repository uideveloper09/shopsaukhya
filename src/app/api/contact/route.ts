import { NextResponse } from "next/server";
import {
  buildContactMailto,
  formatContactEmailText,
  normalizeContactPayload,
  validateContactPayload,
  type ContactFormPayload,
  type ContactSubmitResult,
} from "@/lib/contact-form";
import { storefrontPost } from "@/lib/storefront/client";

export const runtime = "nodejs";

async function deliverViaWebhook(
  payload: ContactFormPayload,
): Promise<boolean> {
  const webhook = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!webhook) return false;

  const res = await fetch(webhook, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return res.ok || res.status === 204;
}

async function deliverViaResend(
  payload: ContactFormPayload,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const to = process.env.CONTACT_TO_EMAIL?.trim() || "info@shopsaukhya.com";
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Saukhya <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[Saukhya Contact] ${payload.subject}`,
      text: formatContactEmailText(payload),
    }),
    cache: "no-store",
  });

  return res.ok;
}

async function deliverViaFormSubmit(
  payload: ContactFormPayload,
): Promise<boolean> {
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "info@shopsaukhya.com";

  const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      subject: payload.subject,
      message: payload.message,
      _subject: `Saukhya contact: ${payload.subject}`,
      _template: "table",
      _captcha: "false",
    }),
    cache: "no-store",
  });

  if (!res.ok) return false;
  const data = (await res.json().catch(() => null)) as {
    success?: string | boolean;
  } | null;
  return Boolean(data?.success);
}

async function trackContactEvent(payload: ContactFormPayload) {
  await storefrontPost(
    "/api/storefront/events",
    {
      sessionId: `contact-${Date.now()}`,
      customerCode: null,
      eventType: "contact_form_submit",
      sourcePage: "/contact",
      sourceUrl: "/contact",
      crmEligible: true,
      eventData: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || "",
        subject: payload.subject,
      },
    },
    null,
  );
}

export async function POST(request: Request) {
  let raw: Partial<ContactFormPayload> = {};

  try {
    raw = (await request.json()) as Partial<ContactFormPayload>;
  } catch {
    return NextResponse.json<ContactSubmitResult>(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const payload = normalizeContactPayload(raw);
  const errors = validateContactPayload(payload);

  if (Object.keys(errors).length) {
    return NextResponse.json<ContactSubmitResult>(
      {
        success: false,
        message: "Please check the highlighted fields.",
        errors,
      },
      { status: 400 },
    );
  }

  // Best-effort analytics (same events channel as live storefront).
  void trackContactEvent(payload);

  try {
    if (await deliverViaWebhook(payload)) {
      return NextResponse.json<ContactSubmitResult>({
        success: true,
        delivery: "api",
        message: "Thank you. Your message has been sent.",
      });
    }

    if (await deliverViaResend(payload)) {
      return NextResponse.json<ContactSubmitResult>({
        success: true,
        delivery: "email",
        message: "Thank you. Your message has been sent.",
      });
    }

    if (await deliverViaFormSubmit(payload)) {
      return NextResponse.json<ContactSubmitResult>({
        success: true,
        delivery: "formsubmit",
        message: "Thank you. Your message has been sent.",
      });
    }
  } catch {
    // Fall through to mailto fallback.
  }

  return NextResponse.json<ContactSubmitResult>({
    success: true,
    delivery: "mailto",
    mailto: buildContactMailto(payload),
    message: "Opening your email app to finish sending…",
  });
}
