import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, User, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login first.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://skm-admin.onrender.com/api/contact', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized access. Please login again.');
        } else {
          setError(`Failed to fetch messages: ${response.status} ${response.statusText}`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchMessages}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Messages</h1>
          <p className="text-gray-600">
            {messages.length} message{messages.length !== 1 ? 's' : ''} received
          </p>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Messages Yet</h3>
            <p className="text-gray-500">Contact messages will appear here when received.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {/* Message Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(message.name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{message.name}</h3>
                        <p className="text-blue-600 font-medium">{message.subject}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(message.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{message.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{message.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">Message:</h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchMessages}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;