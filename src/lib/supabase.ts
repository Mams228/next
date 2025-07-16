import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  user_id: string;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  role: 'client' | 'freelancer';
  title?: string;
  description?: string;
  skills: string[];
  hourly_rate?: number;
  location?: string;
  website?: string;
  portfolio: any[];
  rating: number;
  completed_jobs: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  budget_type: 'fixed' | 'hourly';
  budget_amount: number;
  currency: string;
  skills: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  deadline?: string;
  created_at: string;
  updated_at: string;
  client?: Profile;
  applications?: Application[];
}

export interface Application {
  id: string;
  job_id: string;
  freelancer_id: string;
  proposal: string;
  bid_amount: number;
  estimated_duration?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  freelancer?: Profile;
  job?: Job;
}

export interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  file_url?: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface Payment {
  id: string;
  job_id: string;
  application_id: string;
  client_id: string;
  freelancer_id: string;
  amount: number;
  currency: string;
  qr_code_url?: string;
  payment_proof_url?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: Profile;
  freelancer?: Profile;
  job?: Job;
}