import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, Building, MapPin, Phone, Mail, X, Trash2, Edit, ChevronDown } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const InspectionDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [inspectionToDelete, setInspectionToDelete] = useState(null);
  const [formData, setFormData] = useState({
    officers: [{ name: "", designation: "" }],
    date_of_authorization: "",
    issued_by: "",
    din_on_authorization: "",
    date_of_inspection: "",
    outcome_of_inspection: "",
  });
  const [showCompetencyOptions, setShowCompetencyOptions] = useState(false);
  const competencyOptions = ["Superintendent", "AC/BC", "ADC/JC"];

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      officers: [{ name: "", designation: "" }],
      date_of_authorization: "",
      issued_by: "",
      din_on_authorization: "",
      date_of_inspection: "",
      outcome_of_inspection: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchInspections();
    }
  }, [fileNumber]);

  const fetchInspections = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/inspections/investigation/${fileNumber}/`
      );
      setInspections(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching inspections:", error);
      setError(error.message || "Failed to fetch inspections");
      toast.error(error.message || "Failed to fetch inspections");
      setIsLoading(false);
    }
  };

  const handleAddInspection = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/inspections/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData(); // Replace setFormData with resetFormData
      fetchInspections();
      toast.success("Inspection added successfully");
    } catch (error) {
      console.error("Error adding inspection:", error);
      setError(error.message || "Failed to add inspection");
      toast.error(error.message || "Failed to add inspection");
    }
  };

  const handleViewInspection = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/inspections/${id}/`);
      setSelectedInspection(data);
    } catch (error) {
      console.error("Error fetching inspection details:", error);
      setError(error.message || "Failed to fetch inspection details");
      toast.error(error.message || "Failed to fetch inspection details");
    }
  };

  const handleEditInspection = () => {
    setFormData({
      officers: selectedInspection.officers || [{ name: "", designation: "" }],
      date_of_authorization: selectedInspection.date_of_authorization || "",
      issued_by: selectedInspection.issued_by || "",
      din_on_authorization: selectedInspection.din_on_authorization || "",
      date_of_inspection: selectedInspection.date_of_inspection || "",
      outcome_of_inspection: selectedInspection.outcome_of_inspection || "",
    });
    setIsEditing(true);
  };

  const handleUpdateInspection = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/inspections/${selectedInspection.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected inspection data
      handleViewInspection(selectedInspection.id);
      // Refresh the list
      fetchInspections();
      resetFormData(); // Add reset form data after update
      toast.success("Inspection updated successfully");
    } catch (error) {
      console.error("Error updating inspection:", error);
      toast.error(error.message || "Failed to update inspection");
    }
  };

  const confirmDelete = (e, inspection) => {
    e.stopPropagation(); // Prevent card click event
    setInspectionToDelete(inspection);
    setShowDeleteConfirm(true);
  };

  const handleDeleteInspection = async () => {
    if (!inspectionToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/inspections/${inspectionToDelete.id}/`);
      setShowDeleteConfirm(false);
      setInspectionToDelete(null);
      
      // If we're viewing the deleted inspection, go back to the list
      if (selectedInspection && selectedInspection.id === inspectionToDelete.id) {
        setSelectedInspection(null);
      }
      
      // Refresh the list
      fetchInspections();
      toast.success("Inspection deleted successfully");
    } catch (error) {
      console.error("Error deleting inspection:", error);
      toast.error(error.message || "Failed to delete inspection");
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

  const handleOfficerChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedOfficers = [...prev.officers];
      updatedOfficers[index] = {
        ...updatedOfficers[index],
        [field]: value,
      };
      return {
        ...prev,
        officers: updatedOfficers,
      };
    });
  };

  const addOfficer = () => {
    setFormData((prev) => ({
      ...prev,
      officers: [...prev.officers, { name: "", designation: "" }],
    }));
  };

  const removeOfficer = (index) => {
    setFormData((prev) => ({
      ...prev,
      officers: prev.officers.filter((_, i) => i !== index),
    }));
  };

  // Add this function to handle selecting a competency option
  const handleCompetencySelect = (option) => {
    setFormData((prev) => ({
      ...prev,
      issued_by: option,
    }));
    setShowCompetencyOptions(false);
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

  if (error && !selectedInspection && !showAddForm) {
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
          Are you sure you want to delete this inspection record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteInspection}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedInspection && isEditing) {
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
              Edit Inspection
            </h2>
          </div>
          <form onSubmit={handleUpdateInspection} className="p-4">
            <div className="space-y-6">
              {/* Dates Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Authorization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_authorization"
                    value={formData.date_of_authorization}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
                    onFocus={(e) => e.target.showPicker()}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Inspection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_inspection"
                    value={formData.date_of_inspection}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
                    onFocus={(e) => e.target.showPicker()}
                    required
                  />
                </div>
              </div>

              {/* Purpose and DIN Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Competency <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="issued_by"
                      value={formData.issued_by}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-2"
                      onClick={() => setShowCompetencyOptions(!showCompetencyOptions)}
                    >
                      <ChevronDown size={18} className="text-gray-500" />
                    </button>
                  </div>
                  
                  {showCompetencyOptions && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto">
                        {competencyOptions.map((option) => (
                          <li 
                            key={option}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCompetencySelect(option)}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <InputBox
                  name="din_on_authorization"
                  label="DIN on Authorization"
                  type="text"
                  value={formData.din_on_authorization}
                  onChange={handleChange}
                  required
                />
              </div>

             
              {/* Outcome Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outcome of Inspection <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="outcome_of_inspection"
                  value={formData.outcome_of_inspection}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Officers Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Officers</h3>
                  <CustomButton
                    type="button"
                    onClick={addOfficer}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Officer
                  </CustomButton>
                </div>

                <div className="space-y-4">
                  {formData.officers.map((officer, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeOfficer(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        >
                          <X size={20} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputBox
                          name={`officer_name_${index}`}
                          label="Name"
                          type="text"
                          value={officer.name}
                          onChange={(e) => handleOfficerChange(index, "name", e.target.value)}
                          required
                        />
                        <InputBox
                          name={`officer_designation_${index}`}
                          label="Designation"
                          type="text"
                          value={officer.designation}
                          onChange={(e) => handleOfficerChange(index, "designation", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Update Inspection
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (selectedInspection) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedInspection(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditInspection}
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
              Inspection Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Authorization</p>
                  <p className="font-medium">
                    {selectedInspection.date_of_authorization
                      ? new Date(selectedInspection.date_of_authorization).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Inspection</p>
                  <p className="font-medium">
                    {selectedInspection.date_of_inspection
                      ? new Date(selectedInspection.date_of_inspection).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Competency</p>
                  <p className="font-medium">{selectedInspection.issued_by || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedInspection.din_on_authorization || "-"}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Outcome of Inspection</p>
                  <p className="font-medium">{selectedInspection.outcome_of_inspection || "-"}</p>
                </div>
              </div>
            </div>

            {/* Officers Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Officers</h3>
              <div className="space-y-4">
                {selectedInspection.officers?.map((officer, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{officer.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium">{officer.designation || "-"}</p>
                    </div>
                  </div>
                ))}
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
              Add New Inspection
            </h2>
          </div>
          <form onSubmit={handleAddInspection} className="p-4">
            <div className="space-y-6">
              {/* Dates Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Authorization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_authorization"
                    value={formData.date_of_authorization}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
                    onFocus={(e) => e.target.showPicker()}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Inspection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_inspection"
                    value={formData.date_of_inspection}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
                    onFocus={(e) => e.target.showPicker()}
                    required
                  />
                </div>
              </div>

              {/* Purpose and DIN Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Competency <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="issued_by"
                      value={formData.issued_by}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-2"
                      onClick={() => setShowCompetencyOptions(!showCompetencyOptions)}
                    >
                      <ChevronDown size={18} className="text-gray-500" />
                    </button>
                  </div>
                  
                  {showCompetencyOptions && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto">
                        {competencyOptions.map((option) => (
                          <li 
                            key={option}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCompetencySelect(option)}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <InputBox
                  name="din_on_authorization"
                  label="DIN on Authorization"
                  type="text"
                  value={formData.din_on_authorization}
                  onChange={handleChange}
                  required
                />
              </div>

              

              {/* Outcome Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outcome of Inspection <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="outcome_of_inspection"
                  value={formData.outcome_of_inspection}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Officers Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Officers</h3>
                  <CustomButton
                    type="button"
                    onClick={addOfficer}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Officer
                  </CustomButton>
                </div>

                <div className="space-y-4">
                  {formData.officers.map((officer, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeOfficer(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        >
                          <X size={20} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputBox
                          name={`officer_name_${index}`}
                          label="Name"
                          type="text"
                          value={officer.name}
                          onChange={(e) => handleOfficerChange(index, "name", e.target.value)}
                          required
                        />
                        <InputBox
                          name={`officer_designation_${index}`}
                          label="Designation"
                          type="text"
                          value={officer.designation}
                          onChange={(e) => handleOfficerChange(index, "designation", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add Inspection
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
        <h1 className="text-2xl font-bold text-gray-800">Inspections</h1>
        <CustomButton
          onClick={() => {
            resetFormData(); // Reset form data before showing add form
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Inspection
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inspections.map((inspection) => (
          <div
            key={inspection.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, inspection)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewInspection(inspection.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inspection #{inspection.id}</p>
                  <p className="font-medium">
                    {inspection.date_of_inspection
                      ? new Date(inspection.date_of_inspection).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    Auth: {inspection.date_of_authorization
                      ? new Date(inspection.date_of_authorization).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={16} />
                  <span>Competency: {inspection.issued_by || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{inspection.officers?.[0]?.name || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inspections.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No inspections found</p>
        </div>
      )}
    </div>
  );
};

export default InspectionDetails;
