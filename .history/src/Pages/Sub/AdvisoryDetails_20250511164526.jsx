import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, DollarSign, Edit, Trash2, AlertTriangle } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component outside of main component to prevent re-creation on every render
const AdvisoryForm = ({ onSubmit, submitButtonText, formData, handleChange }) => {
  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Advisory Issued Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="advisory_issued_date"
              value={formData.advisory_issued_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
              onFocus={(e) => e.target.showPicker()}
              required
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
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

const AdvisoryDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [advisories, setAdvisories] = useState([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [advisoryToDelete, setAdvisoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    advisory_issued_date: "",
    amount: "",
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      advisory_issued_date: "",
      amount: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchAdvisories();
    }
  }, [fileNumber]);

  const fetchAdvisories = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/advisories/investigation/${fileNumber}/`
      );
      setAdvisories(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching advisories:", error);
      setError(error.message || "Failed to fetch advisories");
      toast.error(error.message || "Failed to fetch advisories");
      setIsLoading(false);
    }
  };

  const handleAddAdvisory = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/advisories/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchAdvisories();
      toast.success("Advisory added successfully");
    } catch (error) {
      console.error("Error adding advisory:", error);
      setError(error.message || "Failed to add advisory");
      toast.error(error.message || "Failed to add advisory");
    }
  };

  const handleViewAdvisory = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/advisories/${id}/`);
      setSelectedAdvisory(data);
    } catch (error) {
      console.error("Error fetching advisory details:", error);
      setError(error.message || "Failed to fetch advisory details");
      toast.error(error.message || "Failed to fetch advisory details");
    }
  };

  const handleEditAdvisory = () => {
    setFormData({
      advisory_issued_date: selectedAdvisory.advisory_issued_date || "",
      amount: selectedAdvisory.amount || "",
    });
    setIsEditing(true);
  };

  const handleUpdateAdvisory = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/advisories/${selectedAdvisory.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected advisory data
      handleViewAdvisory(selectedAdvisory.id);
      // Refresh the list
      fetchAdvisories();
      resetFormData();
      toast.success("Advisory updated successfully");
    } catch (error) {
      console.error("Error updating advisory:", error);
      toast.error(error.message || "Failed to update advisory");
    }
  };

  const confirmDelete = (e, advisory) => {
    e.stopPropagation(); // Prevent card click event
    setAdvisoryToDelete(advisory);
    setShowDeleteConfirm(true);
  };

  const handleDeleteAdvisory = async () => {
    if (!advisoryToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/advisories/${advisoryToDelete.id}/`);
      setShowDeleteConfirm(false);
      setAdvisoryToDelete(null);
      
      // If we're viewing the deleted advisory, go back to the list
      if (selectedAdvisory && selectedAdvisory.id === advisoryToDelete.id) {
        setSelectedAdvisory(null);
      }
      
      // Refresh the list
      fetchAdvisories();
      toast.success("Advisory deleted successfully");
    } catch (error) {
      console.error("Error deleting advisory:", error);
      toast.error(error.message || "Failed to delete advisory");
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
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this advisory? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAdvisory}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedAdvisory && isEditing) {
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
              Edit Advisory
            </h2>
          </div>
          <AdvisoryForm 
            onSubmit={handleUpdateAdvisory} 
            submitButtonText="Update Advisory" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (selectedAdvisory) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedAdvisory(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditAdvisory}
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
              Advisory Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Advisory Issued Date</p>
                  <p className="font-medium">
                    {selectedAdvisory.advisory_issued_date
                      ? new Date(selectedAdvisory.advisory_issued_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Advisory Due Date</p>
                  <p className="font-medium">
                    {selectedAdvisory.advisory_due_date
                      ? new Date(selectedAdvisory.advisory_due_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">{formatAmount(selectedAdvisory.amount)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedAdvisory.added_on
                      ? new Date(selectedAdvisory.added_on).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Updated On</p>
                  <p className="font-medium">
                    {selectedAdvisory.updated_on
                      ? new Date(selectedAdvisory.updated_on).toLocaleString()
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
              Add New Advisory
            </h2>
          </div>
          <AdvisoryForm 
            onSubmit={handleAddAdvisory} 
            submitButtonText="Add Advisory" 
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
        <h1 className="text-2xl font-bold text-gray-800">Advisories</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Advisory
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {advisories.map((advisory) => (
          <div
            key={advisory.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, advisory)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewAdvisory(advisory.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle className="text-amber-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Advisory #{advisory.id}</p>
                  <p className="font-medium text-amber-600">
                    {formatAmount(advisory.amount)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    Issued: {advisory.advisory_issued_date
                      ? new Date(advisory.advisory_issued_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    Added: {advisory.added_on
                      ? new Date(advisory.added_on).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {advisories.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No advisories found</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading advisories...</p>
        </div>
      )}
    </div>
  );
};

export default AdvisoryDetails;
