import React, { useState, useEffect } from "react";
import { Edit, Save, X, Upload, Check, AlertCircle } from "lucide-react";

const BankDetails = () => {
  const [bankDetails, setBankDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    branchName: "",
    upiId: "",
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch current bank details
  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/bank`);
      const data = await response.json();

      if (response.ok) {
        setBankDetails(data);
        setFormData({
          accountName: data.accountName || "",
          accountNumber: data.accountNumber || "",
          bankName: data.bankName || "",
          ifscCode: data.ifscCode || "",
          branchName: data.branchName || "",
          upiId: data.upiId || "",
        });
      } else {
        setError("Failed to fetch bank details");
      }
    } catch (err) {
      setError("Error fetching bank details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection for QR code
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setError("Please select a valid image file");
      }
    }
  };

  // Update bank details
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login as admin.");
        return;
      }

      const formDataToSend = new FormData();

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append file if selected
      if (selectedFile) {
        formDataToSend.append("qr", selectedFile);
      }

      const response = await fetch(`${BASE_URL}/bank`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Bank details updated successfully!");
        setBankDetails(data.bank);
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl("");
        // Refresh the data
        await fetchBankDetails();
      } else {
        setError(data.message || "Failed to update bank details");
      }
    } catch (err) {
      setError("Error updating bank details: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setSuccess("");
    // Reset form data to original values
    if (bankDetails) {
      setFormData({
        accountName: bankDetails.accountName || "",
        accountNumber: bankDetails.accountNumber || "",
        bankName: bankDetails.bankName || "",
        ifscCode: bankDetails.ifscCode || "",
        branchName: bankDetails.branchName || "",
        upiId: bankDetails.upiId || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Bank Details</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Edit size={18} />
                  Edit Details
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    {updating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Save size={18} />
                    )}
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          <div className="px-8 pt-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                <Check className="text-green-500" size={20} />
                <span className="text-green-700">{success}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {bankDetails ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter account name"
                        />
                      ) : (
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                          {bankDetails.accountName}
                        </div>
                      )}
                    </div>

                    {/* Account Number */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter account number"
                        />
                      ) : (
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border font-mono">
                          {bankDetails.accountNumber}
                        </div>
                      )}
                    </div>

                    {/* Bank Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter bank name"
                        />
                      ) : (
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                          {bankDetails.bankName}
                        </div>
                      )}
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IFSC Code
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 uppercase"
                          placeholder="Enter IFSC code"
                        />
                      ) : (
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border font-mono uppercase">
                          {bankDetails.ifscCode}
                        </div>
                      )}
                    </div>

                    {/* Branch Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Branch Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="branchName"
                          value={formData.branchName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter branch name"
                        />
                      ) : (
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border">
                          {bankDetails.branchName}
                        </div>
                      )}
                    </div>

                    {/* UPI ID */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        UPI ID
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter UPI ID"
                        />
                      ) : (
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border font-mono">
                          {bankDetails.upiId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Payment QR Code
                    </h3>

                    {/* Current QR Code */}
                    {bankDetails.qrCodeUrl && (
                      <div className="mb-4">
                        <img
                          src={bankDetails.qrCodeUrl}
                          alt="Payment QR Code"
                          className="w-full max-w-64 mx-auto rounded-lg shadow-md border-2 border-white"
                        />
                      </div>
                    )}

                    {/* File Upload for QR Code */}
                    {isEditing && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload New QR Code
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              id="qr-upload"
                            />
                            <label
                              htmlFor="qr-upload"
                              className="flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                            >
                              <Upload
                                className="text-gray-400 mr-2"
                                size={20}
                              />
                              <span className="text-gray-600">
                                Choose QR Code Image
                              </span>
                            </label>
                          </div>
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                              Preview:
                            </p>
                            <img
                              src={previewUrl}
                              alt="QR Code Preview"
                              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 mx-auto"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Last Updated */}
                  {bankDetails.updatedAt && (
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-500">
                        Last updated:{" "}
                        {new Date(bankDetails.updatedAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-xl">
                  No bank details found
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Add Bank Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
