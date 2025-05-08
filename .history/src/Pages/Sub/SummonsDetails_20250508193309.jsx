import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, HashIcon, Award, Check, Edit, Trash2, X, FileCheck } from "lucide-react";
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
    identification_document: "",
    document_number: "",
    name_of_person: "",
    role_of_person_in_case: "",
    din_number: "",
    date_of_issuing: "",
    issued_by: "",
    summons_for_date: "",
    appeared: false,
    statement_recorded_date: "",
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
        identification_document: "",
        document_number: "",
        name_of_person: "",
        role_of_person_in_case: "",
        din_number: "",
        date_of_issuing: "",
        issued_by: "",
        summons_for_date: "",
        appeared: false,
        statement_recorded_date: "",
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
      identification_document: selectedSummons.identification_document || "",
      document_number: selectedSummons.document_number || "",
      name_of_person: selectedSummons.name_of_person || "",
      role_of_person_in_case: selectedSummons.role_of_person_in_case || "",
      din_number: selectedSummons.din_number || "",
      date_of_issuing: selectedSummons.date_of_issuing || "",
      issued_by: selectedSummons.issued_by || "",
      summons_for_date: selectedSummons.summons_for_date || "",
      appeared: selectedSummons.appeared || false,
      statement_recorded_date: selectedSummons.statement_recorded_date || "",
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const SummonsForm = ({ onSubmit, submitButtonText }) => (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            name="name_of_person"
            label="Name of Person"
            type="text"
            value={formData.name_of_person}
            onChange={handleChange}
            required
            maxLength={255}
          />
          <InputBox
            name="role_of_person_in_case"
            label="Role of Person in Case"
            type="text"
            value={formData.role_of_person_in_case}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        {/* ID Document Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            name="identification_document"
            label="Identification Document Type (PAN, Aadhar, etc.)"
            type="text"
            value={formData.identification_document}
            onChange={handleChange}
            required
            maxLength={100}
          />
          <InputBox
            name="document_number"
            label="Document Number"
            type="text"
            value={formData.document_number}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        {/* Summons Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputBox
            name="din_number"
            label="DIN Number"
            type="text"
            value={formData.din_number}
            onChange={handleChange}
            required
            maxLength={100}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Issuing <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_of_issuing"
              value={formData.date_of_issuing}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
              onFocus={(e) => e.target.showPicker()}
              required
            />
          </div>
          <InputBox
            name="issued_by"
            label="Issued By"
            type="text"
            value={formData.issued_by}
            onChange={handleChange}
            required
            maxLength={255}
          />
        </div>

        {/* Summons Date and Appearance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summons For Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="summons_for_date"
              value={formData.summons_for_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
              onFocus={(e) => e.target.showPicker()}
              required
            />
          </div>
          <div className="flex items-center mt-7">
            <input
              type="checkbox"
              id="appeared"
              name="appeared"
              checked={formData.appeared}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="appeared" className="ml-2 block text-sm text-gray-900">
              Person Appeared
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statement Recorded Date
            </label>
            <input
              type="date"
              name="statement_recorded_date"
              value={formData.statement_recorded_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
              onFocus={(e) => e.target.showPicker()}
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
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Name of Person</p>
                  <p className="font-medium">{selectedSummons.name_of_person || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Award className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Role in Case</p>
                  <p className="font-medium">{selectedSummons.role_of_person_in_case || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Identification Document</p>
                  <p className="font-medium">{selectedSummons.identification_document || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Document Number</p>
                  <p className="font-medium">{selectedSummons.document_number || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN Number</p>
                  <p className="font-medium">{selectedSummons.din_number || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Issuing</p>
                  <p className="font-medium">
                    {selectedSummons.date_of_issuing
                      ? new Date(selectedSummons.date_of_issuing).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Issued By</p>
                  <p className="font-medium">{selectedSummons.issued_by || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Summons For Date</p>
                  <p className="font-medium">
                    {selectedSummons.summons_for_date
                      ? new Date(selectedSummons.summons_for_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Check className={`size-18 ${selectedSummons.appeared ? "text-green-500" : "text-gray-400"}`} />
                <div>
                  <p className="text-sm text-gray-600">Appeared</p>
                  <p className="font-medium">{selectedSummons.appeared ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileCheck className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Statement Recorded Date</p>
                  <p className="font-medium">
                    {selectedSummons.statement_recorded_date
                      ? new Date(selectedSummons.statement_recorded_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
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
                    {summons.name_of_person || "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    Issued: {summons.date_of_issuing
                      ? new Date(summons.date_of_issuing).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    For: {summons.summons_for_date
                      ? new Date(summons.summons_for_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className={summons.appeared ? "text-green-500" : "text-gray-400"} />
                  <span>{summons.appeared ? "Appeared" : "Not appeared"}</span>
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
