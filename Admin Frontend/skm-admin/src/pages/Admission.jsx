import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, Calendar, Phone, Mail, MapPin, GraduationCap, Home, FileText, Eye, EyeOff, Download } from 'lucide-react';

const AdmissionPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || 'your-bearer-token-here';
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      
      const response = await fetch(`${baseUrl}/admission`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please check your admin credentials.');
        }
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token') || 'your-bearer-token-here';
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      
      const response = await fetch(`${baseUrl}/admission/export/excel`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please check your admin credentials.');
        }
        if (response.status === 404) {
          throw new Error('No admissions found to export.');
        }
        throw new Error(`Failed to download Excel: ${response.status}`);
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admissions_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgramName = (program) => {
    const programs = {
      'bsc': 'Bachelor of Science',
      'bcom': 'Bachelor of Commerce',
      'ba': 'Bachelor of Arts',
      'btech': 'Bachelor of Technology',
      'msc': 'Master of Science',
      'mcom': 'Master of Commerce',
      'ma': 'Master of Arts'
    };
    return programs[program] || program.toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle className="h-8 w-8" />
            <h2 className="text-xl font-semibold">Error Loading Applications</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchApplications}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admission Applications</h1>
                <p className="text-gray-600">Manage and review student applications</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <span className="text-blue-800 font-semibold">{applications.length} Applications</span>
              </div>
              {applications.length > 0 && (
                <button
                  onClick={downloadExcel}
                  disabled={downloading}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  <span>{downloading ? 'Downloading...' : 'Download Sheet'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Applications Table */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">There are currently no admission applications to display.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program & Education
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <React.Fragment key={app._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                  {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {app.firstName} {app.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {app.gender} • DOB: {new Date(app.dob).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {app.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {app.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
                              {getProgramName(app.program)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.qualification} • {app.percentage}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium text-blue-600">{app.uniqueKey}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(app.submittedAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleRowExpansion(app._id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            {expandedRows.has(app._id) ? (
                              <>
                                <EyeOff className="h-4 w-4" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4" />
                                <span>View Details</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Row Details */}
                      {expandedRows.has(app._id) && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Address Information */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Address Details
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p><span className="font-medium">Address:</span> {app.address}</p>
                                  <p><span className="font-medium">City:</span> {app.city}</p>
                                  <p><span className="font-medium">State:</span> {app.state}</p>
                                  <p><span className="font-medium">Pincode:</span> {app.pincode}</p>
                                </div>
                              </div>

                              {/* Education Details */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 flex items-center">
                                  <GraduationCap className="h-4 w-4 mr-2" />
                                  Education Details
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p><span className="font-medium">School:</span> {app.school}</p>
                                  <p><span className="font-medium">Board:</span> {app.board}</p>
                                  <p><span className="font-medium">Passing Year:</span> {app.passingYear}</p>
                                  <p><span className="font-medium">Percentage:</span> {app.percentage}%</p>
                                </div>
                              </div>

                              {/* Additional Information */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Additional Info
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p><span className="font-medium">Hostel Required:</span> 
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                      app.hostelRequired === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {app.hostelRequired}
                                    </span>
                                  </p>
                                  <p><span className="font-medium">How did you hear:</span> {app.howDidYouHear}</p>
                                  <p><span className="font-medium">Questions:</span> {app.questions || 'None'}</p>
                                  <p><span className="font-medium">Terms Agreed:</span> 
                                    <span className="ml-2 px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      {app.agreeToTerms}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdmissionPage;