import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { 
  Plus, 
  ArrowLeft, 
  FileText, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  FileWarning, 
  Hash, 
  X, 
  MapPin,
  CreditCard 
} from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const InvolvedPerson = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  
  // Initial form data
  const [formData, setFormData] = useState({
    identification_document: "",
    document_number: "",
    role: "",
    email: "",
    phone_number: "",
    address: "",
  });

  // Reset form data to initial state
  const resetFormData = () => {
    setFormData({
      identification_document: "",
      document_number: "",
      role: "",
      email: "",
      phone_number: "",
      address: "",
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle special handling for numeric inputs
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Fetch all involved persons for the given investigation
  useEffect(() => {
    if (fileNumber) {
      fetchPersons();
    }
  }, [fileNumber]);

  // Function to fetch involved persons
  const fetchPersons = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/involved-persons/investigation/${fileNumber}/`
      );
      setPersons(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching involved persons:", error);
      setError(error.message || "Failed to fetch involved persons");
      toast.error(error.message || "Failed to fetch involved persons");
      setIsLoading(false);
    }
  };

  // Function to add a new involved person
  const handleAddPerson = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/involved-persons/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchPersons();
      toast.success("Involved person added successfully");
    } catch (error) {
      console.error("Error adding involved person:", error);
      setError(error.message || "Failed to add involved person");
      toast.error(error.message || "Failed to add involved person");
    }
  };

  // Function to view involved person details
  const handleViewPerson = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/involved-persons/${id}/`);
      setSelectedPerson(data);
    } catch (error) {
      console.error("Error fetching involved person details:", error);
      setError(error.message || "Failed to fetch involved person details");
      toast.error(error.message || "Failed to fetch involved person details");
    }
  };

  // Function to set up editing form
  const handleEditPerson = () => {
    setFormData({
      identification_document: selectedPerson.identification_document || "",
      document_number: selectedPerson.document_number || "",
      role: selectedPerson.role || "",
      email: selectedPerson.email || "",
      phone_number: selectedPerson.phone_number || "",
      address: selectedPerson.address || "",
    });
    setIsEditing(true);
  };

  // Function to update an involved person
  const handleUpdatePerson = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/involved-persons/${selectedPerson.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected person data
      handleViewPerson(selectedPerson.id);
      // Refresh the list
      fetchPersons();
      resetFormData();
      toast.success("Involved person updated successfully");
    } catch (error) {
      console.error("Error updating involved person:", error);
      toast.error(error.message || "Failed to update involved person");
    }
  };

  // Function to confirm deletion
  const confirmDelete = (e, person) => {
    e.stopPropagation(); // Prevent card click event
    setPersonToDelete(person);
    setShowDeleteConfirm(true);
  };

  // Function to delete an involved person
  const handleDeletePerson = async () => {
    if (!personToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/involved-persons/${personToDelete.id}/`);
      setShowDeleteConfirm(false);
      setPersonToDelete(null);
      
      // If we're viewing the deleted person, go back to the list
      if (selectedPerson && selectedPerson.id === personToDelete.id) {
        setSelectedPerson(null);
      }
      
      // Refresh the list
      fetchPersons();
      toast.success("Involved person deleted successfully");
    } catch (error) {
      console.error("Error deleting involved person:", error);
      toast.error(error.message || "Failed to delete involved person");
      setShowDeleteConfirm(false);
    }
  };

  // Function to go back to the list view
  const handleBack = () => {
    setSelectedPerson(null);
    setIsEditing(false);
    resetFormData();
  };

  return (
    <div className="container mx-auto p-4">
      {/* Back button if viewing details or editing */}
      {(selectedPerson || showAddForm) && (
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to List
        </button>
      )}

      {/* Main heading */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {showAddForm
            ? "Add New Involved Person"
            : selectedPerson
            ? isEditing
              ? "Edit Involved Person"
              : "Involved Person Details"
            : "Involved Persons"}
        </h1>
        
        {/* Add button (show only in list view) */}
        {!selectedPerson && !showAddForm && (
          <CustomButton
            variant="blue"
            className="flex items-center"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} className="mr-1" /> Add Person
          </CustomButton>
        )}
        
        {/* Edit button (show only in detail view) */}
        {selectedPerson && !isEditing && !showAddForm && (
          <div className="flex gap-2">
            <CustomButton
              variant="blue"
              className="flex items-center"
              onClick={handleEditPerson}
            >
              <Edit size={16} className="mr-1" /> Edit
            </CustomButton>
            <CustomButton
              variant="red"
              className="flex items-center"
              onClick={(e) => confirmDelete(e, selectedPerson)}
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </CustomButton>
          </div>
        )}
      </div>

      {/* Form for adding or editing involved person */}
      {(showAddForm || isEditing) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <form onSubmit={isEditing ? handleUpdatePerson : handleAddPerson}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputBox
                label="Identification Document *"
                name="identification_document"
                value={formData.identification_document}
                onChange={handleChange}
                placeholder="Enter identification document"
                required
                maxLength={100}
              />
              <InputBox
                label="Document Number *"
                name="document_number"
                value={formData.document_number}
                onChange={handleChange}
                placeholder="Enter document number"
                required
                maxLength={100}
              />
              <InputBox
                label="Role *"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter role"
                required
                maxLength={100}
              />
              <InputBox
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                maxLength={254}
              />
              <InputBox
                label="Phone Number *"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleNumberChange}
                placeholder="Enter phone number"
                required
              />
              <InputBox
                label="Address *"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
              />
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <CustomButton
                type="button"
                variant="secondary"
                onClick={isEditing ? handleBack : () => setShowAddForm(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton type="submit" variant="blue">
                {isEditing ? "Update" : "Add"} Person
              </CustomButton>
            </div>
          </form>
        </div>
      )}

      {/* List of involved persons */}
      {!selectedPerson && !showAddForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {persons.length === 0 && !isLoading ? (
            <p className="col-span-full text-center text-gray-500 py-8">
              No involved persons found. Click "Add Person" to create one.
            </p>
          ) : (
            persons.map((person) => (
              <div
                key={person.id}
                onClick={() => handleViewPerson(person.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={18} className="text-blue-600" />
                    <h3 className="font-medium text-gray-900">{person.role}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => confirmDelete(e, person)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-500" />
                    <span className="text-gray-600">{person.identification_document}: {person.document_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-500" />
                    <span className="text-gray-600">{person.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    <span className="text-gray-600">{person.phone_number}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail view of selected involved person */}
      {selectedPerson && !isEditing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Involved Person Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">{selectedPerson.role || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CreditCard className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Identification Document</p>
                  <p className="font-medium">{selectedPerson.identification_document || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Document Number</p>
                  <p className="font-medium">{selectedPerson.document_number || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedPerson.email || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{selectedPerson.phone_number || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{selectedPerson.address || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <FileWarning size={18} className="text-gray-500" />
                <h3 className="font-medium">Additional Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Added By</p>
                  <p className="font-medium">{selectedPerson.added_by || "-"}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedPerson.added_on
                      ? new Date(selectedPerson.added_on).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">
                    {selectedPerson.updated_on
                      ? new Date(selectedPerson.updated_on).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this involved person? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <CustomButton
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton variant="red" onClick={handleDeletePerson}>
                Delete
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading involved persons...</p>
        </div>
      )}
    </div>
  );
};

export default InvolvedPerson;
