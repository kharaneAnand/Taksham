export interface WishlistApiItem {
  productId: string;
  addedAt: string;
}

export interface WishlistApiResponse {
  _id: string;
  userId: string;
  items: WishlistApiItem[];
  createdAt: string;
  updatedAt: string;
}