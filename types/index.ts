export type Role = "super_admin" | "admin" | "user";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // virtual: firstName + " " + lastName
  role: Role;
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: Category;
  inStock: boolean;
  weight: string;
  ingredients?: string;
  shelfLife?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Feedback {
  id: string;
  user: User;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paid: boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  address: Address;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Banner {
  id: string;
  message: string;
  link?: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  initial: string;
  active: boolean;
  order: number;
}
