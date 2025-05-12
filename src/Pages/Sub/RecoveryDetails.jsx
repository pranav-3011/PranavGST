import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, DollarSign, Hash, Edit, Trash2, Receipt } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component outside of main component to prevent re-creation on every render
const RecoveryForm = ({ onSubmit, submitButtonText, formData, handleChange }) => {
  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DRC-03 Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="drc_03_date"
              value={formData.drc_03_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
              onFocus={(e) => e.target.showPicker()}
              required
            />
          </div>
          <InputBox
            name="drc_03_arn_number"
            label="DRC-03 ARN Number"
            type="text"
            value={formData.drc_03_arn_number}
            onChange={handleChange}
            required
            maxLength={20}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tax_amount"
              value={formData.tax_amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Interest <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tax_interest"
              value={formData.tax_interest}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Penalty <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="tax_penalty"
              value={formData.tax_penalty}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recovery Date
          </label>
          <input
            type="date"
            name="recovery_date"
            value={formData.recovery_date || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
          />
          <p className="mt-1 text-xs text-gray-500">Optional</p>
        </div>

        <div className="flex justify-end">
          <CustomButton
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {submitButtonText}
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

const RecoveryDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [recoveries, setRecoveries] = useState([]);
  const [selectedRecovery, setSelectedRecovery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recoveryToDelete, setRecoveryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    drc_03_date: "",
    drc_03_arn_number: "",
    tax_amount: "",
    tax_interest: "",
    tax_penalty: "",
    recovery_date: ""
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      drc_03_date: "",
      drc_03_arn_number: "",
      tax_amount: "",
      tax_interest: "",
      tax_penalty: "",
      recovery_date: ""
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchRecoveries();
    }
  }, [fileNumber]);

  const fetchRecoveries = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/recoveries/investigation/${fileNumber}/`
      );
      setRecoveries(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching recoveries:", error);
      setError(error.message || "Failed to fetch recoveries");
      toast.error(error.message || "Failed to fetch recoveries");
      setIsLoading(false);
    }
  };

  const handleAddRecovery = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/recoveries/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchRecoveries();
      toast.success("Recovery added successfully");
    } catch (error) {
      console.error("Error adding recovery:", error);
      setError(error.message || "Failed to add recovery");
      toast.error(error.message || "Failed to add recovery");
    }
  };

  const handleViewRecovery = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/recoveries/${id}/`);
      setSelectedRecovery(data);
    } catch (error) {
      console.error("Error fetching recovery details:", error);
      setError(error.message || "Failed to fetch recovery details");
      toast.error(error.message || "Failed to fetch recovery details");
    }
  };

  const handleEditRecovery = () => {
    setFormData({
      drc_03_date: selectedRecovery.drc_03_date || "",
      drc_03_arn_number: selectedRecovery.drc_03_arn_number || "",
      tax_amount: selectedRecovery.tax_amount || "",
      tax_interest: selectedRecovery.tax_interest || "",
      tax_penalty: selectedRecovery.tax_penalty || "",
      recovery_date: selectedRecovery.recovery_date || ""
    });
    setIsEditing(true);
  };

  const handleUpdateRecovery = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/recoveries/${selectedRecovery.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected recovery data
      handleViewRecovery(selectedRecovery.id);
      // Refresh the list
      fetchRecoveries();
      resetFormData();
      toast.success("Recovery updated successfully");
    } catch (error) {
      console.error("Error updating recovery:", error);
      toast.error(error.message || "Failed to update recovery");
    }
  };

  const confirmDelete = (e, recovery) => {
    e.stopPropagation(); // Prevent card click event
    setRecoveryToDelete(recovery);
    setShowDeleteConfirm(true);
  };

  const handleDeleteRecovery = async () => {
    if (!recoveryToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/recoveries/${recoveryToDelete.id}/`);
      setShowDeleteConfirm(false);
      setRecoveryToDelete(null);
      
      // If we're viewing the deleted recovery, go back to the list
      if (selectedRecovery && selectedRecovery.id === recoveryToDelete.id) {
        setSelectedRecovery(null);
      }
      
      // Refresh the list
      fetchRecoveries();
      toast.success("Recovery deleted successfully");
    } catch (error) {
      console.error("Error deleting recovery:", error);
      toast.error(error.message || "Failed to delete recovery");
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format amount to currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate total amount (tax + interest + penalty)
  const calculateTotal = (recovery) => {
    const tax = parseFloat(recovery.tax_amount) || 0;
    const interest = parseFloat(recovery.tax_interest) || 0;
    const penalty = parseFloat(recovery.tax_penalty) || 0;
    return tax + interest + penalty;
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this recovery record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteRecovery}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedRecovery && isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => {
              setIsEditing(false);
              resetFormData();
            }}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Details
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Edit size={20} className="text-blue-600" />
              Edit Recovery
            </h2>
          </div>
          <RecoveryForm 
            onSubmit={handleUpdateRecovery} 
            submitButtonText="Update Recovery" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (selectedRecovery) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedRecovery(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditRecovery}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Edit size={20} className="mr-1" />
              Edit
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Recovery Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DRC-03 Date</p>
                  <p className="font-medium">
                    {selectedRecovery.drc_03_date
                      ? new Date(selectedRecovery.drc_03_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DRC-03 ARN Number</p>
                  <p className="font-medium">{selectedRecovery.drc_03_arn_number || "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-blue-600" size={20} />
                <p className="font-semibold">Recovery Amount Breakdown</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Tax Amount</p>
                  <p className="font-medium">{formatAmount(selectedRecovery.tax_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tax Interest</p>
                  <p className="font-medium">{formatAmount(selectedRecovery.tax_interest)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tax Penalty</p>
                  <p className="font-medium">{formatAmount(selectedRecovery.tax_penalty)}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-blue-200">
                <p className="text-sm text-gray-600">Total Recovery Amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatAmount(calculateTotal(selectedRecovery))}
                </p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Recovery Date</p>
                  <p className="font-medium">
                    {selectedRecovery.recovery_date
                      ? new Date(selectedRecovery.recovery_date).toLocaleDateString()
                      : "Not recovered yet"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedRecovery.added_on
                      ? new Date(selectedRecovery.added_on).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => {
              setShowAddForm(false);
              resetFormData();
            }}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Plus size={20} className="text-blue-600" />
              Add New Recovery
            </h2>
          </div>
          <RecoveryForm 
            onSubmit={handleAddRecovery} 
            submitButtonText="Add Recovery" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Recovery Records</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Recovery
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recoveries.map((recovery) => (
          <div
            key={recovery.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, recovery)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewRecovery(recovery.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Receipt className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recovery #{recovery.id}</p>
                  <p className="font-medium text-blue-600">
                    {formatAmount(calculateTotal(recovery))}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    DRC-03 Date: {recovery.drc_03_date
                      ? new Date(recovery.drc_03_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash size={16} />
                  <span className="truncate">ARN: {recovery.drc_03_arn_number || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    Recovery: {recovery.recovery_date
                      ? new Date(recovery.recovery_date).toLocaleDateString()
                      : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recoveries.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No recovery records found</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading recovery records...</p>
        </div>
      )}
    </div>
  );
};

export default RecoveryDetails;
