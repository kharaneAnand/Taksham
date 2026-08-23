/*
 * ========================================
 * Customer Types
 * ========================================
 */

export type CustomerSort =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc";

export type CustomerVerificationFilter =
  | "all"
  | "verified"
  | "unverified";

export interface CustomerAvatar {
  url: string;
  publicId: string;
}

export interface Customer {
  _id: string;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  avatar: CustomerAvatar;

  role: "customer";

  isVerified: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface CustomerPagination {
  page: number;

  limit: number;

  totalCustomers: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

export interface AdminCustomersResponse {
  customers: Customer[];

  pagination: CustomerPagination;
}