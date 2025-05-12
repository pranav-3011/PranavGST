import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, User, Briefcase, Phone, Edit, Trash2 } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const SearchDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    phone_number: "",
  });

  useEffect(() => {
    if (fileNumber) {
      fetchOfficers();
    }
  }, [fileNumber]);

  const fetchOfficers = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        "investigation/search-officers/"
      );
      setOfficers(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching search officers:", error);
      setError(error.message || "Failed to fetch search officers");
      toast.error(error.message || "Failed to fetch search officers");
      setIsLoading(false);
    }
  };

  const handleAddOfficer = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/search-officers/", {
        ...formData,
        search: fileNumber,
      });
      setShowAddForm(false);
      setFormData({
        name: "",
        designation: "",
        phone_number: "",
      });
      fetchOfficers();
      toast.success("Search officer added successfully");
    } catch (error) {
      console.error("Error adding search officer:", error);
      setError(error.message || "Failed to add search officer");
      toast.error(error.message || "Failed to add search officer");
    }
  };

  const handleViewOfficer = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/search-officers/${id}/`);
      setSelectedOfficer(data);
    } catch (error) {
      console.error("Error fetching officer details:", error);
      setError(error.message || "Failed to fetch officer details");
      toast.error(error.message || "Failed to fetch officer details");
    }
  };

  const handleEditOfficer = () => {
    setFormData({
      name: selectedOfficer.name || "",
      designation: selectedOfficer.designation || "",
      phone_number: selectedOfficer.phone_number || "",
    });
    setIsEditing(true);
  };

  const handleUpdateOfficer = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/search-officers/${selectedOfficer.id}/`, {
        ...formData,
        search: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected officer data
      handleViewOfficer(selectedOfficer.id);
      // Refresh the list
      fetchOfficers();
      toast.success("Officer updated successfully");
    } catch (error) {
      console.error("Error updating officer:", error);
      toast.error(error.message || "Failed to update officer");
    }
  };

  const confirmDelete = (e, officer) => {
    e.stopPropagation(); // Prevent card click event
    setOfficerToDelete(officer);
    setShowDeleteConfirm(true);
  };

  const handleDeleteOfficer = async () => {
    if (!officerToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/search-officers/${officerToDelete.id}/`);
      setShowDeleteConfirm(false);
      setOfficerToDelete(null);
      
      // If we're viewing the deleted officer, go back to the list
      if (selectedOfficer && selectedOfficer.id === officerToDelete.id) {
        setSelectedOfficer(null);
      }
      
      // Refresh the list
      fetchOfficers();
      toast.success("Officer deleted successfully");
    } catch (error) {
      console.error("Error deleting officer:", error);
      toast.error(error.message || "Failed to delete officer");
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

  if (error && !selectedOfficer && !showAddForm) {
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
          Are you sure you want to delete this officer? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteOfficer}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedOfficer && isEditing) {
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
              Edit Officer
            </h2>
          </div>
          <form onSubmit={handleUpdateOfficer} className="p-4">
            <div className="space-y-6">
              <InputBox
                name="name"
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
              />

              <InputBox
                name="designation"
                label="Designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                required
                maxLength={100}
              />

              <InputBox
                name="phone_number"
                label="Phone Number"
                type="text"
                value={formData.phone_number}
                onChange={handleChange}
                required
                maxLength={20}
              />

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Update Officer
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (selectedOfficer) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedOfficer(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditOfficer}
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
              Officer Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{selectedOfficer.name || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium">{selectedOfficer.designation || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{selectedOfficer.phone_number || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added By</p>
                  <p className="font-medium">{selectedOfficer.added_by || "-"}</p>
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
              Add New Officer
            </h2>
          </div>
          <form onSubmit={handleAddOfficer} className="p-4">
            <div className="space-y-6">
              <InputBox
                name="name"
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
              />

              <InputBox
                name="designation"
                label="Designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                required
                maxLength={100}
              />

              <InputBox
                name="phone_number"
                label="Phone Number"
                type="text"
                value={formData.phone_number}
                onChange={handleChange}
                required
                maxLength={20}
              />

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add Officer
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
        <h1 className="text-2xl font-bold text-gray-800">Search Officers</h1>
        <CustomButton
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Officer
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {officers.map((officer) => (
          <div
            key={officer.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, officer)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewOfficer(officer.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Officer #{officer.id}</p>
                  <p className="font-medium">{officer.name || "-"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={16} />
                  <span>{officer.designation || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>{officer.phone_number || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {officers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No search officers found</p>
        </div>
      )}
    </div>
  );
};

export default SearchDetails;
