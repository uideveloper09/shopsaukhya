export const FOOTER_LINKS = {
  description:
    "Women's Indian wear crafted for comfort, soft festive dressing, and everyday celebrations.",
  shop: [
    { label: "All styles", href: "/shop/all-styles" },
    { label: "Kurta sets", href: "/shop/kurta-sets" },
    { label: "Dresses", href: "/shop/dresses" },
    { label: "Tops", href: "/shop/tops" },
    { label: "Co-ord sets", href: "/shop/co-ord-sets" },
  ],
  help: [
    { label: "Contact us", href: "/contact-us" },
    { label: "Size guide", href: "/size-guide" },
  ],
  policies: [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Shipping & Payments", href: "/shipping-policy" },
    { label: "Returns & Exchanges", href: "/return-policy" },
  ],
  contact: {
    email: "info@shopsaukhya.com",
    phone: "+91 99966 88286",
    address: "Gurugram, Haryana, India",
    mapQuery: "Gurugram, Haryana, India",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Gurugram,Haryana,India&hl=en&z=11&output=embed",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Gurugram,Haryana,India",
  },
  social: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/shopsaukhya",
      icon: "instagram",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/shopsaukhya",
      icon: "facebook",
    },
  ],
  promises: [
    { label: "Secure checkout", icon: "payments" },
    { label: "COD available", icon: "cod" },
    { label: "Shipping support", icon: "shipping" },
    { label: "Easy returns", icon: "returns" },
    { label: "Size guidance", icon: "size" },
  ],
  paymentMethods: [
    {
      id: "upi",
      label: "UPI",
      className: "border-[#097939] bg-[#097939] text-white",
    },
    {
      id: "razorpay",
      label: "Razorpay",
      className: "border-[#072654] bg-[#072654] text-white",
    },
    {
      id: "cod",
      label: "COD",
      className: "border-[#2e7d32] bg-[#2e7d32] text-white",
    },
    {
      id: "cards",
      label: "Cards",
      className:
        "border-transparent bg-gradient-to-r from-[#1a1f71] via-[#eb001b] to-[#f79e1b] text-white",
    },
  ],
} as const;
