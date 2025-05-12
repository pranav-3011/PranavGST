import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Edit, Trash2, User, FileWarning, Hash, X } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const SummonsDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [summonedPersons, setSummonedPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);

  // Initial form data
  const [formData, setFormData] = useState({
    name_of_person_or_firm: "",
    designation: "",
    investigation: "",
    summons: [{
      date_of_issuing: "",
      summons_for_date: "",
      din_number: "",
      issued_by: "",
      appeared: false,
      statements: [{
        statement_recorded_date: "",
        statement_recorded_by: "",
        documents: [{
          document_name: "",
          document_type: "",
          document_number: ""
        }]
      }]
    }]
  });

  // Reset form data to initial state
  const resetFormData = () => {
    setFormData({
      name_of_person_or_firm: "",
      designation: "",
      investigation: "",
      summons: [{
        date_of_issuing: "",
        summons_for_date: "",
        din_number: "",
        issued_by: "",
        appeared: false,
        statements: [{
          statement_recorded_date: "",
          statement_recorded_by: "",
          documents: [{
            document_name: "",
            document_type: "",
            document_number: ""
          }]
        }]
      }]
    });
  };

  // Handle form input changes for main fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form input changes for summons fields
  const handleSummonsChange = (e, summonsIndex) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        [name]: type === 'checkbox' ? checked : value
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Handle form input changes for statement fields
  const handleStatementChange = (e, summonsIndex, statementIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        [name]: value
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Handle form input changes for document fields
  const handleDocumentChange = (e, summonsIndex, statementIndex, documentIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      const updatedDocuments = [...updatedStatements[statementIndex].documents];
      updatedDocuments[documentIndex] = {
        ...updatedDocuments[documentIndex],
        [name]: value
      };
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        documents: updatedDocuments
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Add new summons
  const addSummons = () => {
    setFormData((prev) => ({
      ...prev,
      summons: [
        ...prev.summons,
        {
          date_of_issuing: "",
          summons_for_date: "",
          din_number: "",
          issued_by: "",
          appeared: false,
          statements: [{
            statement_recorded_date: "",
            statement_recorded_by: "",
            documents: [{
              document_name: "",
              document_type: "",
              document_number: ""
            }]
          }]
        }
      ]
    }));
  };

  // Remove summons
  const removeSummons = (summonsIndex) => {
    setFormData((prev) => {
      if (prev.summons.length <= 1) return prev;
      const updatedSummons = prev.summons.filter((_, index) => index !== summonsIndex);
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Add new statement
  const addStatement = (summonsIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: [
          ...updatedSummons[summonsIndex].statements,
          {
            statement_recorded_date: "",
            statement_recorded_by: "",
            documents: [{
              document_name: "",
              document_type: "",
              document_number: ""
            }]
          }
        ]
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Remove statement
  const removeStatement = (summonsIndex, statementIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      if (updatedSummons[summonsIndex].statements.length <= 1) return prev;
      const updatedStatements = updatedSummons[summonsIndex].statements.filter((_, index) => index !== statementIndex);
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Add new document
  const addDocument = (summonsIndex, statementIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        documents: [
          ...updatedStatements[statementIndex].documents,
          {
            document_name: "",
            document_type: "",
            document_number: ""
          }
        ]
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Remove document
  const removeDocument = (summonsIndex, statementIndex, documentIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      if (updatedStatements[statementIndex].documents.length <= 1) return prev;
      const updatedDocuments = updatedStatements[statementIndex].documents.filter((_, index) => index !== documentIndex);
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        documents: updatedDocuments
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Fetch summoned persons on component mount
  useEffect(() => {
    if (fileNumber) {
      fetchSummonedPersons();
    }
  }, [fileNumber]);

  // Function to fetch summoned persons list
  const fetchSummonedPersons = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/summoned-persons/investigation/${fileNumber}/`
      );
      setSummonedPersons(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching summoned persons:", error);
      setError(error.message || "Failed to fetch summoned persons");
      toast.error(error.message || "Failed to fetch summoned persons");
      setIsLoading(false);
    }
  };

  // Function to add a new summoned person
  const handleAddPerson = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/summoned-persons/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchSummonedPersons();
      toast.success("Summoned person added successfully");
    } catch (error) {
      console.error("Error adding summoned person:", error);
      setError(error.message || "Failed to add summoned person");
      toast.error(error.message || "Failed to add summoned person");
    }
  };

  // Function to view summoned person details
  const handleViewPerson = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/summoned-persons/${id}/`);
      setSelectedPerson(data);
    } catch (error) {
      console.error("Error fetching summoned person details:", error);
      setError(error.message || "Failed to fetch summoned person details");
      toast.error(error.message || "Failed to fetch summoned person details");
    }
  };

  // Function to set up editing form
  const handleEditPerson = () => {
    setFormData({
      name_of_person_or_firm: selectedPerson.name_of_person_or_firm || "",
      designation: selectedPerson.designation || "",
      summons: selectedPerson.summons || [{
        date_of_issuing: "",
        summons_for_date: "",
        din_number: "",
        issued_by: "",
        appeared: false,
        statements: [{
          statement_recorded_date: "",
          statement_recorded_by: "",
          documents: [{
            document_name: "",
            document_type: "",
            document_number: ""
          }]
        }]
      }]
    });
    setIsEditing(true);
  };

  // Function to update a summoned person
  const handleUpdatePerson = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/summoned-persons/${selectedPerson.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      handleViewPerson(selectedPerson.id);
      fetchSummonedPersons();
      resetFormData();
      toast.success("Summoned person updated successfully");
    } catch (error) {
      console.error("Error updating summoned person:", error);
      toast.error(error.message || "Failed to update summoned person");
    }
  };

  // Function to confirm deletion
  const confirmDelete = (e, person) => {
    e.stopPropagation();
    setPersonToDelete(person);
    setShowDeleteConfirm(true);
  };

  // Function to delete a summoned person
  const handleDeletePerson = async () => {
    if (!personToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/summoned-persons/${personToDelete.id}/`);
      setShowDeleteConfirm(false);
      setPersonToDelete(null);
      
      if (selectedPerson && selectedPerson.id === personToDelete.id) {
        setSelectedPerson(null);
      }
      
      fetchSummonedPersons();
      toast.success("Summoned person deleted successfully");
    } catch (error) {
      console.error("Error deleting summoned person:", error);
      toast.error(error.message || "Failed to delete summoned person");
      setShowDeleteConfirm(false);
    }
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-6">
          Are you sure you want to delete this summoned person? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeletePerson}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>SummonsDetails</div>
  )
}

export default SummonsDetails