export const FOOTER_LINKS = {
  description:
    "Women's Indian wear crafted for comfort, soft festive dressing, and everyday celebrations.",
  shop: [
    { label: "All styles", href: "/shop" },
    { label: "Kurta sets", href: "/shop?subcategory=5" },
    { label: "Dresses", href: "/shop?subcategory=3" },
    { label: "Tops", href: "/shop?subcategory=2" },
    { label: "Co-ord sets", href: "/shop?subcategory=4" },
  ],
  help: [
    { label: "Contact us", href: "/contact" },
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
      "https://www.google.com/maps?q=Gurugram%2C+Haryana%2C+India&hl=en&z=13&output=embed",
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
