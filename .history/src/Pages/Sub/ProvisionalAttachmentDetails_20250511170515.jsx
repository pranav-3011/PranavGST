import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Tag, DollarSign, Edit, Trash2, CheckCircle, MapPin, CreditCard, Home, Building } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component outside of main component to prevent re-creation on every render
const ProvisionalAttachmentForm = ({ onSubmit, submitButtonText, formData, handleChange }) => (
  <form onSubmit={onSubmit} className="p-4">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachment Type <span className="text-red-500">*</span>
          </label>
          <select
            name="attachment_type"
            value={formData.attachment_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Type</option>
            <option value="bank_account">Bank Account</option>
            <option value="property">Property</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DRC 22 Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="drc_22_date"
            value={formData.drc_22_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
            required
          />
        </div>

        <InputBox
          name="drc_22_din_on_authorization"
          label="DRC 22 DIN on Authorization"
          type="text"
          value={formData.drc_22_din_on_authorization}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      {formData.attachment_type === "bank_account" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputBox
            name="bank_name"
            label="Bank Name"
            type="text"
            value={formData.bank_name}
            onChange={handleChange}
            maxLength={100}
          />
          <InputBox
            name="branch_address"
            label="Branch Address"
            type="text"
            value={formData.branch_address}
            onChange={handleChange}
          />
          <InputBox
            name="ifsc_code"
            label="IFSC Code"
            type="text"
            value={formData.ifsc_code}
            onChange={handleChange}
            maxLength={20}
          />
        </div>
      )}

      {formData.attachment_type === "property" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputBox
            name="property_serial_no"
            label="Property Serial Number"
            type="text"
            value={formData.property_serial_no}
            onChange={handleChange}
            maxLength={100}
          />
          <InputBox
            name="property_address"
            label="Property Address"
            type="text"
            value={formData.property_address}
            onChange={handleChange}
          />
          <InputBox
            name="property_pin_code"
            label="Property PIN Code"
            type="text"
            value={formData.property_pin_code}
            onChange={handleChange}
            maxLength={10}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DRC 23 Date of Issue
          </label>
          <input
            type="date"
            name="drc_23_date_of_issue"
            value={formData.drc_23_date_of_issue || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
          />
        </div>
        <InputBox
          name="drc_23_din_on_authorization"
          label="DRC 23 DIN on Authorization"
          type="text"
          value={formData.drc_23_din_on_authorization || ""}
          onChange={handleChange}
          maxLength={100}
        />
      </div>

      <div className="flex justify-end">
        <CustomButton
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          variant="blue"
        >
          {submitButtonText}
        </CustomButton>
      </div>
    </div>
  </form>
);

const ProvisionalAttachmentDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState([]);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [formData, setFormData] = useState({
    investigation: fileNumber,
    attachment_type: "",
    drc_22_date: "",
    drc_22_din_on_authorization: "",
    bank_name: "",
    branch_address: "",
    ifsc_code: "",
    property_serial_no: "",
    property_address: "",
    property_pin_code: "",
    drc_23_date_of_issue: "",
    drc_23_din_on_authorization: "",
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      investigation: fileNumber,
      attachment_type: "",
      drc_22_date: "",
      drc_22_din_on_authorization: "",
      bank_name: "",
      branch_address: "",
      ifsc_code: "",
      property_serial_no: "",
      property_address: "",
      property_pin_code: "",
      drc_23_date_of_issue: "",
      drc_23_din_on_authorization: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchAttachments();
    }
  }, [fileNumber]);

  const fetchAttachments = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/provisional-attachments/by-investigation/${fileNumber}/`
      );
      setAttachments(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching provisional attachments:", error);
      setError(error.message || "Failed to fetch provisional attachments");
      toast.error(error.message || "Failed to fetch provisional attachments");
      setIsLoading(false);
    }
  };

  const fetchAttachmentDetails = async (id) => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/provisional-attachments/${id}/`
      );
      setSelectedAttachment(data);
      // Set the form data for editing
      if (isEditing) {
        setFormData({
          investigation: data.investigation,
          attachment_type: data.attachment_type,
          drc_22_date: data.drc_22_date,
          drc_22_din_on_authorization: data.drc_22_din_on_authorization,
          bank_name: data.bank_name || "",
          branch_address: data.branch_address || "",
          ifsc_code: data.ifsc_code || "",
          property_serial_no: data.property_serial_no || "",
          property_address: data.property_address || "",
          property_pin_code: data.property_pin_code || "",
          drc_23_date_of_issue: data.drc_23_date_of_issue || "",
          drc_23_din_on_authorization: data.drc_23_din_on_authorization || "",
        });
      }
    } catch (error) {
      console.error("Error fetching attachment details:", error);
      toast.error("Failed to fetch attachment details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAction = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper(
        "post",
        "investigation/provisional-attachments/",
        formData
      );
      toast.success("Provisional attachment added successfully");
      resetFormData();
      setShowAddForm(false);
      fetchAttachments();
    } catch (error) {
      console.error("Error adding provisional attachment:", error);
      toast.error(error.message || "Failed to add provisional attachment");
    }
  };

  const handleUpdateAction = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper(
        "put",
        `investigation/provisional-attachments/${selectedAttachment.id}/`,
        formData
      );
      toast.success("Provisional attachment updated successfully");
      setIsEditing(false);
      fetchAttachmentDetails(selectedAttachment.id);
      fetchAttachments();
    } catch (error) {
      console.error("Error updating provisional attachment:", error);
      toast.error(error.message || "Failed to update provisional attachment");
    }
  };

  const handleViewAction = (id) => {
    setSelectedAttachment(null);
    setIsEditing(false);
    fetchAttachmentDetails(id);
  };

  const handleEditAction = () => {
    setIsEditing(true);
    fetchAttachmentDetails(selectedAttachment.id);
  };

  const confirmDelete = (e, attachment) => {
    e.stopPropagation();
    setAttachmentToDelete(attachment);
    setShowDeleteConfirm(true);
  };

  const handleDeleteAction = async () => {
    try {
      await AxiosWrapper(
        "delete",
        `investigation/provisional-attachments/${attachmentToDelete.id}/`
      );
      toast.success("Provisional attachment deleted successfully");
      setShowDeleteConfirm(false);
      setAttachmentToDelete(null);
      if (selectedAttachment && selectedAttachment.id === attachmentToDelete.id) {
        setSelectedAttachment(null);
      }
      fetchAttachments();
    } catch (error) {
      console.error("Error deleting provisional attachment:", error);
      toast.error(error.message || "Failed to delete provisional attachment");
    }
  };

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Get attachment type icon
  const getAttachmentTypeIcon = (type) => {
    switch (type) {
      case "bank_account":
        return <CreditCard className="text-blue-600" size={20} />;
      case "property":
        return <Home className="text-green-600" size={20} />;
      default:
        return <Tag className="text-yellow-600" size={20} />;
    }
  };

  // Format attachment type for display
  const formatAttachmentType = (type) => {
    switch (type) {
      case "bank_account":
        return "Bank Account";
      case "property":
        return "Property";
      default:
        return "Other";
    }
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this provisional attachment record? This action cannot be undone.
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

  if (selectedAttachment && isEditing) {
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
              Edit Provisional Attachment
            </h2>
          </div>
          <ProvisionalAttachmentForm 
            onSubmit={handleUpdateAction} 
            submitButtonText="Update Attachment" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (selectedAttachment) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedAttachment(null)}
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
              Provisional Attachment Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getAttachmentTypeIcon(selectedAttachment.attachment_type)}
                <div>
                  <p className="text-sm text-gray-600">Attachment Type</p>
                  <p className="font-medium">
                    {formatAttachmentType(selectedAttachment.attachment_type)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DRC 22 Date</p>
                  <p className="font-medium">
                    {formatDate(selectedAttachment.drc_22_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DRC 22 DIN on Authorization</p>
                  <p className="font-medium">{selectedAttachment.drc_22_din_on_authorization}</p>
                </div>
              </div>

              {selectedAttachment.attachment_type === "bank_account" && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Bank Name</p>
                      <p className="font-medium">{selectedAttachment.bank_name || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Branch Address</p>
                      <p className="font-medium">{selectedAttachment.branch_address || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">IFSC Code</p>
                      <p className="font-medium">{selectedAttachment.ifsc_code || "-"}</p>
                    </div>
                  </div>
                </>
              )}

              {selectedAttachment.attachment_type === "property" && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Property Serial Number</p>
                      <p className="font-medium">{selectedAttachment.property_serial_no || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Property Address</p>
                      <p className="font-medium">{selectedAttachment.property_address || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Tag className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm text-gray-600">Property PIN Code</p>
                      <p className="font-medium">{selectedAttachment.property_pin_code || "-"}</p>
                    </div>
                  </div>
                </>
              )}

              {selectedAttachment.drc_23_date_of_issue && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">DRC 23 Date of Issue</p>
                    <p className="font-medium">
                      {formatDate(selectedAttachment.drc_23_date_of_issue)}
                    </p>
                  </div>
                </div>
              )}

              {selectedAttachment.drc_23_din_on_authorization && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Tag className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">DRC 23 DIN on Authorization</p>
                    <p className="font-medium">{selectedAttachment.drc_23_din_on_authorization}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-2">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="text-gray-600">Added By</p>
                  <p className="font-medium">{selectedAttachment.added_by || "-"}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedAttachment.added_on ? new Date(selectedAttachment.added_on).toLocaleString() : "-"}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Updated By</p>
                  <p className="font-medium">{selectedAttachment.updated_by || "-"}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Updated On</p>
                  <p className="font-medium">
                    {selectedAttachment.updated_on ? new Date(selectedAttachment.updated_on).toLocaleString() : "-"}
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
              Add New Provisional Attachment
            </h2>
          </div>
          <ProvisionalAttachmentForm 
            onSubmit={handleAddAction} 
            submitButtonText="Add Attachment" 
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
        <h1 className="text-2xl font-bold text-gray-800">Provisional Attachments</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
          variant="blue"
        >
          <Plus size={20} />
          Add New Attachment
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, attachment)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewAction(attachment.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getAttachmentTypeIcon(attachment.attachment_type)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attachment #{attachment.id}</p>
                  <p className="font-medium">
                    {formatAttachmentType(attachment.attachment_type)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{formatDate(attachment.drc_22_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag size={16} />
                  <span className="truncate">{attachment.drc_22_din_on_authorization}</span>
                </div>
                
                {attachment.attachment_type === "bank_account" && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building size={16} />
                    <span className="truncate">{attachment.bank_name || "-"}</span>
                  </div>
                )}
                
                {attachment.attachment_type === "property" && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span className="truncate">{attachment.property_address || "-"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {attachments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No provisional attachments found</p>
        </div>
      )}
    </div>
  );
};

export default ProvisionalAttachmentDetails;