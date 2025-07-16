import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/supabase';

export class ProfileService {
  // Create or update profile
  static async upsertProfile(profileData: {
    user_id: string;
    telegram_id: number;
    username?: string;
    first_name: string;
    last_name?: string;
    photo_url?: string;
    role: 'client' | 'freelancer';
    title?: string;
    description?: string;
    skills?: string[];
    hourly_rate?: number;
    location?: string;
    website?: string;
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profileData], { 
        onConflict: 'telegram_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Get profile by telegram ID
  static async getProfileByTelegramId(telegramId: number) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Profile | null;
  }

  // Get profile by ID
  static async getProfileById(profileId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Update profile
  static async updateProfile(profileId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  // Search freelancers
  static async searchFreelancers(filters?: {
    skills?: string[];
    minRating?: number;
    maxRate?: number;
    search?: string;
  }) {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'freelancer');

    if (filters?.skills && filters.skills.length > 0) {
      query = query.overlaps('skills', filters.skills);
    }

    if (filters?.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    if (filters?.maxRate) {
      query = query.lte('hourly_rate', filters.maxRate);
    }

    if (filters?.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) throw error;
    return data as Profile[];
  }
}