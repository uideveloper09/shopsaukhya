import {
  DEFAULT_PHONE_COUNTRY,
  formatInternationalPhone,
  getPhoneCountry,
  normalizeNationalNumber,
  validateNationalPhone,
} from "@/lib/phone-countries";

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  phoneCountry?: string;
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

export function normalizeContactPayload(
  input: Partial<ContactFormPayload> & { phoneNational?: string },
): ContactFormPayload {
  const phoneCountry =
    String(input.phoneCountry ?? DEFAULT_PHONE_COUNTRY.iso).trim() ||
    DEFAULT_PHONE_COUNTRY.iso;
  const country = getPhoneCountry(phoneCountry);

  const nationalRaw = String(input.phoneNational ?? "").trim();
  const fallbackPhone = String(input.phone ?? "").trim();

  let national = "";
  if (nationalRaw) {
    national = normalizeNationalNumber(nationalRaw, country);
  } else if (fallbackPhone) {
    const digits = fallbackPhone.replace(/\D/g, "");
    national = digits.startsWith(country.dial)
      ? digits.slice(country.dial.length)
      : normalizeNationalNumber(fallbackPhone, country);
  }

  return {
    name: String(input.name ?? "").trim(),
    email: String(input.email ?? "").trim(),
    phone: national ? formatInternationalPhone(national, country) : "",
    phoneCountry: country.iso,
    subject: String(input.subject ?? "").trim(),
    message: String(input.message ?? "").trim(),
  };
}

export function validateContactPayload(
  payload: ContactFormPayload,
): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (payload.name.length < 4) {
    errors.name = "Name must be at least 4 characters.";
  } else if (payload.name.length > 55) {
    errors.name = "Name must be 55 characters or less.";
  }
  if (!EMAIL_RE.test(payload.email)) {
    errors.email = "Enter a valid email.";
  }

  if (payload.phone) {
    const country = getPhoneCountry(
      payload.phoneCountry || DEFAULT_PHONE_COUNTRY.iso,
    );
    const digits = payload.phone.replace(/\D/g, "");
    const national = digits.startsWith(country.dial)
      ? digits.slice(country.dial.length)
      : digits;
    const phoneError = validateNationalPhone(national, country.iso);
    if (phoneError) errors.phone = phoneError;
  }

  if (payload.subject.length < 3) {
    errors.subject = "Please add a short subject.";
  }
  if (payload.message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (payload.message.length > 250) {
    errors.message = "Message must be 250 characters or less.";
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
