import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, Hash, Edit, Trash2, AlertCircle, X } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component for adding/editing noticees
const NoticeeForm = ({ noticees, setNoticees }) => {
  const addNoticee = () => {
    setNoticees([...noticees, { name_of_noticee: "" }]);
  };

  const removeNoticee = (index) => {
    const updatedNoticees = [...noticees];
    updatedNoticees.splice(index, 1);
    setNoticees(updatedNoticees);
  };

  const handleNoticeeChange = (index, value) => {
    const updatedNoticees = [...noticees];
    updatedNoticees[index].name_of_noticee = value;
    setNoticees(updatedNoticees);
  };

  return (
    <div className="space-y-3 border rounded-md p-4 bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Noticees</h3>
        <button
          type="button"
          onClick={addNoticee}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
        >
          <Plus size={16} /> Add Noticee
        </button>
      </div>
      
      {noticees.map((noticee, index) => (
        <div key={index} className="flex gap-2 items-center">
          <div className="flex-grow">
            <InputBox
              name={`noticee-${index}`}
              label={`Noticee ${index + 1}`}
              type="text"
              value={noticee.name_of_noticee}
              onChange={(e) => handleNoticeeChange(index, e.target.value)}
              required
            />
          </div>
          {noticees.length > 1 && (
            <button
              type="button"
              onClick={() => removeNoticee(index)}
              className="text-red-500 hover:text-red-700 mt-5"
            >
              <X size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Form component outside of main component to prevent re-creation on every render
const ScnForm = ({ onSubmit, submitButtonText, formData, handleChange, noticees, setNoticees }) => {
  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SCN Issued Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="scn_issued_date"
              value={formData.scn_issued_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
              onFocus={(e) => e.target.showPicker()}
              required
            />
          </div>
          <InputBox
            name="din_on_authorization"
            label="DIN on Authorization"
            type="text"
            value={formData.din_on_authorization || ""}
            onChange={handleChange}
            maxLength={100}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            name="scn_issued_by"
            label="SCN Issued By"
            type="text"
            value={formData.scn_issued_by}
            onChange={handleChange}
            required
            maxLength={255}
          />
          <InputBox
            name="scn_issued_under_section"
            label="SCN Issued Under Section"
            type="text"
            value={formData.scn_issued_under_section}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <InputBox
          name="drc_01_portal_reference_number"
          label="DRC-01 Portal Reference Number"
          type="text"
          value={formData.drc_01_portal_reference_number}
          onChange={handleChange}
          required
          maxLength={100}
        />

        <NoticeeForm 
          noticees={noticees} 
          setNoticees={setNoticees} 
        />

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

const SCNDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [scns, setScns] = useState([]);
  const [selectedScn, setSelectedScn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scnToDelete, setScnToDelete] = useState(null);
  const [formData, setFormData] = useState({
    din_on_authorization: "",
    scn_issued_date: "",
    scn_issued_by: "",
    scn_issued_under_section: "",
    drc_01_portal_reference_number: "",
  });
  const [noticees, setNoticees] = useState([{ name_of_noticee: "" }]);

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      din_on_authorization: "",
      scn_issued_date: "",
      scn_issued_by: "",
      scn_issued_under_section: "",
      drc_01_portal_reference_number: "",
    });
    setNoticees([{ name_of_noticee: "" }]);
  };

  useEffect(() => {
    if (fileNumber) {
      fetchScns();
    }
  }, [fileNumber]);

  const fetchScns = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/scns/investigation/${fileNumber}/`
      );
      setScns(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching SCNs:", error);
      setError(error.message || "Failed to fetch SCNs");
      toast.error(error.message || "Failed to fetch SCNs");
      setIsLoading(false);
    }
  };

  const handleAddScn = async (e) => {
    e.preventDefault();
    
    // Validate noticees
    const validNoticees = noticees.filter(n => n.name_of_noticee.trim() !== "");
    if (validNoticees.length === 0) {
      toast.error("At least one noticee is required");
      return;
    }
    
    try {
      await AxiosWrapper("post", "investigation/scns/", {
        ...formData,
        noticees: validNoticees,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchScns();
      toast.success("SCN added successfully");
    } catch (error) {
      console.error("Error adding SCN:", error);
      setError(error.message || "Failed to add SCN");
      toast.error(error.message || "Failed to add SCN");
    }
  };

  const handleViewScn = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/scns/${id}/`);
      setSelectedScn(data);
    } catch (error) {
      console.error("Error fetching SCN details:", error);
      setError(error.message || "Failed to fetch SCN details");
      toast.error(error.message || "Failed to fetch SCN details");
    }
  };

  const handleEditScn = () => {
    setFormData({
      din_on_authorization: selectedScn.din_on_authorization || "",
      scn_issued_date: selectedScn.scn_issued_date || "",
      scn_issued_by: selectedScn.scn_issued_by || "",
      scn_issued_under_section: selectedScn.scn_issued_under_section || "",
      drc_01_portal_reference_number: selectedScn.drc_01_portal_reference_number || "",
    });
    setNoticees(selectedScn.noticees || [{ name_of_noticee: "" }]);
    setIsEditing(true);
  };

  const handleUpdateScn = async (e) => {
    e.preventDefault();
    
    // Validate noticees
    const validNoticees = noticees.filter(n => n.name_of_noticee.trim() !== "");
    if (validNoticees.length === 0) {
      toast.error("At least one noticee is required");
      return;
    }
    
    try {
      await AxiosWrapper("put", `investigation/scns/${selectedScn.id}/`, {
        ...formData,
        noticees: validNoticees,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected SCN data
      handleViewScn(selectedScn.id);
      // Refresh the list
      fetchScns();
      resetFormData();
      toast.success("SCN updated successfully");
    } catch (error) {
      console.error("Error updating SCN:", error);
      toast.error(error.message || "Failed to update SCN");
    }
  };

  const confirmDelete = (e, scn) => {
    e.stopPropagation(); // Prevent card click event
    setScnToDelete(scn);
    setShowDeleteConfirm(true);
  };

  const handleDeleteScn = async () => {
    if (!scnToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/scns/${scnToDelete.id}/`);
      setShowDeleteConfirm(false);
      setScnToDelete(null);
      
      // If we're viewing the deleted SCN, go back to the list
      if (selectedScn && selectedScn.id === scnToDelete.id) {
        setSelectedScn(null);
      }
      
      // Refresh the list
      fetchScns();
      toast.success("SCN deleted successfully");
    } catch (error) {
      console.error("Error deleting SCN:", error);
      toast.error(error.message || "Failed to delete SCN");
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

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this SCN? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteScn}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedScn && isEditing) {
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
              Edit SCN
            </h2>
          </div>
          <ScnForm 
            onSubmit={handleUpdateScn} 
            submitButtonText="Update SCN" 
            formData={formData}
            handleChange={handleChange}
            noticees={noticees}
            setNoticees={setNoticees}
          />
        </div>
      </div>
    );
  }

  if (selectedScn) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedScn(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditScn}
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
              SCN Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SCN Issued Date</p>
                  <p className="font-medium">
                    {selectedScn.scn_issued_date
                      ? new Date(selectedScn.scn_issued_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedScn.din_on_authorization || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SCN Issued By</p>
                  <p className="font-medium">{selectedScn.scn_issued_by || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SCN Issued Under Section</p>
                  <p className="font-medium">{selectedScn.scn_issued_under_section || "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Hash className="text-gray-500" size={18} />
                <p className="text-sm text-gray-600">DRC-01 Portal Reference Number</p>
              </div>
              <p className="font-medium">{selectedScn.drc_01_portal_reference_number || "-"}</p>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Noticees</h3>
              <div className="space-y-2">
                {selectedScn.noticees && selectedScn.noticees.length > 0 ? (
                  selectedScn.noticees.map((noticee, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="text-gray-500" size={16} />
                        <p className="font-medium">{noticee.name_of_noticee}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No noticees found</p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedScn.added_on
                      ? new Date(selectedScn.added_on).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Updated On</p>
                  <p className="font-medium">
                    {selectedScn.updated_on
                      ? new Date(selectedScn.updated_on).toLocaleString()
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
              Add New SCN
            </h2>
          </div>
          <ScnForm 
            onSubmit={handleAddScn} 
            submitButtonText="Add SCN" 
            formData={formData}
            handleChange={handleChange}
            noticees={noticees}
            setNoticees={setNoticees}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Show Cause Notices</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New SCN
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {scns.map((scn) => (
          <div
            key={scn.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, scn)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewScn(scn.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">SCN #{scn.id}</p>
                  <p className="font-medium">{scn.scn_issued_under_section}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {scn.scn_issued_date
                      ? new Date(scn.scn_issued_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span className="truncate">By: {scn.scn_issued_by || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash size={16} />
                  <span className="truncate">Ref: {scn.drc_01_portal_reference_number || "-"}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Noticees: {scn.noticees?.length || 0}</p>
                  {scn.noticees && scn.noticees.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {scn.noticees.slice(0, 2).map((noticee, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {noticee.name_of_noticee}
                        </span>
                      ))}
                      {scn.noticees.length > 2 && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          +{scn.noticees.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {scns.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No SCNs found</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading SCNs...</p>
        </div>
      )}
    </div>
  );
};

export default SCNDetails;
