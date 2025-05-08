import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, MapPin, Hash, Edit, Trash2, X } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const SearchDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [searches, setSearches] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState(null);
  const [formData, setFormData] = useState({
    officers: [{ name: "", designation: "", phone_number: "" }],
    address_of_search: "",
    date_of_authorization: "",
    validity: "",
    authorization_issued_by: "",
    din_on_authorization: "",
    outcome_of_search: "",
  });

  useEffect(() => {
    if (fileNumber) {
      fetchSearches();
    }
  }, [fileNumber]);

  const fetchSearches = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/searches/investigation/${fileNumber}/`
      );
      setSearches(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching searches:", error);
      setError(error.message || "Failed to fetch searches");
      toast.error(error.message || "Failed to fetch searches");
      setIsLoading(false);
    }
  };

  const handleAddSearch = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/searches/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      setFormData({
        officers: [{ name: "", designation: "", phone_number: "" }],
        address_of_search: "",
        date_of_authorization: "",
        validity: "",
        authorization_issued_by: "",
        din_on_authorization: "",
        outcome_of_search: "",
      });
      fetchSearches();
      toast.success("Search added successfully");
    } catch (error) {
      console.error("Error adding search:", error);
      setError(error.message || "Failed to add search");
      toast.error(error.message || "Failed to add search");
    }
  };

  const handleViewSearch = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/searches/${id}/`);
      setSelectedSearch(data);
    } catch (error) {
      console.error("Error fetching search details:", error);
      setError(error.message || "Failed to fetch search details");
      toast.error(error.message || "Failed to fetch search details");
    }
  };

  const handleEditSearch = () => {
    setFormData({
      officers: selectedSearch.officers || [{ name: "", designation: "", phone_number: "" }],
      address_of_search: selectedSearch.address_of_search || "",
      date_of_authorization: selectedSearch.date_of_authorization || "",
      validity: selectedSearch.validity || "",
      authorization_issued_by: selectedSearch.authorization_issued_by || "",
      din_on_authorization: selectedSearch.din_on_authorization || "",
      outcome_of_search: selectedSearch.outcome_of_search || "",
    });
    setIsEditing(true);
  };

  const handleUpdateSearch = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/searches/${selectedSearch.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      handleViewSearch(selectedSearch.id);
      fetchSearches();
      toast.success("Search updated successfully");
    } catch (error) {
      console.error("Error updating search:", error);
      toast.error(error.message || "Failed to update search");
    }
  };

  const confirmDelete = (e, search) => {
    e.stopPropagation();
    setSearchToDelete(search);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSearch = async () => {
    if (!searchToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/searches/${searchToDelete.id}/`);
      setShowDeleteConfirm(false);
      setSearchToDelete(null);
      
      if (selectedSearch && selectedSearch.id === searchToDelete.id) {
        setSelectedSearch(null);
      }
      
      fetchSearches();
      toast.success("Search deleted successfully");
    } catch (error) {
      console.error("Error deleting search:", error);
      toast.error(error.message || "Failed to delete search");
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
      officers: [...prev.officers, { name: "", designation: "", phone_number: "" }],
    }));
  };

  const removeOfficer = (index) => {
    setFormData((prev) => ({
      ...prev,
      officers: prev.officers.filter((_, i) => i !== index),
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

  if (error && !selectedSearch && !showAddForm) {
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
          Are you sure you want to delete this search record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSearch}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const SearchForm = ({ onSubmit, submitButtonText }) => (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        {/* Address and Dates Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            name="address_of_search"
            label="Address of Search"
            type="text"
            value={formData.address_of_search}
            onChange={handleChange}
            required
            maxLength={255}
          />
          <InputBox
            name="authorization_issued_by"
            label="Authorization Issued By"
            type="text"
            value={formData.authorization_issued_by}
            onChange={handleChange}
            required
            maxLength={255}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Validity <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="validity"
              value={formData.validity}
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
            value={formData.din_on_authorization}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        {/* Outcome Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Outcome of Search <span className="text-red-500">*</span>
          </label>
          <textarea
            name="outcome_of_search"
            value={formData.outcome_of_search}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <InputBox
                    name={`officer_phone_${index}`}
                    label="Phone Number"
                    type="text"
                    value={officer.phone_number}
                    onChange={(e) => handleOfficerChange(index, "phone_number", e.target.value)}
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
            {submitButtonText}
          </CustomButton>
        </div>
      </div>
    </form>
  );

  if (selectedSearch && isEditing) {
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
              Edit Search
            </h2>
          </div>
          <SearchForm onSubmit={handleUpdateSearch} submitButtonText="Update Search" />
        </div>
      </div>
    );
  }

  if (selectedSearch) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedSearch(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditSearch}
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
              Search Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Address of Search</p>
                  <p className="font-medium">{selectedSearch.address_of_search || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Authorization Issued By</p>
                  <p className="font-medium">{selectedSearch.authorization_issued_by || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Authorization</p>
                  <p className="font-medium">
                    {selectedSearch.date_of_authorization
                      ? new Date(selectedSearch.date_of_authorization).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Validity</p>
                  <p className="font-medium">
                    {selectedSearch.validity
                      ? new Date(selectedSearch.validity).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedSearch.din_on_authorization || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedSearch.added_on
                      ? new Date(selectedSearch.added_on).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Outcome of Search</p>
                  <p className="font-medium">{selectedSearch.outcome_of_search || "-"}</p>
                </div>
              </div>
            </div>

            {/* Officers Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Officers</h3>
              <div className="space-y-4">
                {selectedSearch.officers?.map((officer, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{officer.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium">{officer.designation || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{officer.phone_number || "-"}</p>
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
              Add New Search
            </h2>
          </div>
          <SearchForm onSubmit={handleAddSearch} submitButtonText="Add Search" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Searches</h1>
        <CustomButton
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Search
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {searches.map((search) => (
          <div
            key={search.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, search)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewSearch(search.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Search #{search.id}</p>
                  <p className="font-medium">
                    {search.date_of_authorization
                      ? new Date(search.date_of_authorization).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span className="truncate">{search.address_of_search || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    Valid till: {search.validity
                      ? new Date(search.validity).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>{search.officers?.[0]?.name || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {searches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No searches found</p>
        </div>
      )}
    </div>
  );
};

export default SearchDetails;
