import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
} from "lucide-react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login first.");
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(
        `${baseUrl}/contact`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized access. Please login again.");
        } else {
          setError(
            `Failed to fetch messages: ${response.status} ${response.statusText}`
          );
        }
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
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
        <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={fetchMessages}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
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
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-600 mt-1">
              {messages.length} message{messages.length !== 1 ? "s" : ""} received
            </p>
          </div>
          <button
            onClick={fetchMessages}
            disabled={refreshing}
            className="bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center space-x-2 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Messages Yet
            </h3>
            <p className="text-gray-500 text-sm">
              Contact messages will appear here when received.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {messages.map((message, index) => (
              <div
                key={message._id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  index !== messages.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                    {getInitials(message.name)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {message.name}
                          </span>
                          <span className="text-blue-600 font-medium text-sm">
                            {message.subject}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{message.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{message.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 ml-4">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(message.submittedAt)}</span>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <p className="overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>{message.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;