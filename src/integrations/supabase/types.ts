export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          created_at: string
          id: string
          metrics: Json
          recording_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics: Json
          recording_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json
          recording_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_notes: {
        Row: {
          anonymized_file_path: string | null
          content: Json
          created_at: string
          id: string
          recording_id: string | null
          status: string | null
          suggested_codes: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anonymized_file_path?: string | null
          content: Json
          created_at?: string
          id?: string
          recording_id?: string | null
          status?: string | null
          suggested_codes?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anonymized_file_path?: string | null
          content?: Json
          created_at?: string
          id?: string
          recording_id?: string | null
          status?: string | null
          suggested_codes?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_recording_id_fkey"
            columns: ["recording_id"]
            isOneToOne: false
            referencedRelation: "recordings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          created_at: string
          id: string
          last_4: string | null
          paypal_order_id: string | null
          paypal_subscription_id: string | null
          square_payment_method_id: string | null
          stripe_payment_method_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          created_at?: string
          id?: string
          last_4?: string | null
          paypal_order_id?: string | null
          paypal_subscription_id?: string | null
          square_payment_method_id?: string | null
          stripe_payment_method_id?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          created_at?: string
          id?: string
          last_4?: string | null
          paypal_order_id?: string | null
          paypal_subscription_id?: string | null
          square_payment_method_id?: string | null
          stripe_payment_method_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      procedure_codes: {
        Row: {
          code: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          has_used_trial: boolean | null
          id: string
          purchase_date: string | null
          refund_request_date: string | null
          refund_requested: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          has_used_trial?: boolean | null
          id: string
          purchase_date?: string | null
          refund_request_date?: string | null
          refund_requested?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          has_used_trial?: boolean | null
          id?: string
          purchase_date?: string | null
          refund_request_date?: string | null
          refund_requested?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      recordings: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          times_used: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          times_used?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          times_used?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_invites: {
        Row: {
          code: string
          created_at: string
          email: string
          id: string
          referrer_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          id?: string
          referrer_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          id?: string
          referrer_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          discount_applied: boolean | null
          discount_percentage: number | null
          id: string
          referred_id: string
          referrer_id: string
          status: string
          subscription_duration: unknown | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_applied?: boolean | null
          discount_percentage?: number | null
          id?: string
          referred_id: string
          referrer_id: string
          status?: string
          subscription_duration?: unknown | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_applied?: boolean | null
          discount_percentage?: number | null
          id?: string
          referred_id?: string
          referrer_id?: string
          status?: string
          subscription_duration?: unknown | null
          updated_at?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          name: string
          paypal_plan_id: string | null
          price: number
          square_plan_id: string | null
          stripe_price_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          transcription_limit: number | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          features: Json
          id?: string
          name: string
          paypal_plan_id?: string | null
          price: number
          square_plan_id?: string | null
          stripe_price_id?: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          transcription_limit?: number | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          name?: string
          paypal_plan_id?: string | null
          price?: number
          square_plan_id?: string | null
          stripe_price_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          transcription_limit?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          payment_method_id: string | null
          paypal_subscription_id: string | null
          plan_id: string
          square_subscription_id: string | null
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          payment_method_id?: string | null
          paypal_subscription_id?: string | null
          plan_id: string
          square_subscription_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          payment_method_id?: string | null
          paypal_subscription_id?: string | null
          plan_id?: string
          square_subscription_id?: string | null
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_features: {
        Row: {
          features: Json | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
          tier_level: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_feature: {
        Args: { user_id: string; feature_name: string }
        Returns: boolean
      }
    }
    Enums: {
      subscription_tier:
        | "trial"
        | "basic"
        | "standard"
        | "professional"
        | "unlimited"
        | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_tier: [
        "trial",
        "basic",
        "standard",
        "professional",
        "unlimited",
        "enterprise",
      ],
    },
  },
} as const
