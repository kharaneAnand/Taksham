import accentChair from "../assets/images/products/accent-chair.png";
import diningTable from "../assets/images/products/dining-table.png";
import floorLamp from "../assets/images/products/floor-lamp.png";
import sofa from "../assets/images/products/sofa.png";
import storageCabinet from "../assets/images/products/storage-cabinet.png";
import tvUnit from "../assets/images/products/tv-unit.png";

import type { Product } from "../types/product";

export const products: Product[] = [
  // ============================================================
  // 01 — AIRA ACCENT CHAIR
  // ============================================================

  {
    id: 1,

    name: "Aira Accent Chair",

    slug: "aira-accent-chair",

    price: 18990,

    image: accentChair,

    category: "Furniture",

    subcategory: "Chairs",

    room: "Living Room",

    material: "Fabric & Wood",

    colors: ["Beige", "Brown", "Black"],

    rating: 4.7,

    reviews: 143,

    isNew: true,

    description:
      "A refined accent chair designed to bring warmth and character to contemporary living spaces.",

    stock: 12,

    variants: [
      {
        id: 101,
        color: "Beige",
        images: [accentChair],
        price: 18990,
        stock: 5,
      },
      {
        id: 102,
        color: "Brown",
        images: [accentChair],
        price: 18990,
        stock: 4,
      },
      {
        id: 103,
        color: "Black",
        images: [accentChair],
        price: 18990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 02 — LUNA DINING TABLE
  // ============================================================

  {
    id: 2,

    name: "Luna Dining Table",

    slug: "luna-dining-table",

    price: 24990,

    image: diningTable,

    category: "Furniture",

    subcategory: "Tables",

    room: "Dining Room",

    material: "Natural Wood",

    colors: ["Beige", "Brown"],

    rating: 4.8,

    reviews: 128,

    description:
      "A timeless dining table with a warm natural finish for everyday gatherings.",

    stock: 8,

    variants: [
      {
        id: 201,
        color: "Beige",
        images: [diningTable],
        price: 24990,
        stock: 4,
      },
      {
        id: 202,
        color: "Brown",
        images: [diningTable],
        price: 24990,
        stock: 4,
      },
    ],
  },

  // ============================================================
  // 03 — AIRA FLOOR LAMP
  // ============================================================

  {
    id: 3,

    name: "Aira Floor Lamp",

    slug: "aira-floor-lamp",

    price: 7990,

    image: floorLamp,

    category: "Lighting",

    subcategory: "Lighting",

    room: "Living Room",

    material: "Metal",

    colors: ["Black", "White"],

    rating: 4.6,

    reviews: 96,

    description:
      "A sculptural floor lamp that adds a soft, ambient glow to your interiors.",

    stock: 18,

    variants: [
      {
        id: 301,
        color: "Black",
        images: [floorLamp],
        price: 7990,
        stock: 10,
      },
      {
        id: 302,
        color: "White",
        images: [floorLamp],
        price: 7990,
        stock: 8,
      },
    ],
  },

  // ============================================================
  // 04 — LUNA SOFA
  // ============================================================

  {
    id: 4,

    name: "Luna Sofa",

    slug: "luna-sofa",

    price: 29990,

    image: sofa,

    category: "Furniture",

    subcategory: "Sofas",

    room: "Living Room",

    material: "Fabric",

    colors: ["Beige", "Brown", "Grey"],

    rating: 4.9,

    reviews: 245,

    description:
      "A comfortable contemporary sofa with a refined silhouette for modern living.",

    stock: 10,

    variants: [
      {
        id: 401,
        color: "Beige",
        images: [sofa],
        price: 29990,
        stock: 4,
      },
      {
        id: 402,
        color: "Brown",
        images: [sofa],
        price: 29990,
        stock: 3,
      },
      {
        id: 403,
        color: "Grey",
        images: [sofa],
        price: 29990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 05 — LOMALS STORAGE CABINET
  // ============================================================

  {
    id: 5,

    name: "Lomals Storage Cabinet",

    slug: "lomals-storage-cabinet",

    price: 21990,

    image: storageCabinet,

    category: "Storage",

    subcategory: "Storage",

    room: "Living Room",

    material: "Engineered Wood",

    colors: ["Brown", "Beige"],

    rating: 4.5,

    reviews: 84,

    description:
      "Elegant concealed storage designed to keep your living space organized.",

    stock: 7,

    variants: [
      {
        id: 501,
        color: "Brown",
        images: [storageCabinet],
        price: 21990,
        stock: 4,
      },
      {
        id: 502,
        color: "Beige",
        images: [storageCabinet],
        price: 21990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 06 — LINEA TV UNIT
  // ============================================================

  {
    id: 6,

    name: "Linea TV Unit",

    slug: "linea-tv-unit",

    price: 19990,

    image: tvUnit,

    category: "Furniture",

    subcategory: "Storage",

    room: "Living Room",

    material: "Engineered Wood",

    colors: ["Brown", "Black"],

    rating: 4.7,

    reviews: 112,

    description:
      "A clean-lined TV unit combining practical storage with understated design.",

    stock: 9,

    variants: [
      {
        id: 601,
        color: "Brown",
        images: [tvUnit],
        price: 19990,
        stock: 5,
      },
      {
        id: 602,
        color: "Black",
        images: [tvUnit],
        price: 19990,
        stock: 4,
      },
    ],
  },

  // ============================================================
  // 07 — AIRA ACCENT CHAIR
  // ============================================================

  {
    id: 7,

    name: "Aira Accent Chair",

    slug: "aira-accent-chair-2",

    price: 18990,

    image: accentChair,

    category: "Furniture",

    subcategory: "Chairs",

    room: "Living Room",

    material: "Fabric & Wood",

    colors: ["Beige", "Brown", "Black"],

    rating: 4.7,

    reviews: 143,

    isNew: true,

    description:
      "A refined accent chair designed to bring warmth and character to contemporary living spaces.",

    stock: 12,

    variants: [
      {
        id: 701,
        color: "Beige",
        images: [accentChair],
        price: 18990,
        stock: 5,
      },
      {
        id: 702,
        color: "Brown",
        images: [accentChair],
        price: 18990,
        stock: 4,
      },
      {
        id: 703,
        color: "Black",
        images: [accentChair],
        price: 18990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 08 — LUNA DINING TABLE
  // ============================================================

  {
    id: 8,

    name: "Luna Dining Table",

    slug: "luna-dining-table-2",

    price: 24990,

    image: diningTable,

    category: "Furniture",

    subcategory: "Tables",

    room: "Dining Room",

    material: "Natural Wood",

    colors: ["Beige", "Brown"],

    rating: 4.8,

    reviews: 128,

    description:
      "A timeless dining table with a warm natural finish for everyday gatherings.",

    stock: 8,

    variants: [
      {
        id: 801,
        color: "Beige",
        images: [diningTable],
        price: 24990,
        stock: 4,
      },
      {
        id: 802,
        color: "Brown",
        images: [diningTable],
        price: 24990,
        stock: 4,
      },
    ],
  },

  // ============================================================
  // 09 — AIRA FLOOR LAMP
  // ============================================================

  {
    id: 9,

    name: "Aira Floor Lamp",

    slug: "aira-floor-lamp-2",

    price: 7990,

    image: floorLamp,

    category: "Lighting",

    subcategory: "Lighting",

    room: "Living Room",

    material: "Metal",

    colors: ["Black", "White"],

    rating: 4.6,

    reviews: 96,

    description:
      "A sculptural floor lamp that adds a soft, ambient glow to your interiors.",

    stock: 18,

    variants: [
      {
        id: 901,
        color: "Black",
        images: [floorLamp],
        price: 7990,
        stock: 10,
      },
      {
        id: 902,
        color: "White",
        images: [floorLamp],
        price: 7990,
        stock: 8,
      },
    ],
  },

  // ============================================================
  // 10 — LUNA SOFA
  // ============================================================

  {
    id: 10,

    name: "Luna Sofa",

    slug: "luna-sofa-2",

    price: 29990,

    image: sofa,

    category: "Furniture",

    subcategory: "Sofas",

    room: "Living Room",

    material: "Fabric",

    colors: ["Beige", "Brown", "Grey"],

    rating: 4.9,

    reviews: 245,

    description:
      "A comfortable contemporary sofa with a refined silhouette for modern living.",

    stock: 11,

    variants: [
      {
        id: 1001,
        color: "Beige",
        images: [sofa],
        price: 29990,
        stock: 5,
      },
      {
        id: 1002,
        color: "Brown",
        images: [sofa],
        price: 29990,
        stock: 3,
      },
      {
        id: 1003,
        color: "Grey",
        images: [sofa],
        price: 29990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 11 — LOMALS STORAGE CABINET
  // ============================================================

  {
    id: 11,

    name: "Lomals Storage Cabinet",

    slug: "lomals-storage-cabinet-2",

    price: 21990,

    image: storageCabinet,

    category: "Storage",

    subcategory: "Storage",

    room: "Living Room",

    material: "Engineered Wood",

    colors: ["Brown", "Beige"],

    rating: 4.5,

    reviews: 84,

    description:
      "Elegant concealed storage designed to keep your living space organized.",

    stock: 7,

    variants: [
      {
        id: 1101,
        color: "Brown",
        images: [storageCabinet],
        price: 21990,
        stock: 4,
      },
      {
        id: 1102,
        color: "Beige",
        images: [storageCabinet],
        price: 21990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 12 — LINEA TV UNIT
  // ============================================================

  {
    id: 12,

    name: "Linea TV Unit",

    slug: "linea-tv-unit-2",

    price: 19990,

    image: tvUnit,

    category: "Furniture",

    subcategory: "Storage",

    room: "Living Room",

    material: "Engineered Wood",

    colors: ["Brown", "Black"],

    rating: 4.7,

    reviews: 112,

    description:
      "A clean-lined TV unit combining practical storage with understated design.",

    stock: 9,

    variants: [
      {
        id: 1201,
        color: "Brown",
        images: [tvUnit],
        price: 19990,
        stock: 5,
      },
      {
        id: 1202,
        color: "Black",
        images: [tvUnit],
        price: 19990,
        stock: 4,
      },
    ],
  },

  // ============================================================
  // 13 — AIRA ACCENT CHAIR
  // ============================================================

  {
    id: 13,

    name: "Aira Accent Chair",

    slug: "aira-accent-chair-3",

    price: 18990,

    image: accentChair,

    category: "Furniture",

    subcategory: "Chairs",

    room: "Living Room",

    material: "Fabric & Wood",

    colors: ["Beige", "Brown", "Black"],

    rating: 4.7,

    reviews: 143,

    isNew: true,

    description:
      "A refined accent chair designed to bring warmth and character to contemporary living spaces.",

    stock: 12,

    variants: [
      {
        id: 1301,
        color: "Beige",
        images: [accentChair],
        price: 18990,
        stock: 5,
      },
      {
        id: 1302,
        color: "Brown",
        images: [accentChair],
        price: 18990,
        stock: 4,
      },
      {
        id: 1303,
        color: "Black",
        images: [accentChair],
        price: 18990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 14 — LUNA DINING TABLE
  // ============================================================

  {
    id: 14,

    name: "Luna Dining Table",

    slug: "luna-dining-table-3",

    price: 24990,

    image: diningTable,

    category: "Furniture",

    subcategory: "Tables",

    room: "Dining Room",

    material: "Natural Wood",

    colors: ["Beige", "Brown"],

    rating: 4.8,

    reviews: 128,

    description:
      "A timeless dining table with a warm natural finish for everyday gatherings.",

    stock: 8,

    variants: [
      {
        id: 1401,
        color: "Beige",
        images: [diningTable],
        price: 24990,
        stock: 4,
      },
      {
        id: 1402,
        color: "Brown",
        images: [diningTable],
        price: 24990,
        stock: 4,
      },
    ],
  },

  // ============================================================
  // 15 — AIRA FLOOR LAMP
  // ============================================================

  {
    id: 15,

    name: "Aira Floor Lamp",

    slug: "aira-floor-lamp-3",

    price: 7990,

    image: floorLamp,

    category: "Lighting",

    subcategory: "Lighting",

    room: "Living Room",

    material: "Metal",

    colors: ["Black", "White"],

    rating: 4.6,

    reviews: 96,

    description:
      "A sculptural floor lamp that adds a soft, ambient glow to your interiors.",

    stock: 18,

    variants: [
      {
        id: 1501,
        color: "Black",
        images: [floorLamp],
        price: 7990,
        stock: 10,
      },
      {
        id: 1502,
        color: "White",
        images: [floorLamp],
        price: 7990,
        stock: 8,
      },
    ],
  },

  // ============================================================
  // 16 — LUNA SOFA
  // ============================================================

  {
    id: 16,

    name: "Luna Sofa",

    slug: "luna-sofa-3",

    price: 29990,

    image: sofa,

    category: "Furniture",

    subcategory: "Sofas",

    room: "Living Room",

    material: "Fabric",

    colors: ["Beige", "Brown", "Grey"],

    rating: 4.9,

    reviews: 245,

    description:
      "A comfortable contemporary sofa with a refined silhouette for modern living.",

    stock: 10,

    variants: [
      {
        id: 1601,
        color: "Beige",
        images: [sofa],
        price: 29990,
        stock: 4,
      },
      {
        id: 1602,
        color: "Brown",
        images: [sofa],
        price: 29990,
        stock: 3,
      },
      {
        id: 1603,
        color: "Grey",
        images: [sofa],
        price: 29990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 17 — LOMALS STORAGE CABINET
  // ============================================================

  {
    id: 17,

    name: "Lomals Storage Cabinet",

    slug: "lomals-storage-cabinet-3",

    price: 21990,

    image: storageCabinet,

    category: "Storage",

    subcategory: "Storage",

    room: "Living Room",

    material: "Engineered Wood",

    colors: ["Brown", "Beige"],

    rating: 4.5,

    reviews: 84,

    description:
      "Elegant concealed storage designed to keep your living space organized.",

    stock: 7,

    variants: [
      {
        id: 1701,
        color: "Brown",
        images: [storageCabinet],
        price: 21990,
        stock: 4,
      },
      {
        id: 1702,
        color: "Beige",
        images: [storageCabinet],
        price: 21990,
        stock: 3,
      },
    ],
  },

  // ============================================================
  // 18 — LINEA TV UNIT
  // ============================================================

  {
    id: 18,

    name: "Linea TV Unit",

    slug: "linea-tv-unit-3",

    price: 19990,

    image: tvUnit,

    category: "Furniture",

    subcategory: "Storage",

    room: "Living Room",

    material: "Engineered Wood",

    colors: ["Brown", "Black"],

    rating: 4.7,

    reviews: 112,

    description:
      "A clean-lined TV unit combining practical storage with understated design.",

    stock: 9,

    variants: [
      {
        id: 1801,
        color: "Brown",
        images: [tvUnit],
        price: 19990,
        stock: 5,
      },
      {
        id: 1802,
        color: "Black",
        images: [tvUnit],
        price: 19990,
        stock: 4,
      },
    ],
  },
];