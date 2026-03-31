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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      billing_catalogo_sat: {
        Row: {
          activo: boolean
          clave: string
          descripcion: string
          id: string
          tipo: string
        }
        Insert: {
          activo?: boolean
          clave: string
          descripcion: string
          id?: string
          tipo: string
        }
        Update: {
          activo?: boolean
          clave?: string
          descripcion?: string
          id?: string
          tipo?: string
        }
        Relationships: []
      }
      billing_cfdi_eventos: {
        Row: {
          created_at: string
          descripcion: string | null
          evento: string
          factura_id: string
          id: string
          payload_response: Json | null
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          evento: string
          factura_id: string
          id?: string
          payload_response?: Json | null
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          evento?: string
          factura_id?: string
          id?: string
          payload_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_cfdi_eventos_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "billing_facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_conceptos: {
        Row: {
          activo: boolean
          clave_prod_serv: string
          clave_unidad: string
          created_at: string
          descripcion: string
          empresa_id: string
          id: string
          precio_unitario: number
          sku: string
          tasa_iva: number
        }
        Insert: {
          activo?: boolean
          clave_prod_serv: string
          clave_unidad?: string
          created_at?: string
          descripcion: string
          empresa_id: string
          id?: string
          precio_unitario: number
          sku: string
          tasa_iva?: number
        }
        Update: {
          activo?: boolean
          clave_prod_serv?: string
          clave_unidad?: string
          created_at?: string
          descripcion?: string
          empresa_id?: string
          id?: string
          precio_unitario?: number
          sku?: string
          tasa_iva?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_conceptos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "billing_empresas_emisoras"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_conceptos_factura: {
        Row: {
          cantidad: number
          clave_prod_serv: string
          clave_unidad: string
          concepto_id: string | null
          created_at: string
          descripcion: string
          factura_id: string
          id: string
          importe: number
          importe_iva: number
          precio_unitario: number
          tasa_iva: number
        }
        Insert: {
          cantidad?: number
          clave_prod_serv: string
          clave_unidad?: string
          concepto_id?: string | null
          created_at?: string
          descripcion: string
          factura_id: string
          id?: string
          importe: number
          importe_iva: number
          precio_unitario: number
          tasa_iva?: number
        }
        Update: {
          cantidad?: number
          clave_prod_serv?: string
          clave_unidad?: string
          concepto_id?: string | null
          created_at?: string
          descripcion?: string
          factura_id?: string
          id?: string
          importe?: number
          importe_iva?: number
          precio_unitario?: number
          tasa_iva?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_conceptos_factura_concepto_id_fkey"
            columns: ["concepto_id"]
            isOneToOne: false
            referencedRelation: "billing_conceptos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_conceptos_factura_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "billing_facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_empresas_api_keys: {
        Row: {
          api_key: string
          empresa_id: string
          secret_key: string
          updated_at: string
        }
        Insert: {
          api_key: string
          empresa_id: string
          secret_key?: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          empresa_id?: string
          secret_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_empresas_api_keys_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "billing_empresas_emisoras"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_empresas_emisoras: {
        Row: {
          activo: boolean
          api_key: string | null
          cp_fiscal: string
          created_at: string
          csd_numero_certificado: string | null
          csd_vigencia_fin: string | null
          csd_vigencia_inicio: string | null
          id: string
          razon_social: string
          regimen_fiscal: string
          rfc: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          api_key?: string | null
          cp_fiscal: string
          created_at?: string
          csd_numero_certificado?: string | null
          csd_vigencia_fin?: string | null
          csd_vigencia_inicio?: string | null
          id?: string
          razon_social: string
          regimen_fiscal: string
          rfc: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          api_key?: string | null
          cp_fiscal?: string
          created_at?: string
          csd_numero_certificado?: string | null
          csd_vigencia_fin?: string | null
          csd_vigencia_inicio?: string | null
          id?: string
          razon_social?: string
          regimen_fiscal?: string
          rfc?: string
          updated_at?: string
        }
        Relationships: []
      }
      billing_facturas: {
        Row: {
          created_at: string
          empresa_id: string
          fecha_emision: string
          folio: string | null
          forma_pago: string
          id: string
          iva: number
          metodo_pago: string
          moneda: string
          monto_pagado_acumulado: number
          notas_internas: string | null
          pdf_storage_path: string | null
          receptor_id: string
          saldo_insoluto: number | null
          serie: string
          serie_id: string | null
          status: string
          status_pago: string
          subtotal: number
          telegram_chat_id: string | null
          tipo_cambio: number | null
          total: number
          uid_facturacom: string | null
          updated_at: string
          uuid: string | null
          xml_storage_path: string | null
        }
        Insert: {
          created_at?: string
          empresa_id: string
          fecha_emision?: string
          folio?: string | null
          forma_pago: string
          id?: string
          iva: number
          metodo_pago: string
          moneda?: string
          monto_pagado_acumulado?: number
          notas_internas?: string | null
          pdf_storage_path?: string | null
          receptor_id: string
          saldo_insoluto?: number | null
          serie: string
          serie_id?: string | null
          status?: string
          status_pago?: string
          subtotal: number
          telegram_chat_id?: string | null
          tipo_cambio?: number | null
          total: number
          uid_facturacom?: string | null
          updated_at?: string
          uuid?: string | null
          xml_storage_path?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: string
          fecha_emision?: string
          folio?: string | null
          forma_pago?: string
          id?: string
          iva?: number
          metodo_pago?: string
          moneda?: string
          monto_pagado_acumulado?: number
          notas_internas?: string | null
          pdf_storage_path?: string | null
          receptor_id?: string
          saldo_insoluto?: number | null
          serie?: string
          serie_id?: string | null
          status?: string
          status_pago?: string
          subtotal?: number
          telegram_chat_id?: string | null
          tipo_cambio?: number | null
          total?: number
          uid_facturacom?: string | null
          updated_at?: string
          uuid?: string | null
          xml_storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_facturas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "billing_empresas_emisoras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_facturas_receptor_id_fkey"
            columns: ["receptor_id"]
            isOneToOne: false
            referencedRelation: "billing_receptores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_facturas_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "billing_series_emisoras"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_pagos: {
        Row: {
          created_at: string
          factura_id: string
          fecha_pago: string
          forma_pago: string
          id: string
          monto: number
          num_parcialidad: number
          referencia: string | null
          saldo_anterior: number
          saldo_insoluto: number
          status: string
          url_pdf_rep: string | null
          url_xml_rep: string | null
          uuid_sat_rep: string | null
        }
        Insert: {
          created_at?: string
          factura_id: string
          fecha_pago: string
          forma_pago: string
          id?: string
          monto: number
          num_parcialidad?: number
          referencia?: string | null
          saldo_anterior: number
          saldo_insoluto: number
          status?: string
          url_pdf_rep?: string | null
          url_xml_rep?: string | null
          uuid_sat_rep?: string | null
        }
        Update: {
          created_at?: string
          factura_id?: string
          fecha_pago?: string
          forma_pago?: string
          id?: string
          monto?: number
          num_parcialidad?: number
          referencia?: string | null
          saldo_anterior?: number
          saldo_insoluto?: number
          status?: string
          url_pdf_rep?: string | null
          url_xml_rep?: string | null
          uuid_sat_rep?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_pagos_factura_id_fkey"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "billing_facturas"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_receptores: {
        Row: {
          activo: boolean
          cp_fiscal: string
          created_at: string
          email: string
          id: string
          razon_social: string
          regimen_fiscal: string
          rfc: string
          uid_facturacom: string | null
          updated_at: string
          uso_cfdi: string
        }
        Insert: {
          activo?: boolean
          cp_fiscal: string
          created_at?: string
          email: string
          id?: string
          razon_social: string
          regimen_fiscal: string
          rfc: string
          uid_facturacom?: string | null
          updated_at?: string
          uso_cfdi?: string
        }
        Update: {
          activo?: boolean
          cp_fiscal?: string
          created_at?: string
          email?: string
          id?: string
          razon_social?: string
          regimen_fiscal?: string
          rfc?: string
          uid_facturacom?: string | null
          updated_at?: string
          uso_cfdi?: string
        }
        Relationships: []
      }
      billing_series_emisoras: {
        Row: {
          activa: boolean
          created_at: string
          descripcion: string | null
          empresa_id: string
          es_default: boolean
          id: string
          serie: string
          tipo: string | null
          uid_facturacom: number | null
        }
        Insert: {
          activa?: boolean
          created_at?: string
          descripcion?: string | null
          empresa_id: string
          es_default?: boolean
          id?: string
          serie: string
          tipo?: string | null
          uid_facturacom?: number | null
        }
        Update: {
          activa?: boolean
          created_at?: string
          descripcion?: string | null
          empresa_id?: string
          es_default?: boolean
          id?: string
          serie?: string
          tipo?: string | null
          uid_facturacom?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_series_emisoras_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "billing_empresas_emisoras"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
