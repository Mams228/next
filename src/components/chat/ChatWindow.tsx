import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Paperclip } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { ChatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import type { Message, Profile } from '../../lib/supabase';

interface ChatWindowProps {
  jobId: string;
  otherUser: Profile;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ jobId, otherUser, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    markAsRead();

    // Subscribe to new messages
    const subscription = ChatService.subscribeToMessages(jobId, (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [jobId]);

  const loadMessages = async () => {
    try {
      const data = await ChatService.getJobMessages(jobId);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (user?.id) {
      try {
        await ChatService.markMessagesAsRead(jobId, user.id);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;

    try {
      await ChatService.sendMessage({
        job_id: jobId,
        sender_id: user.id,
        receiver_id: otherUser.id,
        content: newMessage.trim(),
        message_type: 'text'
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center">
        <button onClick={onBack} className="mr-3 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar src={otherUser.photo_url} name={otherUser.first_name} size="sm" />
        <div className="ml-3">
          <h3 className="font-medium text-gray-800">{otherUser.first_name} {otherUser.last_name}</h3>
          <p className="text-xs text-gray-500">{otherUser.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => {
          const isOwn = message.sender_id === user?.id;
          return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                isOwn 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};