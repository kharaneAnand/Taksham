export interface OrderItem {
  productId: string;

  productName: string;

  productImage: string;

  variantId?: string;

  variant?: {
    color?: string;

    material?: string;

    image?: string;
  };

  quantity: number;

  price: number;

  subtotal: number;
}

export interface ShippingAddress {
  firstName: string;

  lastName: string;

  phone: string;

  address: string;

  city: string;

  state: string;

  pincode: string;

  landmark?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod =
  | "cod"
  | "online";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type ShippingMethod =
  | "standard"
  | "express";

export interface Order {
  _id: string;

  userId: string;

  orderNumber: string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  shippingMethod: ShippingMethod;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  /*
   * ----------------------------------------
   * Razorpay Payment Details
   * ----------------------------------------
   */

  razorpayOrderId?: string;

  razorpayPaymentId?: string;

  razorpaySignature?: string;

  /*
   * ----------------------------------------
   * Order Status
   * ----------------------------------------
   */

  orderStatus: OrderStatus;

  /*
   * ----------------------------------------
   * Pricing
   * ----------------------------------------
   */

  subtotal: number;

  shippingCost: number;

  couponCode?: string;

  discountAmount: number;

  total: number;

  createdAt: string;

  updatedAt: string;
}

/*
 * ========================================
 * Create Order Input
 * ========================================
 */

export interface CreateOrderInput {
  shippingAddress: ShippingAddress;

  shippingMethod: ShippingMethod;

  paymentMethod: PaymentMethod;

  couponCode?: string;
}

/*
 * ========================================
 * Razorpay Create Payment Order Response
 * ========================================
 */

export interface CreatePaymentOrderResponse {
  razorpayOrderId: string;

  amount: number;

  currency: string;
}

/*
 * ========================================
 * Verify Razorpay Payment Input
 * ========================================
 */

export interface VerifyPaymentInput {
  orderId: string;

  razorpayPaymentId: string;

  razorpayOrderId: string;

  razorpaySignature: string;
}