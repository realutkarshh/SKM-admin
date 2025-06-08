import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Eye, EyeOff, Save, X } from 'lucide-react';

const NewsAndNotifications = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const BASE_URL = 'https://skm-admin.onrender.com/api';

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch all news
  const fetchNews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/news/admin`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      } else {
        console.error('Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new news
  const createNews = async () => {
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch(`${BASE_URL}/news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setNews([result.news, ...news]);
        resetForm();
        setShowCreateForm(false);
      } else {
        console.error('Failed to create news');
      }
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  // Update news
  const updateNews = async (id, updateData) => {
    try {
      const response = await fetch(`${BASE_URL}/news/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedNews = await response.json();
        setNews(news.map(item => item._id === id ? updatedNews : item));
      } else {
        console.error('Failed to update news');
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  // Delete news
  const deleteNews = async (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        const response = await fetch(`${BASE_URL}/news/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });

        if (response.ok) {
          setNews(news.filter(item => item._id !== id));
        } else {
          console.error('Failed to delete news');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  // Toggle visibility
  const toggleVisibility = async (id, currentVisibility) => {
    await updateNews(id, { visible: !currentVisibility });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setEditingNews(null);
  };

  // Start editing
  const startEdit = (newsItem) => {
    setEditingNews(newsItem._id);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      image: null
    });
    setImagePreview(null);
  };

  // Save edit
  const saveEdit = async () => {
    await updateNews(editingNews, {
      title: formData.title,
      description: formData.description
    });
    resetForm();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">News & Notifications</h1>
              <p className="text-gray-600 mt-1">Manage college news and announcements</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add News
            </button>
          </div>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New News</h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={createNews}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Create News
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((newsItem) => (
            <div key={newsItem._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Image */}
              {newsItem.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {editingNews === newsItem._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-2 py-1 border rounded text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-sm flex items-center justify-center gap-1"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </button>
                      <button
                        onClick={resetForm}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-2 rounded text-sm flex items-center justify-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {newsItem.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {newsItem.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(newsItem.date)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleVisibility(newsItem._id, newsItem.visible)}
                        className={`flex-1 py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors ${
                          newsItem.visible
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {newsItem.visible ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Hidden
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => startEdit(newsItem)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-3 rounded text-sm flex items-center gap-1 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => deleteNews(newsItem._id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 py-2 px-3 rounded text-sm flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {news.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No News Available</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first news article.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create First News
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsAndNotifications;