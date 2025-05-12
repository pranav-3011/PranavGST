import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Building, MapPin, Edit, Trash2, Hash, CreditCard, Landmark, MapPinned } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component outside of main component to prevent re-creation on every render
const DrcForm = ({ onSubmit, submitButtonText, formData, handleChange }) => (
  <form onSubmit={onSubmit} className="p-4">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type of Issuance <span className="text-red-500">*</span>
          </label>
          <select
            name="type_of_issuence"
            value={formData.type_of_issuence}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            <option value="type3">Type 3</option>
            <option value="type4">Type 4</option>
          </select>
        </div>
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
      <input
            type="date"
            name="previous_date_of_issuence"
            value={formData.previous_date_of_issuence}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
            required
          />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Issuance <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date_of_issuence"
            value={formData.date_of_issuence}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputBox
          name="account_no"
          label="Account Number"
          type="text"
          value={formData.account_no}
          onChange={handleChange}
          required
          maxLength={50}
        />
        <InputBox
          name="name_of_bank"
          label="Name of Bank"
          type="text"
          value={formData.name_of_bank}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputBox
          name="branch_of_bank"
          label="Branch of Bank"
          type="text"
          value={formData.branch_of_bank}
          onChange={handleChange}
          required
          maxLength={100}
        />
        <InputBox
          name="ifsc_code_of_bank"
          label="IFSC Code of Bank"
          type="text"
          value={formData.ifsc_code_of_bank}
          onChange={handleChange}
          required
          maxLength={20}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address of Bank Branch <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address_of_bank_branch"
          rows="3"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.address_of_bank_branch}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputBox
          name="serial_no_of_property"
          label="Serial No of Property"
          type="text"
          value={formData.serial_no_of_property}
          onChange={handleChange}
          required
          maxLength={100}
        />
        <InputBox
          name="pin_code_of_property"
          label="Pin Code of Property"
          type="text"
          value={formData.pin_code_of_property}
          onChange={handleChange}
          required
          maxLength={10}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address of Property <span className="text-red-500">*</span>
        </label>
        <textarea
          name="address_of_property"
          rows="3"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={formData.address_of_property}
          onChange={handleChange}
          required
        ></textarea>
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

const DrcDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [drcList, setDrcList] = useState([]);
  const [selectedDrc, setSelectedDrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [drcToDelete, setDrcToDelete] = useState(null);
  const [formData, setFormData] = useState({
    type_of_issuence: "",
    din_on_authorization: "",
    previous_date_of_issuence: "",
    date_of_issuence: "",
    account_no: "",
    name_of_bank: "",
    branch_of_bank: "",
    address_of_bank_branch: "",
    ifsc_code_of_bank: "",
    serial_no_of_property: "",
    address_of_property: "",
    pin_code_of_property: "",
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      type_of_issuence: "",
      din_on_authorization: "",
      previous_date_of_issuence: "",
      date_of_issuence: "",
      account_no: "",
      name_of_bank: "",
      branch_of_bank: "",
      address_of_bank_branch: "",
      ifsc_code_of_bank: "",
      serial_no_of_property: "",
      address_of_property: "",
      pin_code_of_property: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchDrcList();
    }
  }, [fileNumber]);

  const fetchDrcList = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/drcs/investigation/${fileNumber}/`
      );
      setDrcList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching DRC list:", error);
      setError(error.message || "Failed to fetch DRC list");
      toast.error(error.message || "Failed to fetch DRC list");
      setIsLoading(false);
    }
  };

  const handleAddDrc = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/drcs/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchDrcList();
      toast.success("DRC entry added successfully");
    } catch (error) {
      console.error("Error adding DRC entry:", error);
      setError(error.message || "Failed to add DRC entry");
      toast.error(error.message || "Failed to add DRC entry");
    }
  };

  const handleViewDrc = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/drcs/${id}/`);
      setSelectedDrc(data);
    } catch (error) {
      console.error("Error fetching DRC details:", error);
      setError(error.message || "Failed to fetch DRC details");
      toast.error(error.message || "Failed to fetch DRC details");
    }
  };

  const handleEditDrc = () => {
    setFormData({
      type_of_issuence: selectedDrc.type_of_issuence || "",
      din_on_authorization: selectedDrc.din_on_authorization || "",
      previous_date_of_issuence: selectedDrc.previous_date_of_issuence || "",
      date_of_issuence: selectedDrc.date_of_issuence || "",
      account_no: selectedDrc.account_no || "",
      name_of_bank: selectedDrc.name_of_bank || "",
      branch_of_bank: selectedDrc.branch_of_bank || "",
      address_of_bank_branch: selectedDrc.address_of_bank_branch || "",
      ifsc_code_of_bank: selectedDrc.ifsc_code_of_bank || "",
      serial_no_of_property: selectedDrc.serial_no_of_property || "",
      address_of_property: selectedDrc.address_of_property || "",
      pin_code_of_property: selectedDrc.pin_code_of_property || "",
    });
    setIsEditing(true);
  };

  const handleUpdateDrc = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/drcs/${selectedDrc.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected DRC data
      handleViewDrc(selectedDrc.id);
      // Refresh the list
      fetchDrcList();
      resetFormData();
      toast.success("DRC entry updated successfully");
    } catch (error) {
      console.error("Error updating DRC entry:", error);
      toast.error(error.message || "Failed to update DRC entry");
    }
  };

  const confirmDelete = (e, drc) => {
    e.stopPropagation(); // Prevent card click event
    setDrcToDelete(drc);
    setShowDeleteConfirm(true);
  };

  const handleDeleteDrc = async () => {
    if (!drcToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/drcs/${drcToDelete.id}/`);
      setShowDeleteConfirm(false);
      setDrcToDelete(null);
      
      // If we're viewing the deleted DRC, go back to the list
      if (selectedDrc && selectedDrc.id === drcToDelete.id) {
        setSelectedDrc(null);
      }
      
      // Refresh the list
      fetchDrcList();
      toast.success("DRC entry deleted successfully");
    } catch (error) {
      console.error("Error deleting DRC entry:", error);
      toast.error(error.message || "Failed to delete DRC entry");
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
          Are you sure you want to delete this DRC entry? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteDrc}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedDrc && isEditing) {
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
              Edit DRC Entry
            </h2>
          </div>
          <DrcForm 
            onSubmit={handleUpdateDrc} 
            submitButtonText="Update DRC Entry" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (selectedDrc) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedDrc(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditDrc}
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
              DRC Entry Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Type of Issuance</p>
                  <p className="font-medium">{selectedDrc.type_of_issuence || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedDrc.din_on_authorization || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Previous Date of Issuance</p>
                  <p className="font-medium">{selectedDrc.previous_date_of_issuence || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Issuance</p>
                  <p className="font-medium">
                    {selectedDrc.date_of_issuence
                      ? new Date(selectedDrc.date_of_issuence).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium">{selectedDrc.account_no || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Landmark className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium">{selectedDrc.name_of_bank || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Bank Branch</p>
                  <p className="font-medium">{selectedDrc.branch_of_bank || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">IFSC Code</p>
                  <p className="font-medium">{selectedDrc.ifsc_code_of_bank || "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="text-gray-500" size={18} />
                  <p className="text-sm text-gray-600">Bank Branch Address</p>
                </div>
                <p className="font-medium">{selectedDrc.address_of_bank_branch || "-"}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="text-gray-500" size={18} />
                  <p className="text-sm text-gray-600">Serial No of Property</p>
                </div>
                <p className="font-medium">{selectedDrc.serial_no_of_property || "-"}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPinned className="text-gray-500" size={18} />
                  <p className="text-sm text-gray-600">Property Address</p>
                </div>
                <p className="font-medium">{selectedDrc.address_of_property || "-"}</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="text-gray-500" size={18} />
                  <p className="text-sm text-gray-600">Pin Code of Property</p>
                </div>
                <p className="font-medium">{selectedDrc.pin_code_of_property || "-"}</p>
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
              Add New DRC Entry
            </h2>
          </div>
          <DrcForm 
            onSubmit={handleAddDrc} 
            submitButtonText="Add DRC Entry" 
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
        <h1 className="text-2xl font-bold text-gray-800">DRC Entries</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New DRC Entry
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {drcList.map((drc) => (
          <div
            key={drc.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, drc)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewDrc(drc.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">DRC Entry #{drc.id}</p>
                  <p className="font-medium">{drc.type_of_issuence}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {drc.date_of_issuence
                      ? new Date(drc.date_of_issuence).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Landmark size={16} />
                  <span className="truncate">{drc.name_of_bank || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard size={16} />
                  <span className="truncate">Acc: {drc.account_no || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {drcList.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">No DRC entries found</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading DRC entries...</p>
        </div>
      )}
    </div>
  );
};

export default DrcDetails;
