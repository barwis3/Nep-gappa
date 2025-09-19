'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  orderId: string;
  sender: 'USER' | 'ADMIN';
  body: string;
  createdAt: string;
}

interface Props {
  orderId: string;
  userRole?: 'USER' | 'ADMIN';
}

export default function ChatBox({ orderId, userRole = 'USER' }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const order = await response.json();
        setMessages(order.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          sender: userRole,
          body: newMessage.trim()
        }),
      });

      if (response.ok) {
        setNewMessage('');
        // Immediately fetch messages to update the list
        fetchMessages();
      } else {
        const error = await response.json();
        alert(error.error || 'Nie udało się wysłać wiadomości');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Nie udało się wysłać wiadomości');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-96">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Czat z obsługą</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Brak wiadomości. Rozpocznij rozmowę!
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === userRole ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.sender === userRole
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm">
                  {message.body}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === userRole
                      ? 'text-brand-100'
                      : 'text-gray-500'
                  }`}
                >
                  {message.sender === 'ADMIN' ? 'Obsługa' : 'Ty'} · {formatDate(message.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            maxLength={500}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Wyślij'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}