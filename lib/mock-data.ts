import { User } from '@/services/auth.service';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  createdAt: string;
};

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'VALIDATED'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderStatusHistory = {
  status: OrderStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
};

export type Order = {
  id: string;
  buyerId: string;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    sellerId: string;
  }>;
  total: number;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
};

export type Commission = {
  id: string;
  orderId: string;
  sellerId: string;
  productId: string;
  productName: string;
  quantity: number;
  productTotal: number;
  commissionRate: number;
  commissionAmount: number;
  sellerRevenue: number;
  createdAt: string;
};

// Mock database en mémoire
const mockUsers: User[] = [
  { id: '1', email: 'admin@shamar.com', role: 'admin' },
  { id: '2', email: 'seller@shamar.com', role: 'seller' },
  { id: '3', email: 'buyer@shamar.com', role: 'buyer' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Produit Exemple 1',
    description: 'Description du produit exemple',
    price: 99.99,
    sellerId: '2',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Produit Exemple 2',
    description: 'Description du produit exemple 2',
    price: 149.99,
    sellerId: '2',
    createdAt: new Date().toISOString(),
  },
];

const PLATFORM_COMMISSION_RATE = 0.1; // 10%

const mockOrders: Order[] = [
  {
    id: '1',
    buyerId: '3',
    products: [
      {
        productId: '1',
        name: 'Produit Exemple 1',
        price: 99.99,
        quantity: 2,
        sellerId: '2',
      },
    ],
    total: 199.98,
    status: 'PENDING',
    statusHistory: [
      {
        status: 'PENDING',
        changedAt: new Date().toISOString(),
        changedBy: '3',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockCommissions: Commission[] = [];

// Users CRUD
export const usersDB = {
  getAll: (): User[] => [...mockUsers],
  getById: (id: string): User | undefined => mockUsers.find((u) => u.id === id),
  getByRole: (role: 'admin' | 'seller' | 'buyer'): User[] =>
    mockUsers.filter((u) => u.role === role),
  delete: (id: string): boolean => {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) return false;
    mockUsers.splice(index, 1);
    return true;
  },
};

// Products CRUD
export const productsDB = {
  getAll: (): Product[] => [...mockProducts],
  getById: (id: string): Product | undefined =>
    mockProducts.find((p) => p.id === id),
  getBySellerId: (sellerId: string): Product[] =>
    mockProducts.filter((p) => p.sellerId === sellerId),
  create: (product: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...product,
      id: String(mockProducts.length + 1),
      createdAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return newProduct;
  },
  update: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null => {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    mockProducts[index] = { ...mockProducts[index], ...updates };
    return mockProducts[index];
  },
  delete: (id: string): boolean => {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    mockProducts.splice(index, 1);
    return true;
  },
};

// Orders CRUD
export const ordersDB = {
  getAll: (): Order[] => [...mockOrders],
  getById: (id: string): Order | undefined =>
    mockOrders.find((o) => o.id === id),
  getByBuyerId: (buyerId: string): Order[] =>
    mockOrders.filter((o) => o.buyerId === buyerId),
  getBySellerId: (sellerId: string): Order[] =>
    mockOrders.filter((o) =>
      o.products.some((p) => p.sellerId === sellerId)
    ),
  create: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...order,
      id: String(mockOrders.length + 1),
      status: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          changedAt: now,
          changedBy: order.buyerId,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    mockOrders.push(newOrder);
    return newOrder;
  },
  updateStatus: (
    id: string,
    newStatus: OrderStatus,
    changedBy: string,
    note?: string
  ): Order | null => {
    const order = mockOrders.find((o) => o.id === id);
    if (!order) return null;

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: newStatus,
      changedAt: new Date().toISOString(),
      changedBy,
      note,
    });

    // Créer les commissions si la commande est validée
    if (newStatus === 'VALIDATED') {
      order.products.forEach((product) => {
        const productTotal = product.price * product.quantity;
        const commissionAmount = productTotal * PLATFORM_COMMISSION_RATE;
        const sellerRevenue = productTotal - commissionAmount;

        const commission: Commission = {
          id: String(mockCommissions.length + 1),
          orderId: order.id,
          sellerId: product.sellerId,
          productId: product.productId,
          productName: product.name,
          quantity: product.quantity,
          productTotal,
          commissionRate: PLATFORM_COMMISSION_RATE,
          commissionAmount,
          sellerRevenue,
          createdAt: new Date().toISOString(),
        };

        mockCommissions.push(commission);
      });
    }

    return order;
  },
};

// Commissions CRUD
export const commissionsDB = {
  getAll: (): Commission[] => [...mockCommissions],
  getById: (id: string): Commission | undefined =>
    mockCommissions.find((c) => c.id === id),
  getBySellerId: (sellerId: string): Commission[] =>
    mockCommissions.filter((c) => c.sellerId === sellerId),
  getByOrderId: (orderId: string): Commission[] =>
    mockCommissions.filter((c) => c.orderId === orderId),
  getTotalBySellerId: (sellerId: string): number => {
    return mockCommissions
      .filter((c) => c.sellerId === sellerId)
      .reduce((sum, c) => sum + c.sellerRevenue, 0);
  },
  getTotalCommissions: (): number => {
    return mockCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  },
};

export { PLATFORM_COMMISSION_RATE };

