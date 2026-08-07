export type PhoneCountry = {
  iso: string;
  name: string;
  dial: string;
  flag: string;
  minLength: number;
  maxLength: number;
  /** National significant number pattern (digits only). */
  pattern: RegExp;
  placeholder: string;
};

/** Curated list for Saukhya (India-first + common international). */
export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    iso: "IN",
    name: "India",
    dial: "91",
    flag: "🇮🇳",
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
    placeholder: "10 digit mobile",
  },
  {
    iso: "AE",
    name: "United Arab Emirates",
    dial: "971",
    flag: "🇦🇪",
    minLength: 9,
    maxLength: 9,
    pattern: /^[5]\d{8}$/,
    placeholder: "9 digit mobile",
  },
  {
    iso: "US",
    name: "United States",
    dial: "1",
    flag: "🇺🇸",
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{9}$/,
    placeholder: "10 digit number",
  },
  {
    iso: "GB",
    name: "United Kingdom",
    dial: "44",
    flag: "🇬🇧",
    minLength: 10,
    maxLength: 10,
    pattern: /^7\d{9}$/,
    placeholder: "10 digit mobile",
  },
  {
    iso: "SA",
    name: "Saudi Arabia",
    dial: "966",
    flag: "🇸🇦",
    minLength: 9,
    maxLength: 9,
    pattern: /^5\d{8}$/,
    placeholder: "9 digit mobile",
  },
  {
    iso: "QA",
    name: "Qatar",
    dial: "974",
    flag: "🇶🇦",
    minLength: 8,
    maxLength: 8,
    pattern: /^[3-7]\d{7}$/,
    placeholder: "8 digit mobile",
  },
  {
    iso: "KW",
    name: "Kuwait",
    dial: "965",
    flag: "🇰🇼",
    minLength: 8,
    maxLength: 8,
    pattern: /^[569]\d{7}$/,
    placeholder: "8 digit mobile",
  },
  {
    iso: "OM",
    name: "Oman",
    dial: "968",
    flag: "🇴🇲",
    minLength: 8,
    maxLength: 8,
    pattern: /^[79]\d{7}$/,
    placeholder: "8 digit mobile",
  },
  {
    iso: "BH",
    name: "Bahrain",
    dial: "973",
    flag: "🇧🇭",
    minLength: 8,
    maxLength: 8,
    pattern: /^[36]\d{7}$/,
    placeholder: "8 digit mobile",
  },
  {
    iso: "SG",
    name: "Singapore",
    dial: "65",
    flag: "🇸🇬",
    minLength: 8,
    maxLength: 8,
    pattern: /^[89]\d{7}$/,
    placeholder: "8 digit mobile",
  },
  {
    iso: "AU",
    name: "Australia",
    dial: "61",
    flag: "🇦🇺",
    minLength: 9,
    maxLength: 9,
    pattern: /^4\d{8}$/,
    placeholder: "9 digit mobile",
  },
  {
    iso: "CA",
    name: "Canada",
    dial: "1",
    flag: "🇨🇦",
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{9}$/,
    placeholder: "10 digit number",
  },
  {
    iso: "PK",
    name: "Pakistan",
    dial: "92",
    flag: "🇵🇰",
    minLength: 10,
    maxLength: 10,
    pattern: /^3\d{9}$/,
    placeholder: "10 digit mobile",
  },
  {
    iso: "BD",
    name: "Bangladesh",
    dial: "880",
    flag: "🇧🇩",
    minLength: 10,
    maxLength: 10,
    pattern: /^1\d{9}$/,
    placeholder: "10 digit mobile",
  },
  {
    iso: "NP",
    name: "Nepal",
    dial: "977",
    flag: "🇳🇵",
    minLength: 10,
    maxLength: 10,
    pattern: /^9\d{9}$/,
    placeholder: "10 digit mobile",
  },
];

export const DEFAULT_PHONE_COUNTRY =
  PHONE_COUNTRIES.find((c) => c.iso === "IN") ?? PHONE_COUNTRIES[0];

export function getPhoneCountry(iso: string): PhoneCountry {
  return (
    PHONE_COUNTRIES.find((c) => c.iso === iso) ?? DEFAULT_PHONE_COUNTRY
  );
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Strip leading 0 / country dial from pasted national numbers. */
export function normalizeNationalNumber(
  raw: string,
  country: PhoneCountry,
): string {
  let digits = digitsOnly(raw);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.startsWith(country.dial) && digits.length > country.maxLength) {
    digits = digits.slice(country.dial.length);
  }
  return digits.slice(0, country.maxLength);
}

export function formatInternationalPhone(
  national: string,
  country: PhoneCountry,
): string {
  const n = normalizeNationalNumber(national, country);
  if (!n) return "";
  return `+${country.dial}${n}`;
}

export function validateNationalPhone(
  national: string,
  countryIso: string,
): string | undefined {
  const country = getPhoneCountry(countryIso);
  const n = normalizeNationalNumber(national, country);
  if (!n) return undefined;
  if (n.length < country.minLength || n.length > country.maxLength) {
    return `Enter a valid ${country.minLength}${
      country.minLength === country.maxLength ? "" : `–${country.maxLength}`
    } digit ${country.name} number.`;
  }
  if (!country.pattern.test(n)) {
    return `Enter a valid ${country.name} mobile number.`;
  }
  return undefined;
}
