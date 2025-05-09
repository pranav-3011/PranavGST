import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, DollarSign, Hash, Edit, Trash2 } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component outside of main component to prevent re-creation on every render
const QuantificationForm = ({ onSubmit, submitButtonText, formData, handleChange }) => (
  <form onSubmit={onSubmit} className="p-4">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Quantification <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date_of_quantification"
            value={formData.date_of_quantification}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
            required
          />
        </div>
        <InputBox
          name="liability_detected_for_fy"
          label="Liability Detected for FY"
          type="text"
          value={formData.liability_detected_for_fy}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
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

const QuantificationDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [quantifications, setQuantifications] = useState([]);
  const [selectedQuantification, setSelectedQuantification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quantificationToDelete, setQuantificationToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date_of_quantification: "",
    amount: "",
    liability_detected_for_fy: "",
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      date_of_quantification: "",
      amount: "",
      liability_detected_for_fy: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchQuantifications();
    }
  }, [fileNumber]);

  const fetchQuantifications = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/quantifications/investigation/${fileNumber}/`
      );
      setQuantifications(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching quantifications:", error);
      setError(error.message || "Failed to fetch quantifications");
      toast.error(error.message || "Failed to fetch quantifications");
      setIsLoading(false);
    }
  };

  const handleAddQuantification = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/quantifications/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchQuantifications();
      toast.success("Quantification added successfully");
    } catch (error) {
      console.error("Error adding quantification:", error);
      setError(error.message || "Failed to add quantification");
      toast.error(error.message || "Failed to add quantification");
    }
  };

  const handleViewQuantification = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/quantifications/${id}/`);
      setSelectedQuantification(data);
    } catch (error) {
      console.error("Error fetching quantification details:", error);
      setError(error.message || "Failed to fetch quantification details");
      toast.error(error.message || "Failed to fetch quantification details");
    }
  };

  const handleEditQuantification = () => {
    setFormData({
      date_of_quantification: selectedQuantification.date_of_quantification || "",
      amount: selectedQuantification.amount || "",
      liability_detected_for_fy: selectedQuantification.liability_detected_for_fy || "",
    });
    setIsEditing(true);
  };

  const handleUpdateQuantification = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/quantifications/${selectedQuantification.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected quantification data
      handleViewQuantification(selectedQuantification.id);
      // Refresh the list
      fetchQuantifications();
      resetFormData();
      toast.success("Quantification updated successfully");
    } catch (error) {
      console.error("Error updating quantification:", error);
      toast.error(error.message || "Failed to update quantification");
    }
  };

  const confirmDelete = (e, quantification) => {
    e.stopPropagation(); // Prevent card click event
    setQuantificationToDelete(quantification);
    setShowDeleteConfirm(true);
  };

  const handleDeleteQuantification = async () => {
    if (!quantificationToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/quantifications/${quantificationToDelete.id}/`);
      setShowDeleteConfirm(false);
      setQuantificationToDelete(null);
      
      // If we're viewing the deleted quantification, go back to the list
      if (selectedQuantification && selectedQuantification.id === quantificationToDelete.id) {
        setSelectedQuantification(null);
      }
      
      // Refresh the list
      fetchQuantifications();
      toast.success("Quantification deleted successfully");
    } catch (error) {
      console.error("Error deleting quantification:", error);
      toast.error(error.message || "Failed to delete quantification");
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

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this quantification? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteQuantification}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedQuantification && isEditing) {
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
              Edit Quantification
            </h2>
          </div>
          <QuantificationForm 
            onSubmit={handleUpdateQuantification} 
            submitButtonText="Update Quantification" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (selectedQuantification) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedQuantification(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditQuantification}
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
              Quantification Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Quantification</p>
                  <p className="font-medium">
                    {selectedQuantification.date_of_quantification
                      ? new Date(selectedQuantification.date_of_quantification).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Liability Detected for FY</p>
                  <p className="font-medium">{selectedQuantification.liability_detected_for_fy || "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-blue-600" size={20} />
                <p className="font-semibold">Amount</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {selectedQuantification.amount ? formatAmount(selectedQuantification.amount) : "-"}
              </p>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedQuantification.added_on
                      ? new Date(selectedQuantification.added_on).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Updated On</p>
                  <p className="font-medium">
                    {selectedQuantification.updated_on
                      ? new Date(selectedQuantification.updated_on).toLocaleString()
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
              Add New Quantification
            </h2>
          </div>
          <QuantificationForm 
            onSubmit={handleAddQuantification} 
            submitButtonText="Add Quantification" 
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
        <h1 className="text-2xl font-bold text-gray-800">Quantifications</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Quantification
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quantifications.map((quantification) => (
          <div
            key={quantification.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, quantification)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewQuantification(quantification.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantification #{quantification.id}</p>
                  <p className="font-medium text-green-600">
                    {quantification.amount ? formatAmount(quantification.amount) : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {quantification.date_of_quantification
                      ? new Date(quantification.date_of_quantification).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash size={16} />
                  <span className="truncate">FY: {quantification.liability_detected_for_fy || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {quantifications.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No quantifications found</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading quantifications...</p>
        </div>
      )}
    </div>
  );
};

export default QuantificationDetails;
