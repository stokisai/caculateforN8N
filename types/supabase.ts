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
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Service = Database["public"]["Tables"]["services"]["Row"];

