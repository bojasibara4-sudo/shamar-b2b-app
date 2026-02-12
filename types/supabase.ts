export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'buyer' | 'seller' | 'admin' | 'super_admin' | 'vice_admin' | 'partner' | 'apple' | 'owner_root' | 'owner_exec' | 'admin_staff';
          full_name?: string;
          phone?: string;
          company_name?: string;
          company_address?: string;
          country?: string;
          city?: string;
          region?: string;
          kyc_status?: 'pending' | 'verified' | 'rejected';
          identity_verified?: boolean;
          face_verified?: boolean;
          business_verified?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'buyer' | 'seller' | 'admin' | 'super_admin' | 'vice_admin' | 'partner' | 'apple' | 'owner_root' | 'owner_exec' | 'admin_staff';
          full_name?: string;
          phone?: string;
          company_name?: string;
          company_address?: string;
          country?: string;
          city?: string;
          region?: string;
          kyc_status?: 'pending' | 'verified' | 'rejected';
          identity_verified?: boolean;
          face_verified?: boolean;
          business_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'buyer' | 'seller' | 'admin' | 'super_admin' | 'vice_admin' | 'partner' | 'apple' | 'owner_root' | 'owner_exec' | 'admin_staff';
          full_name?: string;
          phone?: string;
          company_name?: string;
          company_address?: string;
          country?: string;
          city?: string;
          region?: string;
          kyc_status?: 'pending' | 'verified' | 'rejected';
          identity_verified?: boolean;
          face_verified?: boolean;
          business_verified?: boolean;
          updated_at?: string;
        };
      };
      shops: {
        Row: {
          id: string;
          name: string;
          description?: string;
          vendor_id: string;
          country?: string;
          city?: string;
          region?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          vendor_id: string;
          country?: string;
          city?: string;
          region?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          vendor_id?: string;
          country?: string;
          city?: string;
          region?: string;
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
          seller_id: string;
          shop_id?: string;
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
          seller_id: string;
          shop_id?: string;
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
          seller_id?: string;
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
      escrows: {
        Row: {
          id: string;
          order_id: string;
          payment_id: string | null;
          buyer_id: string;
          seller_id: string;
          amount: number;
          currency: string;
          status: string;
          held_at: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          released_at: string | null;
          dispute_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          payment_id?: string | null;
          buyer_id: string;
          seller_id: string;
          amount: number;
          currency?: string;
          status?: string;
          held_at?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          released_at?: string | null;
          dispute_id?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_id?: string;
          payment_id?: string | null;
          buyer_id?: string;
          seller_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          held_at?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          released_at?: string | null;
          dispute_id?: string | null;
          metadata?: Record<string, unknown> | null;
          updated_at?: string;
        };
      };
      security_logs: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          severity: string;
          message: string;
          metadata: Record<string, unknown> | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          severity: string;
          message: string;
          metadata?: Record<string, unknown> | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
          event_type?: string;
          severity?: string;
          message?: string;
          metadata?: Record<string, unknown> | null;
          ip_address?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          buyer_id: string;
          vendor_id: string;
          amount_total: number;
          commission_amount: number;
          vendor_amount: number;
          currency: string;
          provider: 'stripe' | 'mobile_money' | 'bank_transfer';
          status: 'initiated' | 'paid' | 'failed' | 'refunded';
          provider_payment_id?: string;
          provider_session_id?: string;
          metadata?: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          buyer_id: string;
          vendor_id: string;
          amount_total: number;
          commission_amount: number;
          vendor_amount: number;
          currency?: string;
          provider: 'stripe' | 'mobile_money' | 'bank_transfer';
          status?: 'initiated' | 'paid' | 'failed' | 'refunded';
          provider_payment_id?: string;
          provider_session_id?: string;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_id?: string;
          buyer_id?: string;
          vendor_id?: string;
          amount_total?: number;
          commission_amount?: number;
          vendor_amount?: number;
          currency?: string;
          provider?: 'stripe' | 'mobile_money' | 'bank_transfer';
          status?: 'initiated' | 'paid' | 'failed' | 'refunded';
          provider_payment_id?: string;
          provider_session_id?: string;
          metadata?: Record<string, any>;
          updated_at?: string;
        };
      };
      host_properties: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          description: string | null;
          city: string;
          price_per_night: number;
          currency: string;
          rating: number;
          host_badge: 'bronze' | 'argent' | 'or' | 'diamant';
          images: string[];
          capacity: number;
          type: string;
          amenities: string[];
          rules: string | null;
          status: 'draft' | 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          host_id: string;
          title: string;
          description?: string | null;
          city: string;
          price_per_night: number;
          currency?: string;
          rating?: number;
          host_badge?: 'bronze' | 'argent' | 'or' | 'diamant';
          images?: string[];
          capacity?: number;
          type?: string;
          amenities?: string[];
          rules?: string | null;
          status?: 'draft' | 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          host_id?: string;
          title?: string;
          description?: string | null;
          city?: string;
          price_per_night?: number;
          currency?: string;
          rating?: number;
          host_badge?: 'bronze' | 'argent' | 'or' | 'diamant';
          images?: string[];
          capacity?: number;
          type?: string;
          amenities?: string[];
          rules?: string | null;
          status?: 'draft' | 'active' | 'inactive';
          updated_at?: string;
        };
      };
      host_bookings: {
        Row: {
          id: string;
          property_id: string;
          guest_id: string;
          host_id: string;
          check_in: string;
          check_out: string;
          guests_count: number;
          total_amount: number;
          currency: string;
          status: 'pending' | 'accepted' | 'rejected' | 'in_stay' | 'completed' | 'refunded' | 'cancelled';
          escrow_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          guest_id: string;
          host_id: string;
          check_in: string;
          check_out: string;
          guests_count?: number;
          total_amount: number;
          currency?: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'in_stay' | 'completed' | 'refunded' | 'cancelled';
          escrow_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          property_id?: string;
          guest_id?: string;
          host_id?: string;
          check_in?: string;
          check_out?: string;
          guests_count?: number;
          total_amount?: number;
          currency?: string;
          status?: 'pending' | 'accepted' | 'rejected' | 'in_stay' | 'completed' | 'refunded' | 'cancelled';
          escrow_id?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      host_reviews: {
        Row: {
          id: string;
          booking_id: string;
          property_id: string;
          guest_id: string;
          rating: number;
          comment: string | null;
          host_reply: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          property_id: string;
          guest_id: string;
          rating: number;
          comment?: string | null;
          host_reply?: string | null;
          created_at?: string;
        };
        Update: {
          booking_id?: string;
          property_id?: string;
          guest_id?: string;
          rating?: number;
          comment?: string | null;
          host_reply?: string | null;
        };
      };
      international_offers: {
        Row: {
          id: string;
          supplier_id: string;
          supplier_name: string;
          supplier_logo: string | null;
          country: string;
          country_code: string;
          product: string;
          product_category: string;
          moq: number;
          moq_unit: string;
          price_bulk: number;
          currency: string;
          incoterm: 'FOB' | 'CIF' | 'EXW';
          lead_time_days: number;
          certifications: string[];
          badge: 'gold' | 'verified' | '';
          description: string | null;
          specifications: Record<string, unknown>;
          status: 'draft' | 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          supplier_name: string;
          supplier_logo?: string | null;
          country: string;
          country_code?: string;
          product: string;
          product_category?: string;
          moq: number;
          moq_unit?: string;
          price_bulk: number;
          currency?: string;
          incoterm?: 'FOB' | 'CIF' | 'EXW';
          lead_time_days?: number;
          certifications?: string[];
          badge?: 'gold' | 'verified' | '';
          description?: string | null;
          specifications?: Record<string, unknown>;
          status?: 'draft' | 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          supplier_id?: string;
          supplier_name?: string;
          supplier_logo?: string | null;
          country?: string;
          country_code?: string;
          product?: string;
          product_category?: string;
          moq?: number;
          moq_unit?: string;
          price_bulk?: number;
          currency?: string;
          incoterm?: 'FOB' | 'CIF' | 'EXW';
          lead_time_days?: number;
          certifications?: string[];
          badge?: 'gold' | 'verified' | '';
          description?: string | null;
          specifications?: Record<string, unknown>;
          status?: 'draft' | 'active' | 'inactive';
          updated_at?: string;
        };
      };
      international_rfqs: {
        Row: {
          id: string;
          offer_id: string;
          buyer_id: string;
          quantity: number;
          port_destination: string | null;
          incoterm: string | null;
          specs: string | null;
          message: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          offer_id: string;
          buyer_id: string;
          quantity: number;
          port_destination?: string | null;
          incoterm?: string | null;
          specs?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          offer_id?: string;
          buyer_id?: string;
          quantity?: number;
          port_destination?: string | null;
          incoterm?: string | null;
          specs?: string | null;
          message?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      international_contracts: {
        Row: {
          id: string;
          offer_id: string;
          rfq_id: string | null;
          buyer_id: string;
          supplier_id: string;
          quantity: number;
          total_amount: number;
          currency: string;
          incoterm: string;
          status: string;
          signed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          offer_id: string;
          rfq_id?: string | null;
          buyer_id: string;
          supplier_id: string;
          quantity: number;
          total_amount: number;
          currency?: string;
          incoterm?: string;
          status?: string;
          signed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          offer_id?: string;
          rfq_id?: string | null;
          buyer_id?: string;
          supplier_id?: string;
          quantity?: number;
          total_amount?: number;
          currency?: string;
          incoterm?: string;
          status?: string;
          signed_at?: string | null;
          updated_at?: string;
        };
      };
      international_shipments: {
        Row: {
          id: string;
          contract_id: string;
          status: string;
          tracking_data: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          status?: string;
          tracking_data?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          contract_id?: string;
          status?: string;
          tracking_data?: Record<string, unknown>;
          updated_at?: string;
        };
      };
    };
  };
};

