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
      keyword_task_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          storage_path: string
          task_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          storage_path: string
          task_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          storage_path?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "keyword_task_files_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "keyword_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_tasks: {
        Row: {
          created_at: string
          error_msg: string | null
          id: string
          progress: number | null
          result_url: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_msg?: string | null
          id?: string
          progress?: number | null
          result_url?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_msg?: string | null
          id?: string
          progress?: number | null
          result_url?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          input_type: string
          title: string
          webhook_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          input_type: string
          title: string
          webhook_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          input_type?: string
          title?: string
          webhook_url?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          input_text: string | null
          service_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          input_text?: string | null
          service_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          input_text?: string | null
          service_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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

// 关键词文件类型
export type KeywordFileType = 
  | "h10_main"
  | "self_asin"
  | "competitor_aba"
  | "competitor_1"
  | "competitor_2"
  | "competitor_3"
  | "competitor_4"
  | "competitor_5"
  | "competitor_6"
  | "competitor_7"
  | "competitor_8"
  | "competitor_9"
  | "competitor_10"
  | "keyword_base";

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type KeywordTask = Database["public"]["Tables"]["keyword_tasks"]["Row"];
export type KeywordTaskFile = Database["public"]["Tables"]["keyword_task_files"]["Row"];
