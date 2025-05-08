import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Box, Tag, Hash, Database, Edit, Trash2 } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const SummonsDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [summonsList, setSummonsList] = useState([]);
  const [selectedSummons, setSelectedSummons] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [summonsToDelete, setSummonsToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date_of_summons: "",
    din_on_authorization: "",
    description_of_goods: "",
    si_unit: "",
    quantity: 0,
    model_mark: "",
  });

  useEffect(() => {
    if (fileNumber) {
      fetchSummonsList();
    }
  }, [fileNumber]);

  const fetchSummonsList = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/summons/investigation/${fileNumber}/`
      );
      setSummonsList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching summons list:", error);
      setError(error.message || "Failed to fetch summons list");
      toast.error(error.message || "Failed to fetch summons list");
      setIsLoading(false);
    }
  };

  const handleAddSummons = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/summons/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      setFormData({
        date_of_summons: "",
        din_on_authorization: "",
        description_of_goods: "",
        si_unit: "",
        quantity: 0,
        model_mark: "",
      });
      fetchSummonsList();
      toast.success("Summons added successfully");
    } catch (error) {
      console.error("Error adding summons:", error);
      setError(error.message || "Failed to add summons");
      toast.error(error.message || "Failed to add summons");
    }
  };

  const handleViewSummons = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/summons/${id}/`);
      setSelectedSummons(data);
    } catch (error) {
      console.error("Error fetching summons details:", error);
      setError(error.message || "Failed to fetch summons details");
      toast.error(error.message || "Failed to fetch summons details");
    }
  };

  const handleEditSummons = () => {
    setFormData({
      date_of_summons: selectedSummons.date_of_summons || "",
      din_on_authorization: selectedSummons.din_on_authorization || "",
      description_of_goods: selectedSummons.description_of_goods || "",
      si_unit: selectedSummons.si_unit || "",
      quantity: selectedSummons.quantity || 0,
      model_mark: selectedSummons.model_mark || "",
    });
    setIsEditing(true);
  };

  const handleUpdateSummons = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/summons/${selectedSummons.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      handleViewSummons(selectedSummons.id);
      fetchSummonsList();
      toast.success("Summons updated successfully");
    } catch (error) {
      console.error("Error updating summons:", error);
      toast.error(error.message || "Failed to update summons");
    }
  };

  const confirmDelete = (e, summons) => {
    e.stopPropagation();
    setSummonsToDelete(summons);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSummons = async () => {
    if (!summonsToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/summons/${summonsToDelete.id}/`);
      setShowDeleteConfirm(false);
      setSummonsToDelete(null);
      
      if (selectedSummons && selectedSummons.id === summonsToDelete.id) {
        setSelectedSummons(null);
      }
      
      fetchSummonsList();
      toast.success("Summons deleted successfully");
    } catch (error) {
      console.error("Error deleting summons:", error);
      toast.error(error.message || "Failed to delete summons");
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

  if (error && !selectedSummons && !showAddForm) {
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
          Are you sure you want to delete this summons record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSummons}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Form for both add and edit operations
  const SummonsForm = ({ onSubmit, submitButtonText }) => (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            name="date_of_summons"
            label="Date of Summons"
            type="date"
            value={formData.date_of_summons}
            onChange={handleChange}
            required
            className="date-picker"
            onFocus={(e) => e.target.showPicker()}
          />
          <InputBox
            name="din_on_authorization"
            label="DIN on Authorization"
            type="text"
            value={formData.din_on_authorization}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <InputBox
          name="description_of_goods"
          label="Description of Goods"
          type="text"
          value={formData.description_of_goods}
          onChange={handleChange}
          required
          maxLength={255}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputBox
            name="si_unit"
            label="SI Unit"
            type="text"
            value={formData.si_unit}
            onChange={handleChange}
            required
            maxLength={50}
          />
          <InputBox
            name="quantity"
            label="Quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <InputBox
            name="model_mark"
            label="Model Mark"
            type="text"
            value={formData.model_mark}
            onChange={handleChange}
            required
            maxLength={100}
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

  if (selectedSummons && isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => setIsEditing(false)}
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
              Edit Summons
            </h2>
          </div>
          <SummonsForm onSubmit={handleUpdateSummons} submitButtonText="Update Summons" />
        </div>
      </div>
    );
  }

  if (selectedSummons) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedSummons(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditSummons}
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
              Summons Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Summons</p>
                  <p className="font-medium">
                    {selectedSummons.date_of_summons
                      ? new Date(selectedSummons.date_of_summons).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedSummons.din_on_authorization || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Box className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Description of Goods</p>
                  <p className="font-medium">{selectedSummons.description_of_goods || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SI Unit</p>
                  <p className="font-medium">{selectedSummons.si_unit || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Database className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{selectedSummons.quantity || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Box className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Model Mark</p>
                  <p className="font-medium">{selectedSummons.model_mark || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedSummons.added_on
                      ? new Date(selectedSummons.added_on).toLocaleDateString()
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
            onClick={() => setShowAddForm(false)}
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
              Add New Summons
            </h2>
          </div>
          <SummonsForm onSubmit={handleAddSummons} submitButtonText="Add Summons" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Summons</h1>
        <CustomButton
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Summons
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summonsList.map((summons) => (
          <div
            key={summons.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, summons)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewSummons(summons.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Summons #{summons.id}</p>
                  <p className="font-medium">
                    {summons.date_of_summons
                      ? new Date(summons.date_of_summons).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Box size={16} />
                  <span className="truncate">{summons.description_of_goods || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Database size={16} />
                  <span>
                    {summons.quantity} {summons.si_unit || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag size={16} />
                  <span>{summons.model_mark || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {summonsList.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No summons found</p>
        </div>
      )}
    </div>
  );
};

export default SummonsDetails;
