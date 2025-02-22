export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SHOPKEEPER';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  shopkeeperId: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  orderDate: string | number | Date;
  customerAddress: ReactNode;
  customerName: ReactNode;
  shopkeeperName: ReactNode;
  orderId: Key | null | undefined;
  id: string;
  userId: string;
  items: CartItem[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELIVERED';
  totalAmount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}