import { useEffect, useState } from "react";
import { Calendar, MessageCircle, Users, Newspaper, CheckCircle, XCircle, Clock, User, Mail, Phone } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState({
    admissions: 0,
    messages: 0,
    news: 0,
    bankAvailable: false,
  });

  const [recentData, setRecentData] = useState({
    recentMessage: null,
    recentAdmission: null,
    currentNews: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const [admissions, messages, news, bank] = await Promise.all([
          fetch(`${baseUrl}/admission`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),

          fetch(`${baseUrl}/contact`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),

          fetch(`${baseUrl}/news/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json()),

          fetch(`${baseUrl}/bank`).then((res) => res.json()),
        ]);

        setData({
          admissions: admissions.length,
          messages: messages.length,
          news: news.length,
          bankAvailable: !!bank?.accountName,
        });

        setRecentData({
          recentMessage: messages.length > 0 ? messages[messages.length - 1] : null,
          recentAdmission: admissions.length > 0 ? admissions[admissions.length - 1] : null,
          currentNews: news.slice(-2), // Get last 2 news items
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Admissions" 
            value={data.admissions} 
            icon={<Users className="h-8 w-8" />}
            color="bg-blue-500"
          />
          <StatsCard 
            title="Messages" 
            value={data.messages} 
            icon={<MessageCircle className="h-8 w-8" />}
            color="bg-green-500"
          />
          <StatsCard 
            title="News Posts" 
            value={data.news} 
            icon={<Newspaper className="h-8 w-8" />}
            color="bg-purple-500"
          />
          <StatsCard 
            title="Bank Info" 
            value={data.bankAvailable ? "Active" : "Inactive"} 
            icon={data.bankAvailable ? <CheckCircle className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            color={data.bankAvailable ? "bg-emerald-500" : "bg-red-500"}
          />
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Message */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Message</h3>
              </div>
            </div>
            <div className="p-6">
              {recentData.recentMessage ? (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {recentData.recentMessage.name || 'Anonymous'}
                        </h4>
                        <span className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(recentData.recentMessage.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        {recentData.recentMessage.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span className="truncate">{recentData.recentMessage.email}</span>
                          </div>
                        )}
                        {recentData.recentMessage.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{recentData.recentMessage.phone}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                        {recentData.recentMessage.message || 'No message content'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No messages yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Admission */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Admission</h3>
              </div>
            </div>
            <div className="p-6">
              {recentData.recentAdmission ? (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {recentData.recentAdmission.firstName || 'Name not provided'} {recentData.recentAdmission.lastName}
                        </h4>
                        <span className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(recentData.recentAdmission.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-1 grid grid-cols-1 gap-1 text-sm text-gray-500">
                        {recentData.recentAdmission.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span className="truncate">{recentData.recentAdmission.email}</span>
                          </div>
                        )}
                        {recentData.recentAdmission.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{recentData.recentAdmission.phone}</span>
                          </div>
                        )}
                        {recentData.recentAdmission.course && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {recentData.recentAdmission.course}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No admissions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current News */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <Newspaper className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Current News</h3>
              </div>
            </div>
            <div className="p-6">
              {recentData.currentNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentData.currentNews.map((newsItem, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Newspaper className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                            {newsItem.title || 'Untitled News'}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                            {newsItem.content || newsItem.description || 'No content available'}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(newsItem.createdAt || newsItem.publishedAt || Date.now()).toLocaleDateString()}
                            </span>
                            {newsItem.status && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                newsItem.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {newsItem.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No news posts yet</p>
                  <p className="text-gray-400 text-sm">Published news will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`${color} text-white p-3 rounded-lg`}>
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;