export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          webhook_url: string;
          input_type: "file" | "text" | "both";
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url?: string | null;
          webhook_url: string;
          input_type: "file" | "text" | "both";
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          webhook_url?: string;
          input_type?: "file" | "text" | "both";
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          input_text: string | null;
          file_url: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          input_text?: string | null;
          file_url?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string;
          input_text?: string | null;
          file_url?: string | null;
          status?: string | null;
          created_at?: string;
        };
      };
      keyword_tasks: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "processing" | "success" | "failed";
          progress: number;
          result_url: string | null;
          error_msg: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "processing" | "success" | "failed";
          progress?: number;
          result_url?: string | null;
          error_msg?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "pending" | "processing" | "success" | "failed";
          progress?: number;
          result_url?: string | null;
          error_msg?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      keyword_task_files: {
        Row: {
          id: string;
          task_id: string;
          file_type: KeywordFileType;
          file_name: string;
          storage_path: string;
          file_size: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          file_type: KeywordFileType;
          file_name: string;
          storage_path: string;
          file_size?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          file_type?: KeywordFileType;
          file_name?: string;
          storage_path?: string;
          file_size?: number | null;
          created_at?: string;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

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

