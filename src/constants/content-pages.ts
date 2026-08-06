export const ABOUT_PAGE = {
  metaTitle: "About Us",
  metaDescription:
    "Learn about Saukhya, a slow fashion Indian wear brand crafting comfortable, elegant clothing in small batches.",
  kicker: "About Saukhya",
  title: "Indian wear made to feel calm, polished, and easy to live in.",
  intro:
    "Saukhya creates women's Indian wear for customers who want softness, elegance, and confidence without overdone styling. Each edit is built around comfort, considered prints, and pieces that move naturally from everyday plans to festive moments.",
  signature: {
    title: "Crafted in thoughtful edits",
    copy: "Small collections, careful details, and silhouettes chosen for real wardrobes.",
    images: [
      {
        src: "/ProductImg/16/optimized/00642a29-d886-4cd7-8335-9415b3372a90_1-detail.jpg",
        alt: "Saukhya floral kurta set",
      },
      {
        src: "/Banner/bahaar-slider-desktop-2.png",
        alt: "Bahaar collection floral edit",
      },
    ],
  },
  values: [
    {
      title: "Comfort first",
      copy: "Soft fabrics, easy silhouettes, and thoughtful finishing for long festive days and everyday movement.",
    },
    {
      title: "Small batches",
      copy: "Curated edits keep every style intentional, season-aware, and easier to finish with care.",
    },
    {
      title: "Indian ease",
      copy: "Feminine prints, graceful fits, and polished details made for modern Indian wardrobes.",
    },
  ],
  pointOfView: {
    kicker: "Our point of view",
    title: "Clothing should look special without feeling difficult.",
    copy: "We design around ease: breathable fabrics, flattering proportions, and prints that feel graceful rather than loud. The goal is simple: when you wear Saukhya, you should feel ready, comfortable, and quietly dressed up.",
  },
  craftSteps: [
    "Fabric selected for feel and fall",
    "Prints and colours balanced for wearability",
    "Fits checked for comfort before launch",
  ],
} as const;

export const CONTACT_PAGE = {
  metaTitle: "Contact Us",
  metaDescription:
    "Contact Saukhya for customer support, product questions, collaborations, and order help.",
  kicker: "Customer care",
  title:
    "Tell us what you need. We will help you choose, order, or resolve it calmly.",
  intro:
    "For faster support, include your Saukhya order reference when the question is about payment, delivery, address, or exchange.",
  supportCard: {
    title: "Need order support?",
    copy: "Keep your order reference ready so the team can find your details quickly.",
    image:
      "/ProductImg/14/optimized/85302e1f-cb14-4c09-b356-b3693c6cfac0_1-detail.jpg",
  },
  channels: [
    {
      title: "Order help",
      value: "+91 99966 88286",
      href: "tel:+919996688286",
      copy: "For payment, delivery, exchange, or address support.",
    },
    {
      title: "Email support",
      value: "info@shopsaukhya.com",
      href: "mailto:info@shopsaukhya.com",
      copy: "Share your order reference or product question.",
    },
    {
      title: "Studio base",
      value: "Gurugram, Haryana",
      href: "https://www.google.com/maps/search/?api=1&query=Gurugram,Haryana,India",
      copy: "Customer support and brand operations.",
    },
  ],
  form: {
    kicker: "Write to Saukhya",
    title: "Send a message",
    copy: "Use this for product questions, collaborations, and non-urgent order support.",
  },
  help: [
    {
      title: "Product guidance",
      copy: "Fit, fabric, size, and styling help before you order.",
    },
    {
      title: "Order updates",
      copy: "Payment, address, packing, and delivery assistance.",
    },
    {
      title: "Response window",
      copy: "We usually reply during business hours.",
    },
  ],
} as const;
