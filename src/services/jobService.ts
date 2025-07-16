import { supabase } from '../lib/supabase';
import type { Job, Application, Profile } from '../lib/supabase';

export class JobService {
  // Get all jobs with client info
  static async getJobs(filters?: {
    category?: string;
    search?: string;
    status?: string;
  }) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        client:profiles!jobs_client_id_fkey(*),
        applications(count)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.category && filters.category !== 'All Categories') {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Job[];
  }

  // Get jobs by client
  static async getJobsByClient(clientId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        applications(
          *,
          freelancer:profiles!applications_freelancer_id_fkey(*)
        )
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Job[];
  }

  // Create new job
  static async createJob(jobData: {
    client_id: string;
    title: string;
    description: string;
    category: string;
    budget_type: 'fixed' | 'hourly';
    budget_amount: number;
    skills: string[];
    deadline?: string;
  }) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  }

  // Update job
  static async updateJob(jobId: string, updates: Partial<Job>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data as Job;
  }

  // Apply to job
  static async applyToJob(applicationData: {
    job_id: string;
    freelancer_id: string;
    proposal: string;
    bid_amount: number;
    estimated_duration?: string;
  }) {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select(`
        *,
        job:jobs(*),
        freelancer:profiles!applications_freelancer_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data as Application;
  }

  // Get applications by freelancer
  static async getApplicationsByFreelancer(freelancerId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(
          *,
          client:profiles!jobs_client_id_fkey(*)
        )
      `)
      .eq('freelancer_id', freelancerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Application[];
  }

  // Update application status
  static async updateApplicationStatus(
    applicationId: string, 
    status: 'pending' | 'accepted' | 'rejected'
  ) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;

    // If accepted, update job status to in_progress
    if (status === 'accepted' && data) {
      await supabase
        .from('jobs')
        .update({ status: 'in_progress' })
        .eq('id', data.job_id);
    }

    return data as Application;
  }
}