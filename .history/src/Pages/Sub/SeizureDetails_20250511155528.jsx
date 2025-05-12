import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Box, Tag, Hash, Database, Trash2, Edit, X, Check, ChevronsDown, ChevronDown, MapPin } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const SeizureDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [seizuresList, setSeizuresList] = useState([]);
  const [selectedSeizure, setSelectedSeizure] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [seizureToDelete, setSeizureToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date_of_seizure: "",
    din_on_authorization: "",
    description_of_goods: "",
    si_unit: "",
    quantity: 0,
    model_mark: "",
    seizure_type: "INSO2",
    details_of_seizure: "",
    is_ins_04: false,
    bank_name: "",
    branch_address: "",
    ifsc_code: "",
    bond_number: "",
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      date_of_seizure: "",
      din_on_authorization: "",
      description_of_goods: "",
      si_unit: "",
      quantity: 0,
      model_mark: "",
      seizure_type: "INSO2",
      details_of_seizure: "",
      is_ins_04: false,
      bank_name: "",
      branch_address: "",
      ifsc_code: "",
      bond_number: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchSeizuresList();
    }
  }, [fileNumber]);

  const fetchSeizuresList = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/seizures/investigation/${fileNumber}/`
      );
      setSeizuresList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching seizures list:", error);
      setError(error.message || "Failed to fetch seizures list");
      toast.error(error.message || "Failed to fetch seizures list");
      setIsLoading(false);
    }
  };

  const handleAddSeizure = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/seizures/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData(); // Use resetFormData instead of inline reset
      fetchSeizuresList();
      toast.success("Seizure added successfully");
    } catch (error) {
      console.error("Error adding seizure:", error);
      setError(error.message || "Failed to add seizure");
      toast.error(error.message || "Failed to add seizure");
    }
  };

  const handleViewSeizure = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/seizures/${id}/`);
      setSelectedSeizure(data);
    } catch (error) {
      console.error("Error fetching seizure details:", error);
      setError(error.message || "Failed to fetch seizure details");
      toast.error(error.message || "Failed to fetch seizure details");
    }
  };

  const handleEditSeizure = () => {
    setFormData({
      date_of_seizure: selectedSeizure.date_of_seizure || "",
      din_on_authorization: selectedSeizure.din_on_authorization || "",
      description_of_goods: selectedSeizure.description_of_goods || "",
      si_unit: selectedSeizure.si_unit || "",
      quantity: selectedSeizure.quantity || 0,
      model_mark: selectedSeizure.model_mark || "",
    });
    setIsEditing(true);
  };

  const handleUpdateSeizure = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/seizures/${selectedSeizure.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected seizure data
      handleViewSeizure(selectedSeizure.id);
      // Refresh the list
      fetchSeizuresList();
      resetFormData(); // Add reset form data after update
      toast.success("Seizure updated successfully");
    } catch (error) {
      console.error("Error updating seizure:", error);
      toast.error(error.message || "Failed to update seizure");
    }
  };

  const confirmDelete = (e, seizure) => {
    e.stopPropagation(); // Prevent card click event
    setSeizureToDelete(seizure);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSeizure = async () => {
    if (!seizureToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/seizures/${seizureToDelete.id}/`);
      setShowDeleteConfirm(false);
      setSeizureToDelete(null);
      
      // If we're viewing the deleted seizure, go back to the list
      if (selectedSeizure && selectedSeizure.id === seizureToDelete.id) {
        setSelectedSeizure(null);
      }
      
      // Refresh the list
      fetchSeizuresList();
      toast.success("Seizure deleted successfully");
    } catch (error) {
      console.error("Error deleting seizure:", error);
      toast.error(error.message || "Failed to delete seizure");
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

  if (error && !selectedSeizure && !showAddForm) {
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
    <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this seizure record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSeizure}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedSeizure && isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => {
              setIsEditing(false);
              resetFormData(); // Reset form data when canceling edit
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
              Edit Seizure
            </h2>
          </div>
          <form onSubmit={handleUpdateSeizure} className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox
                  name="date_of_seizure"
                  label="Date of Seizure"
                  type="date"
                  value={formData.date_of_seizure}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seizure Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="seizure_type"
                    value={formData.seizure_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="INSO2">INSO2</option>
                    <option value="INSO3">INSO3</option>
                  </select>
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="is_ins_04"
                    name="is_ins_04"
                    checked={formData.is_ins_04}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_ins_04" className="ml-2 block text-sm text-gray-900">
                    Is INSO4
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description of Goods <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description_of_goods"
                  value={formData.description_of_goods}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details of Seizure <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="details_of_seizure"
                  value={formData.details_of_seizure}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

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

              {formData.is_ins_04 && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4">INSO4 Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputBox
                      name="bank_name"
                      label="Bank Name"
                      type="text"
                      value={formData.bank_name}
                      onChange={handleChange}
                      maxLength={100}
                    />
                    <InputBox
                      name="ifsc_code"
                      label="IFSC Code"
                      type="text"
                      value={formData.ifsc_code}
                      onChange={handleChange}
                      maxLength={20}
                    />
                    <InputBox
                      name="bond_number"
                      label="Bond Number"
                      type="text"
                      value={formData.bond_number}
                      onChange={handleChange}
                      maxLength={50}
                    />
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Address
                      </label>
                      <textarea
                        name="branch_address"
                        value={formData.branch_address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Update Seizure
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (selectedSeizure) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedSeizure(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditSeizure}
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
              Seizure Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Seizure</p>
                  <p className="font-medium">
                    {selectedSeizure.date_of_seizure
                      ? new Date(selectedSeizure.date_of_seizure).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedSeizure.din_on_authorization || "-"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Box className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Seizure Type</p>
                  <p className="font-medium">{selectedSeizure.seizure_type || "-"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Check className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Is INSO4</p>
                  <p className="font-medium">
                    {selectedSeizure.is_ins_04 ? "Yes" : "No"}
                  </p>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Box className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Description of Goods</p>
                  <p className="font-medium">{selectedSeizure.description_of_goods || "-"}</p>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Details of Seizure</p>
                  <p className="font-medium whitespace-pre-line">{selectedSeizure.details_of_seizure || "-"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SI Unit</p>
                  <p className="font-medium">{selectedSeizure.si_unit || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Database className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{selectedSeizure.quantity || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Box className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Model Mark</p>
                  <p className="font-medium">{selectedSeizure.model_mark || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedSeizure.added_on
                      ? new Date(selectedSeizure.added_on).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {selectedSeizure.is_ins_04 && (
              <div className="mt-6 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">INSO4 Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Database className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="font-medium">{selectedSeizure.bank_name || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Hash className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p className="font-medium">{selectedSeizure.ifsc_code || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Bond Number</p>
                      <p className="font-medium">{selectedSeizure.bond_number || "-"}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Branch Address</p>
                      <p className="font-medium">{selectedSeizure.branch_address || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              resetFormData(); // Reset form data when canceling add
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
              Add New Seizure
            </h2>
          </div>
          <form onSubmit={handleAddSeizure} className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox
                  name="date_of_seizure"
                  label="Date of Seizure"
                  type="date"
                  value={formData.date_of_seizure}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seizure Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="seizure_type"
                    value={formData.seizure_type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="INSO2">INSO2</option>
                    <option value="INSO3">INSO3</option>
                  </select>
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="is_ins_04"
                    name="is_ins_04"
                    checked={formData.is_ins_04}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_ins_04" className="ml-2 block text-sm text-gray-900">
                    Is INSO4
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description of Goods <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description_of_goods"
                  value={formData.description_of_goods}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details of Seizure <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="details_of_seizure"
                  value={formData.details_of_seizure}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

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

              {formData.is_ins_04 && (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-4">INSO4 Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputBox
                      name="bank_name"
                      label="Bank Name"
                      type="text"
                      value={formData.bank_name}
                      onChange={handleChange}
                      maxLength={100}
                    />
                    <InputBox
                      name="ifsc_code"
                      label="IFSC Code"
                      type="text"
                      value={formData.ifsc_code}
                      onChange={handleChange}
                      maxLength={20}
                    />
                    <InputBox
                      name="bond_number"
                      label="Bond Number"
                      type="text"
                      value={formData.bond_number}
                      onChange={handleChange}
                      maxLength={50}
                    />
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Address
                      </label>
                      <textarea
                        name="branch_address"
                        value={formData.branch_address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add Seizure
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Seizures</h1>
        <CustomButton
          onClick={() => {
            resetFormData(); // Reset form data before showing add form
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Seizure
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {seizuresList.map((seizure) => (
          <div
            key={seizure.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, seizure)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewSeizure(seizure.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seizure #{seizure.id}</p>
                  <p className="font-medium">
                    {seizure.date_of_seizure
                      ? new Date(seizure.date_of_seizure).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Box size={16} />
                  <span className="truncate">{seizure.description_of_goods || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Database size={16} />
                  <span>
                    {seizure.quantity} {seizure.si_unit || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag size={16} />
                  <span>{seizure.model_mark || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {seizuresList.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No seizures found</p>
        </div>
      )}
    </div>
  );
};

export default SeizureDetails;
