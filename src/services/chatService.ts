import { supabase } from '../lib/supabase';
import type { Message } from '../lib/supabase';

export class ChatService {
  // Get messages for a job
  static async getJobMessages(jobId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        receiver:profiles!messages_receiver_id_fkey(*)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Message[];
  }

  // Send message
  static async sendMessage(messageData: {
    job_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type?: 'text' | 'image' | 'file';
    file_url?: string;
  }) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        receiver:profiles!messages_receiver_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data as Message;
  }

  // Mark messages as read
  static async markMessagesAsRead(jobId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('job_id', jobId)
      .eq('receiver_id', userId);

    if (error) throw error;
  }

  // Get unread message count
  static async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }

  // Subscribe to new messages
  static subscribeToMessages(jobId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`messages:${jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }
}