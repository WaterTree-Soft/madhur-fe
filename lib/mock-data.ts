import type { Category, Product, Banner } from "@/types";

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Mithai",
    slug: "mithai",
    description:
      "Traditional Indian sweets made with pure ghee, milk, and sugar. A timeless treat for every celebration.",
    image: "/images/categories/mithai.svg",
    productCount: 4,
  },
  {
    id: "2",
    name: "Namkeen",
    slug: "namkeen",
    description:
      "Crispy and savoury snacks prepared with authentic spices. Perfect for tea-time and gatherings.",
    image: "/images/categories/namkeen.svg",
    productCount: 2,
  },
  {
    id: "3",
    name: "Ladoo",
    slug: "ladoo",
    description:
      "Round balls of happiness! Handcrafted ladoos in a variety of flavours and textures.",
    image: "/images/categories/ladoo.svg",
    productCount: 2,
  },
  {
    id: "4",
    name: "Barfi",
    slug: "barfi",
    description:
      "Rich and creamy barfi made with condensed milk, nuts, and aromatic flavours.",
    image: "/images/categories/barfi.svg",
    productCount: 2,
  },
  {
    id: "5",
    name: "Halwa",
    slug: "halwa",
    description:
      "Warm, melt-in-your-mouth halwa prepared with pure desi ghee and premium ingredients.",
    image: "/images/categories/halwa.svg",
    productCount: 1,
  },
  {
    id: "6",
    name: "Dry Fruits",
    slug: "dry-fruits",
    description:
      "Premium quality dry fruits sourced from the finest orchards. Great for gifting and daily nutrition.",
    image: "/images/categories/dry-fruits.svg",
    productCount: 1,
  },
];

export const mockProducts: Product[] = [
  // --- Mithai ---
  {
    id: "1",
    name: "Gulab Jamun",
    slug: "gulab-jamun",
    description:
      "Soft, spongy milk-solid dumplings soaked in rose-flavoured sugar syrup. Our gulab jamuns are made fresh daily with khoya and a hint of cardamom, ensuring a melt-in-your-mouth experience.",
    shortDescription: "Soft khoya dumplings soaked in rose sugar syrup.",
    price: 350,
    discountPrice: 299,
    images: [
      "/images/products/gulab-jamun.svg",
      "/images/products/gulab-jamun-2.svg",
    ],
    category: mockCategories[0],
    inStock: true,
    weight: "500g",
    ingredients: "Khoya, sugar, rose water, cardamom, refined flour, ghee",
    shelfLife: "5 days",
    rating: 4.8,
    reviewCount: 124,
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Rasgulla",
    slug: "rasgulla",
    description:
      "Light and spongy cottage-cheese balls cooked in light sugar syrup. A classic Bengali sweet that is loved across India for its delicate texture and subtle sweetness.",
    shortDescription: "Spongy paneer balls in light sugar syrup.",
    price: 320,
    images: ["/images/products/rasgulla.svg"],
    category: mockCategories[0],
    inStock: true,
    weight: "500g",
    ingredients: "Paneer (cottage cheese), sugar, water, cardamom",
    shelfLife: "7 days (refrigerated)",
    rating: 4.6,
    reviewCount: 98,
    createdAt: "2025-11-05T10:00:00Z",
  },
  {
    id: "3",
    name: "Jalebi",
    slug: "jalebi",
    description:
      "Crispy, golden spirals of fermented batter deep-fried and soaked in saffron sugar syrup. Best enjoyed warm, our jalebis are a crowd favourite at festivals and celebrations.",
    shortDescription: "Crispy golden spirals soaked in saffron syrup.",
    price: 280,
    images: [
      "/images/products/jalebi.svg",
      "/images/products/jalebi-2.svg",
    ],
    category: mockCategories[0],
    inStock: true,
    weight: "400g",
    ingredients: "Refined flour, sugar, saffron, ghee, yogurt",
    shelfLife: "2 days",
    rating: 4.7,
    reviewCount: 156,
    createdAt: "2025-11-10T10:00:00Z",
  },
  {
    id: "4",
    name: "Cham Cham",
    slug: "cham-cham",
    description:
      "Oval-shaped Bengali sweets made from fresh paneer, stuffed with creamy mawa filling and topped with desiccated coconut. Delightfully soft and aromatic.",
    shortDescription: "Soft paneer sweets with creamy mawa filling.",
    price: 380,
    images: ["/images/products/cham-cham.svg"],
    category: mockCategories[0],
    inStock: true,
    weight: "500g",
    ingredients: "Paneer, sugar, mawa, coconut, cardamom",
    shelfLife: "4 days (refrigerated)",
    rating: 4.5,
    reviewCount: 67,
    createdAt: "2025-11-15T10:00:00Z",
  },

  // --- Namkeen ---
  {
    id: "5",
    name: "Aloo Bhujia",
    slug: "aloo-bhujia",
    description:
      "Thin, crispy potato-based savoury noodles seasoned with a special blend of spices. A Bikaneri classic that pairs perfectly with evening chai.",
    shortDescription: "Crispy spiced potato noodle snack.",
    price: 180,
    images: ["/images/products/aloo-bhujia.svg"],
    category: mockCategories[1],
    inStock: true,
    weight: "400g",
    ingredients: "Potato, gram flour, vegetable oil, salt, spices",
    shelfLife: "60 days",
    rating: 4.4,
    reviewCount: 203,
    createdAt: "2025-11-02T10:00:00Z",
  },
  {
    id: "6",
    name: "Moong Dal Namkeen",
    slug: "moong-dal-namkeen",
    description:
      "Crunchy fried moong dal tossed with curry leaves, peanuts, and a touch of hing. A protein-rich snack that is both healthy and irresistible.",
    shortDescription: "Crunchy fried moong dal with curry leaves.",
    price: 160,
    images: ["/images/products/moong-dal-namkeen.svg"],
    category: mockCategories[1],
    inStock: true,
    weight: "350g",
    ingredients: "Moong dal, peanuts, curry leaves, hing, salt, vegetable oil",
    shelfLife: "45 days",
    rating: 4.3,
    reviewCount: 89,
    createdAt: "2025-11-08T10:00:00Z",
  },

  // --- Ladoo ---
  {
    id: "7",
    name: "Motichoor Ladoo",
    slug: "motichoor-ladoo",
    description:
      "Fine, melt-in-your-mouth ladoos made from tiny boondi pearls bound with sugar syrup and flavoured with cardamom and rose water. A must-have for weddings and pujas.",
    shortDescription: "Delicate boondi pearl ladoos with cardamom.",
    price: 420,
    discountPrice: 380,
    images: [
      "/images/products/motichoor-ladoo.svg",
      "/images/products/motichoor-ladoo-2.svg",
    ],
    category: mockCategories[2],
    inStock: true,
    weight: "500g",
    ingredients: "Gram flour, sugar, ghee, cardamom, rose water",
    shelfLife: "10 days",
    rating: 4.9,
    reviewCount: 312,
    createdAt: "2025-11-03T10:00:00Z",
  },
  {
    id: "8",
    name: "Besan Ladoo",
    slug: "besan-ladoo",
    description:
      "Traditional ladoos made by roasting gram flour in desi ghee until golden, then mixed with powdered sugar and studded with almonds and cashews.",
    shortDescription: "Roasted gram flour ladoos with nuts.",
    price: 360,
    images: ["/images/products/besan-ladoo.svg"],
    category: mockCategories[2],
    inStock: true,
    weight: "500g",
    ingredients: "Gram flour, ghee, sugar, almonds, cashews, cardamom",
    shelfLife: "15 days",
    rating: 4.6,
    reviewCount: 178,
    createdAt: "2025-11-12T10:00:00Z",
  },

  // --- Barfi ---
  {
    id: "9",
    name: "Kaju Katli",
    slug: "kaju-katli",
    description:
      "Thin, diamond-shaped slices of pure cashew fudge with a delicate silver leaf topping. Our signature kaju katli is made with 100% cashew nuts and minimal sugar for a rich, nutty flavour.",
    shortDescription: "Premium cashew fudge with silver leaf.",
    price: 680,
    discountPrice: 599,
    images: [
      "/images/products/kaju-katli.svg",
      "/images/products/kaju-katli-2.svg",
    ],
    category: mockCategories[3],
    inStock: true,
    weight: "500g",
    ingredients: "Cashew nuts, sugar, ghee, silver leaf",
    shelfLife: "15 days",
    rating: 4.9,
    reviewCount: 445,
    createdAt: "2025-10-20T10:00:00Z",
  },
  {
    id: "10",
    name: "Pista Barfi",
    slug: "pista-barfi",
    description:
      "Vibrant green barfi crafted from ground pistachios and khoya. Each piece is garnished with slivered pistachios and a touch of saffron for an irresistible aroma.",
    shortDescription: "Rich pistachio and khoya barfi with saffron.",
    price: 720,
    images: ["/images/products/pista-barfi.svg"],
    category: mockCategories[3],
    inStock: false,
    weight: "500g",
    ingredients: "Pistachios, khoya, sugar, saffron, cardamom",
    shelfLife: "12 days",
    rating: 4.7,
    reviewCount: 134,
    createdAt: "2025-11-18T10:00:00Z",
  },

  // --- Halwa ---
  {
    id: "11",
    name: "Gajar Ka Halwa",
    slug: "gajar-ka-halwa",
    description:
      "Slow-cooked grated carrots simmered in full-fat milk and desi ghee, sweetened with sugar, and garnished with almonds, cashews, and raisins. A beloved winter delicacy.",
    shortDescription: "Slow-cooked carrot pudding with nuts and ghee.",
    price: 400,
    discountPrice: 349,
    images: [
      "/images/products/gajar-ka-halwa.svg",
      "/images/products/gajar-ka-halwa-2.svg",
    ],
    category: mockCategories[4],
    inStock: true,
    weight: "500g",
    ingredients: "Carrots, milk, sugar, ghee, almonds, cashews, raisins, cardamom",
    shelfLife: "5 days (refrigerated)",
    rating: 4.8,
    reviewCount: 267,
    createdAt: "2025-12-01T10:00:00Z",
  },

  // --- Dry Fruits ---
  {
    id: "12",
    name: "Premium Mixed Dry Fruits",
    slug: "premium-mixed-dry-fruits",
    description:
      "A curated selection of California almonds, Iranian pistachios, Afghan walnuts, and Munakka raisins. Hygienically packed and perfect for gifting or daily snacking.",
    shortDescription: "Curated mix of premium almonds, pistachios, walnuts, and raisins.",
    price: 850,
    images: [
      "/images/products/mixed-dry-fruits.svg",
      "/images/products/mixed-dry-fruits-2.svg",
    ],
    category: mockCategories[5],
    inStock: true,
    weight: "500g",
    ingredients: "Almonds, pistachios, walnuts, raisins",
    shelfLife: "90 days",
    rating: 4.7,
    reviewCount: 189,
    createdAt: "2025-10-15T10:00:00Z",
  },
];

export const mockBanner: Banner = {
  id: "1",
  message: "Diwali Special! Get 20% off on all sweets \u{1F389}",
  link: "/products",
  active: true,
};
