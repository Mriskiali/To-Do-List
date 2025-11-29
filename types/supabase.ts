export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: Database['public']['Enums']['Status'];
          priority: Database['public']['Enums']['Priority'];
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: Database['public']['Enums']['Status'];
          priority: Database['public']['Enums']['Priority'];
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: Database['public']['Enums']['Status'];
          priority?: Database['public']['Enums']['Priority'];
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      Status: 'TODO' | 'IN_PROGRESS' | 'DONE';
      Priority: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}