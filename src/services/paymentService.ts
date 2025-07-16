import { supabase } from '../lib/supabase';
import type { Payment } from '../lib/supabase';

export class PaymentService {
  // Create payment record
  static async createPayment(paymentData: {
    job_id: string;
    application_id: string;
    client_id: string;
    freelancer_id: string;
    amount: number;
    currency?: string;
  }) {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select(`
        *,
        client:profiles!payments_client_id_fkey(*),
        freelancer:profiles!payments_freelancer_id_fkey(*),
        job:jobs(*)
      `)
      .single();

    if (error) throw error;
    return data as Payment;
  }

  // Upload QR code for payment
  static async uploadQRCode(file: File, paymentId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `qr-codes/${paymentId}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('payments')
      .getPublicUrl(fileName);

    // Update payment record with QR code URL
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        qr_code_url: publicUrl,
        status: 'uploaded'
      })
      .eq('id', paymentId)
      .select(`
        *,
        client:profiles!payments_client_id_fkey(*),
        freelancer:profiles!payments_freelancer_id_fkey(*),
        job:jobs(*)
      `)
      .single();

    if (error) throw error;
    return data as Payment;
  }

  // Upload payment proof
  static async uploadPaymentProof(file: File, paymentId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `payment-proofs/${paymentId}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('payments')
      .getPublicUrl(fileName);

    // Update payment record
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        payment_proof_url: publicUrl,
        status: 'verified'
      })
      .eq('id', paymentId)
      .select(`
        *,
        client:profiles!payments_client_id_fkey(*),
        freelancer:profiles!payments_freelancer_id_fkey(*),
        job:jobs(*)
      `)
      .single();

    if (error) throw error;
    return data as Payment;
  }

  // Get payments by user
  static async getPaymentsByUser(userId: string, role: 'client' | 'freelancer') {
    const column = role === 'client' ? 'client_id' : 'freelancer_id';
    
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        client:profiles!payments_client_id_fkey(*),
        freelancer:profiles!payments_freelancer_id_fkey(*),
        job:jobs(*)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Payment[];
  }

  // Update payment status
  static async updatePaymentStatus(
    paymentId: string, 
    status: 'pending' | 'uploaded' | 'verified' | 'completed',
    notes?: string
  ) {
    const { data, error } = await supabase
      .from('payments')
      .update({ status, notes })
      .eq('id', paymentId)
      .select(`
        *,
        client:profiles!payments_client_id_fkey(*),
        freelancer:profiles!payments_freelancer_id_fkey(*),
        job:jobs(*)
      `)
      .single();

    if (error) throw error;
    return data as Payment;
  }
}