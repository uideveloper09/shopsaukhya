export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export type ContactFormErrors = Partial<
  Record<keyof ContactFormPayload, string>
>;

export type ContactSubmitResult = {
  success: boolean;
  message?: string;
  errors?: ContactFormErrors;
  delivery?: "api" | "email" | "formsubmit" | "mailto";
  mailto?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

export function normalizeContactPayload(
  input: Partial<ContactFormPayload>,
): ContactFormPayload {
  return {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim(),
    phone: String(input.phone ?? "").trim(),
    subject: String(input.subject ?? "").trim(),
    message: String(input.message ?? "").trim(),
  };
}

export function validateContactPayload(
  payload: ContactFormPayload,
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (payload.name.length < 2) {
    errors.name = "Please enter your full name.";
  }
  if (!EMAIL_RE.test(payload.email)) {
    errors.email = "Enter a valid email.";
  }
  if (payload.phone) {
    const digits = payload.phone.replace(/\D/g, "");
    const mobile =
      digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : digits.length === 11 && digits.startsWith("0")
          ? digits.slice(1)
          : digits;
    if (!PHONE_RE.test(mobile)) {
      errors.phone = "Enter a valid 10 digit mobile number.";
    }
  }
  if (payload.subject.length < 3) {
    errors.subject = "Please add a short subject.";
  }
  if (payload.message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

export function buildContactMailto(payload: ContactFormPayload): string {
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "—"}`,
    "",
    payload.message,
  ].join("\n");

  return `mailto:info@shopsaukhya.com?subject=${encodeURIComponent(
    payload.subject || "Saukhya enquiry",
  )}&body=${encodeURIComponent(body)}`;
}

export function formatContactEmailText(payload: ContactFormPayload): string {
  return [
    "New Saukhya contact enquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "—"}`,
    `Subject: ${payload.subject}`,
    "",
    payload.message,
  ].join("\n");
}
