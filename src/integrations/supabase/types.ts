export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          created_at: string | null
          file_name: string | null
          id: string
          note: string | null
          page_url: string
          response: Json
          score: number | null
          status: Database["public"]["Enums"]["analysis_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          id?: string
          note?: string | null
          page_url: string
          response: Json
          score?: number | null
          status?: Database["public"]["Enums"]["analysis_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          id?: string
          note?: string | null
          page_url?: string
          response?: Json
          score?: number | null
          status?: Database["public"]["Enums"]["analysis_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      samy_copy_history: {
        Row: {
          created_at: string
          file_name: string | null
          id: string
          page_url: string
          response: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          id?: string
          page_url: string
          response: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string | null
          id?: string
          page_url?: string
          response?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          categoria: string | null
          coluna: number | null
          complexidade: number
          complexidade_norm: number | null
          created_at: string | null
          id: string
          impacto: number
          impacto_norm: number | null
          linha: number | null
          prioridade: number | null
          risco: number
          risco_norm: number | null
          task_link: string | null
          titulo: string
          updated_at: string | null
          urgencia: number
          urgencia_norm: number | null
        }
        Insert: {
          categoria?: string | null
          coluna?: number | null
          complexidade: number
          complexidade_norm?: number | null
          created_at?: string | null
          id?: string
          impacto: number
          impacto_norm?: number | null
          linha?: number | null
          prioridade?: number | null
          risco: number
          risco_norm?: number | null
          task_link?: string | null
          titulo: string
          updated_at?: string | null
          urgencia: number
          urgencia_norm?: number | null
        }
        Update: {
          categoria?: string | null
          coluna?: number | null
          complexidade?: number
          complexidade_norm?: number | null
          created_at?: string | null
          id?: string
          impacto?: number
          impacto_norm?: number | null
          linha?: number | null
          prioridade?: number | null
          risco?: number
          risco_norm?: number | null
          task_link?: string | null
          titulo?: string
          updated_at?: string | null
          urgencia?: number
          urgencia_norm?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_posicao_matriz: { Args: { pontuacao: number }; Returns: number }
      calculate_priority: {
        Args: {
          p_complexidade_norm: number
          p_impacto_norm: number
          p_risco_norm: number
          p_urgencia_norm: number
        }
        Returns: number
      }
      determine_category: {
        Args: { p_impacto_norm: number; p_urgencia_norm: number }
        Returns: Database["public"]["Enums"]["task_category"]
      }
      normalize_score: { Args: { score: number }; Returns: number }
    }
    Enums: {
      analysis_status: "draft" | "ready" | "archived"
      task_category: "fazer_agora" | "agendar" | "delegar" | "eliminar"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      analysis_status: ["draft", "ready", "archived"],
      task_category: ["fazer_agora", "agendar", "delegar", "eliminar"],
    },
  },
} as const
