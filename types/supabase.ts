export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'seller' | 'buyer';
          full_name?: string;
          phone?: string;
          company_name?: string;
          company_address?: string;
          country?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'admin' | 'seller' | 'buyer';
          full_name?: string;
          phone?: string;
          company_name?: string;
          company_address?: string;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'seller' | 'buyer';
          full_name?: string;
          phone?: string;
          company_name?: string;
          company_address?: string;
          country?: string;
          updated_at?: string;
        };
      };
      shops: {
        Row: {
          id: string;
          name: string;
          description?: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          owner_id?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description?: string;
          price: number;
          currency: string;
          shop_id: string;
          image_url?: string;
          stock_quantity?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price: number;
          currency: string;
          shop_id: string;
          image_url?: string;
          stock_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          currency?: string;
          shop_id?: string;
          image_url?: string;
          stock_quantity?: number;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          total_amount: number;
          currency: string;
          status: string;
          shipping_address?: string;
          payment_method?: string;
          payment_status?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          seller_id: string;
          total_amount: number;
          currency: string;
          status?: string;
          shipping_address?: string;
          payment_method?: string;
          payment_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          seller_id?: string;
          total_amount?: number;
          currency?: string;
          status?: string;
          shipping_address?: string;
          payment_method?: string;
          payment_status?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          order_id?: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          order_id?: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          order_id?: string;
          content?: string;
          is_read?: boolean;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          buyer_id: string;
          amount: number;
          currency: string;
          provider: 'stripe' | 'mobile_money' | 'bank_transfer';
          status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
          transaction_id?: string;
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          buyer_id: string;
          amount: number;
          currency?: string;
          provider: 'stripe' | 'mobile_money' | 'bank_transfer';
          status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
          transaction_id?: string;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          buyer_id?: string;
          amount?: number;
          currency?: string;
          provider?: 'stripe' | 'mobile_money' | 'bank_transfer';
          status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
          transaction_id?: string;
          metadata?: Record<string, any>;
          updated_at?: string;
        };
      };
    };
  };
};

