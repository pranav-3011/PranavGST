import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Tag, DollarSign, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component outside of main component to prevent re-creation on every render
const ITCActionForm = ({ onSubmit, submitButtonText, formData, handleChange }) => (
  <form onSubmit={onSubmit} className="p-4">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
            required
          />
        </div>
        <InputBox
          name="reference_num_from_gstin_bo"
          label="Reference Number from GSTIN BO"
          type="text"
          value={formData.reference_num_from_gstin_bo}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action Taken <span className="text-red-500">*</span>
          </label>
          <select
            name="action_taken"
            value={formData.action_taken}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Action</option>
            <option value="BLOCK">Block</option>
            <option value="UNBLOCK">Unblock</option>
          </select>
        </div>

        <InputBox
          name="igst"
          label="IGST Amount"
          type="number"
          value={formData.igst}
          onChange={handleChange}
          required
          className="md:col-span-1"
        />
        <InputBox
          name="sgst"
          label="SGST Amount"
          type="number"
          value={formData.sgst}
          onChange={handleChange}
          required
          className="md:col-span-1"
        />
        <InputBox
          name="cgst"
          label="CGST Amount"
          type="number"
          value={formData.cgst}
          onChange={handleChange}
          required
          className="md:col-span-1"
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

const ITCBlockUnblockDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [itcActions, setItcActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionToDelete, setActionToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    reference_num_from_gstin_bo: "",
    action_taken: "",
    igst: 0,
    sgst: 0,
    cgst: 0,
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      date: "",
      reference_num_from_gstin_bo: "",
      action_taken: "",
      igst: 0,
      sgst: 0,
      cgst: 0,
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchITCActions();
    }
  }, [fileNumber]);

  const fetchITCActions = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/itc-actions/investigation/${fileNumber}/`
      );
      setItcActions(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching ITC actions:", error);
      setError(error.message || "Failed to fetch ITC actions");
      toast.error(error.message || "Failed to fetch ITC actions");
      setIsLoading(false);
    }
  };

  const handleAddAction = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/itc-actions/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchITCActions();
      toast.success("ITC action added successfully");
    } catch (error) {
      console.error("Error adding ITC action:", error);
      setError(error.message || "Failed to add ITC action");
      toast.error(error.message || "Failed to add ITC action");
    }
  };

  const handleViewAction = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/itc-actions/${id}/`);
      setSelectedAction(data);
    } catch (error) {
      console.error("Error fetching ITC action details:", error);
      setError(error.message || "Failed to fetch ITC action details");
      toast.error(error.message || "Failed to fetch ITC action details");
    }
  };

  const handleEditAction = () => {
    setFormData({
      date: selectedAction.date || "",
      reference_num_from_gstin_bo: selectedAction.reference_num_from_gstin_bo || "",
      action_taken: selectedAction.action_taken || "",
      igst: selectedAction.igst || 0,
      sgst: selectedAction.sgst || 0,
      cgst: selectedAction.cgst || 0,
    });
    setIsEditing(true);
  };

  const handleUpdateAction = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/itc-actions/${selectedAction.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      handleViewAction(selectedAction.id);
      fetchITCActions();
      resetFormData();
      toast.success("ITC action updated successfully");
    } catch (error) {
      console.error("Error updating ITC action:", error);
      toast.error(error.message || "Failed to update ITC action");
    }
  };

  const confirmDelete = (e, action) => {
    e.stopPropagation();
    setActionToDelete(action);
    setShowDeleteConfirm(true);
  };

  const handleDeleteAction = async () => {
    if (!actionToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/itc-actions/${actionToDelete.id}/`);
      setShowDeleteConfirm(false);
      setActionToDelete(null);
      
      if (selectedAction && selectedAction.id === actionToDelete.id) {
        setSelectedAction(null);
      }
      
      fetchITCActions();
      toast.success("ITC action deleted successfully");
    } catch (error) {
      console.error("Error deleting ITC action:", error);
      toast.error(error.message || "Failed to delete ITC action");
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  // Calculate total ITC amount
  const getTotalITC = (action) => {
    const igst = parseInt(action.igst) || 0;
    const sgst = parseInt(action.sgst) || 0;
    const cgst = parseInt(action.cgst) || 0;
    return igst + sgst + cgst;
  };

  if (!fileNumber) {
    return (
      <div className="p-4">
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          No investigation selected
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !selectedAction && !showAddForm) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this ITC action record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAction}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedAction && isEditing) {
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
              Edit ITC Action
            </h2>
          </div>
          <ITCActionForm 
            onSubmit={handleUpdateAction} 
            submitButtonText="Update ITC Action" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (selectedAction) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedAction(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditAction}
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
              ITC Action Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {selectedAction.date
                      ? new Date(selectedAction.date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Reference Number</p>
                  <p className="font-medium">{selectedAction.reference_num_from_gstin_bo || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {selectedAction.action_taken === "BLOCK" ? (
                  <XCircle className="text-red-500" size={18} />
                ) : (
                  <CheckCircle className="text-green-500" size={18} />
                )}
                <div>
                  <p className="text-sm text-gray-600">Action Taken</p>
                  <p className="font-medium">
                    {selectedAction.action_taken === "BLOCK" ? "Block" : "Unblock"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedAction.added_on
                      ? new Date(selectedAction.added_on).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Amounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-blue-500" size={18} />
                    <p className="font-medium">IGST</p>
                  </div>
                  <p className="text-xl font-bold">₹{selectedAction.igst.toLocaleString() || "0"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-500" size={18} />
                    <p className="font-medium">SGST</p>
                  </div>
                  <p className="text-xl font-bold">₹{selectedAction.sgst.toLocaleString() || "0"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-purple-500" size={18} />
                    <p className="font-medium">CGST</p>
                  </div>
                  <p className="text-xl font-bold">₹{selectedAction.cgst.toLocaleString() || "0"}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-blue-600" size={20} />
                  <p className="font-semibold">Total ITC Amount</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{getTotalITC(selectedAction).toLocaleString()}
                </p>
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
              Add New ITC Action
            </h2>
          </div>
          <ITCActionForm 
            onSubmit={handleAddAction} 
            submitButtonText="Add ITC Action" 
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
        <h1 className="text-2xl font-bold text-gray-800">ITC Block/Unblock Actions</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New ITC Action
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {itcActions.map((action) => (
          <div
            key={action.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, action)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewAction(action.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${action.action_taken === "BLOCK" ? "bg-red-100" : "bg-green-100"} rounded-lg`}>
                  {action.action_taken === "BLOCK" ? (
                    <XCircle className={`text-red-600`} size={20} />
                  ) : (
                    <CheckCircle className={`text-green-600`} size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">ITC Action #{action.id}</p>
                  <p className="font-medium">
                    {action.action_taken === "BLOCK" ? "Block" : "Unblock"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {action.date
                      ? new Date(action.date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag size={16} />
                  <span className="truncate">{action.reference_num_from_gstin_bo || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={16} />
                  <span>Total: ₹{getTotalITC(action).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {itcActions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No ITC actions found</p>
        </div>
      )}
    </div>
  );
};

export default ITCBlockUnblockDetails;
