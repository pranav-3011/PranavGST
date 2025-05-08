import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, Building, Mail, Edit, Trash2 } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const LetterToOtherFormation = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState(null);
  const [formData, setFormData] = useState({
    agency_name: "",
    letter_addressed_to: "",
    subject_of_letter: "",
    letter_issued_date: "",
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      agency_name: "",
      letter_addressed_to: "",
      subject_of_letter: "",
      letter_issued_date: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchLetters();
    }
  }, [fileNumber]);

  const fetchLetters = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/letters/investigation/${fileNumber}/`
      );
      setLetters(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching letters:", error);
      setError(error.message || "Failed to fetch letters");
      toast.error(error.message || "Failed to fetch letters");
      setIsLoading(false);
    }
  };

  const handleAddLetter = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/letters/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchLetters();
      toast.success("Letter added successfully");
    } catch (error) {
      console.error("Error adding letter:", error);
      setError(error.message || "Failed to add letter");
      toast.error(error.message || "Failed to add letter");
    }
  };

  const handleViewLetter = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/letters/${id}/`);
      setSelectedLetter(data);
    } catch (error) {
      console.error("Error fetching letter details:", error);
      setError(error.message || "Failed to fetch letter details");
      toast.error(error.message || "Failed to fetch letter details");
    }
  };

  const handleEditLetter = () => {
    setFormData({
      agency_name: selectedLetter.agency_name || "",
      letter_addressed_to: selectedLetter.letter_addressed_to || "",
      subject_of_letter: selectedLetter.subject_of_letter || "",
      letter_issued_date: selectedLetter.letter_issued_date || "",
    });
    setIsEditing(true);
  };

  const handleUpdateLetter = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/letters/${selectedLetter.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      handleViewLetter(selectedLetter.id);
      fetchLetters();
      resetFormData();
      toast.success("Letter updated successfully");
    } catch (error) {
      console.error("Error updating letter:", error);
      toast.error(error.message || "Failed to update letter");
    }
  };

  const confirmDelete = (e, letter) => {
    e.stopPropagation();
    setLetterToDelete(letter);
    setShowDeleteConfirm(true);
  };

  const handleDeleteLetter = async () => {
    if (!letterToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/letters/${letterToDelete.id}/`);
      setShowDeleteConfirm(false);
      setLetterToDelete(null);
      
      if (selectedLetter && selectedLetter.id === letterToDelete.id) {
        setSelectedLetter(null);
      }
      
      fetchLetters();
      toast.success("Letter deleted successfully");
    } catch (error) {
      console.error("Error deleting letter:", error);
      toast.error(error.message || "Failed to delete letter");
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

  if (error && !selectedLetter && !showAddForm) {
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
          Are you sure you want to delete this letter record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteLetter}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const LetterForm = ({ onSubmit, submitButtonText }) => (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            name="agency_name"
            label="Agency Name"
            type="text"
            value={formData.agency_name}
            onChange={handleChange}
            required
            maxLength={255}
          />
          <InputBox
            name="letter_addressed_to"
            label="Letter Addressed To"
            type="text"
            value={formData.letter_addressed_to}
            onChange={handleChange}
            required
            maxLength={255}
          />
        </div>

        <InputBox
          name="subject_of_letter"
          label="Subject of Letter"
          type="text"
          value={formData.subject_of_letter}
          onChange={handleChange}
          required
          maxLength={255}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Letter Issued Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="letter_issued_date"
            value={formData.letter_issued_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
            required
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

  if (selectedLetter && isEditing) {
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
              Edit Letter
            </h2>
          </div>
          <LetterForm onSubmit={handleUpdateLetter} submitButtonText="Update Letter" />
        </div>
      </div>
    );
  }

  if (selectedLetter) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedLetter(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditLetter}
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
              Letter Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Agency Name</p>
                  <p className="font-medium">{selectedLetter.agency_name || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Letter Addressed To</p>
                  <p className="font-medium">{selectedLetter.letter_addressed_to || "-"}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Subject of Letter</p>
                  <p className="font-medium">{selectedLetter.subject_of_letter || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Letter Issued Date</p>
                  <p className="font-medium">
                    {selectedLetter.letter_issued_date
                      ? new Date(selectedLetter.letter_issued_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedLetter.added_on
                      ? new Date(selectedLetter.added_on).toLocaleDateString()
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
              Add New Letter
            </h2>
          </div>
          <LetterForm onSubmit={handleAddLetter} submitButtonText="Add Letter" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Letters to Other Formations</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Letter
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {letters.map((letter) => (
          <div
            key={letter.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, letter)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewLetter(letter.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Letter #{letter.id}</p>
                  <p className="font-medium">
                    {letter.agency_name || "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span className="truncate">{letter.letter_addressed_to || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} />
                  <span className="truncate">{letter.subject_of_letter || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>
                    {letter.letter_issued_date
                      ? new Date(letter.letter_issued_date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {letters.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No letters found</p>
        </div>
      )}
    </div>
  );
};

export default LetterToOtherFormation;
