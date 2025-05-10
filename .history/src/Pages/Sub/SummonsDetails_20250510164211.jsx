import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Edit, Trash2, User, FileWarning, Hash, X, ChevronRight } from "lucide-react";
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
  const [editingStatement, setEditingStatement] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [newStatementData, setNewStatementData] = useState({
    statement_recorded_date: "",
    statement_recorded_by: "",
  });
  const [newDocumentData, setNewDocumentData] = useState({
    document_name: "",
    document_type: "",
    document_number: ""
  });
  const [editingSummons, setEditingSummons] = useState(false);
  const [newSummonsData, setNewSummonsData] = useState({
    date_of_issuing: "",
    summons_for_date: "",
    din_number: "",
    issued_by: "",
    appeared: false,
    statements: []
  });
  const [collapsedSummons, setCollapsedSummons] = useState({});

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

  // Helper function to format error messages from DRF standardized errors
  const handleDRFErrors = (error) => {
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      errors.forEach(err => {
        // Format the attribute path for better readability
        const attrPath = err.attr.split('.').map(part => {
          // Convert array indices to human readable format
          if (!isNaN(part)) {
            return `#${parseInt(part) + 1}`;
          }
          // Convert camelCase to Title Case
          return part.replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/_/g, ' ');
        }).join(' › ');

        // Show toast for each error
        toast.error(`${attrPath}: ${err.detail}`);
      });
    } else {
      // Fallback for non-DRF errors
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  // Fetch summoned persons on component mount
  useEffect(() => {
    if (fileNumber) {
      fetchSummonedPersons();
    }
  }, [fileNumber]);

  // Initialize collapsed state when person is selected or summons change
  useEffect(() => {
    if (selectedPerson?.summons) {
      const initialCollapsedState = selectedPerson.summons.reduce((acc, _, index) => {
        acc[index] = true; // true means collapsed
        return acc;
      }, {});
      setCollapsedSummons(initialCollapsedState);
    }
  }, [selectedPerson?.id]); // Only run when selected person changes

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
      handleDRFErrors(error);
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
      handleDRFErrors(error);
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
      handleDRFErrors(error);
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
      handleDRFErrors(error);
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

  const toggleSummons = (summonsIndex) => {
    setCollapsedSummons(prev => ({
      ...prev,
      [summonsIndex]: !prev[summonsIndex]
    }));
  };

  if (selectedPerson && isEditing) {
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
              Edit Summoned Person
            </h2>
          </div>
          <SummonedPersonForm 
            onSubmit={handleUpdatePerson} 
            submitButtonText="Update Person" 
            formData={formData}
            handleChange={handleChange}
            handleSummonsChange={handleSummonsChange}
            handleStatementChange={handleStatementChange}
            handleDocumentChange={handleDocumentChange}
            addSummons={addSummons}
            removeSummons={removeSummons}
            addStatement={addStatement}
            removeStatement={removeStatement}
            addDocument={addDocument}
            removeDocument={removeDocument}
          />
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
              Add New Summoned Person
            </h2>
          </div>
          <form onSubmit={handleAddPerson} className="p-4">
            <div className="space-y-6">
              {/* Person Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Person Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputBox
                    name="name_of_person_or_firm"
                    label="Name of Person/Firm"
                    type="text"
                    value={formData.name_of_person_or_firm}
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
                </div>
              </div>

              {/* Initial Summons */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Summons Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Issuing <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date_of_issuing"
                        value={formData.summons[0].date_of_issuing}
                        onChange={(e) => handleSummonsChange(e, 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Summons For Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="summons_for_date"
                        value={formData.summons[0].summons_for_date}
                        onChange={(e) => handleSummonsChange(e, 0)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputBox
                      name="din_number"
                      label="DIN Number"
                      type="text"
                      value={formData.summons[0].din_number}
                      onChange={(e) => handleSummonsChange(e, 0)}
                      required
                      maxLength={100}
                    />
                    <InputBox
                      name="issued_by"
                      label="Issued By"
                      type="text"
                      value={formData.summons[0].issued_by}
                      onChange={(e) => handleSummonsChange(e, 0)}
                      required
                      maxLength={255}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add Person
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (selectedPerson) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedPerson(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex items-center gap-3">
            {/* Add New Summons Button */}
            <button
              onClick={() => {
                setEditingSummons(true);
                setNewSummonsData({
                  date_of_issuing: "",
                  summons_for_date: "",
                  din_number: "",
                  issued_by: "",
                  appeared: false,
                  statements: []
                });
              }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              <Plus size={18} />
              Add Summons
            </button>
            
            <button
              onClick={handleEditPerson}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <Edit size={18} />
              Edit Details
            </button>
          </div>
        </div>

        {/* New Summons Form */}
        {editingSummons && (
          <div className="mb-4 bg-white rounded-lg shadow-sm border border-blue-200">
            <div className="p-4 border-b border-blue-100 bg-blue-50">
              <div className="text-lg font-medium text-blue-700 flex items-center gap-2">
                <Calendar size={20} />
                Add New Summons
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Issuing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newSummonsData.date_of_issuing}
                    onChange={(e) => setNewSummonsData(prev => ({
                      ...prev,
                      date_of_issuing: e.target.value
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summons For Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newSummonsData.summons_for_date}
                    onChange={(e) => setNewSummonsData(prev => ({
                      ...prev,
                      summons_for_date: e.target.value
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DIN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSummonsData.din_number}
                    onChange={(e) => setNewSummonsData(prev => ({
                      ...prev,
                      din_number: e.target.value
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issued By <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newSummonsData.issued_by}
                    onChange={(e) => setNewSummonsData(prev => ({
                      ...prev,
                      issued_by: e.target.value
                    }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingSummons(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      // Add new summons to existing ones
                      const updatedPerson = {
                        ...selectedPerson,
                        summons: [...selectedPerson.summons, newSummonsData]
                      };
                      
                      // Update person with new summons
                      await AxiosWrapper(
                        "put",
                        `investigation/summoned-persons/${selectedPerson.id}/`,
                        updatedPerson
                      );
                      
                      // Refresh person details
                      handleViewPerson(selectedPerson.id);
                      setEditingSummons(false);
                      toast.success("New summons added successfully");
                    } catch (error) {
                      console.error("Error adding summons:", error);
                      handleDRFErrors(error);
                    }
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Summons
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header with Person Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User className="text-indigo-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedPerson.name_of_person_or_firm}</h2>
                <p className="text-gray-600">{selectedPerson.designation}</p>
              </div>
            </div>
          </div>

          {/* Summons Section */}
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summons</h3>
            
            {selectedPerson.summons && selectedPerson.summons.length > 0 ? (
              <div className="space-y-4">
                {selectedPerson.summons.map((summon, index) => (
                  <div key={summon.id || index} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                    {/* Summons Header - Always Visible */}
                    <div className="bg-gray-50 p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => toggleSummons(index)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <ChevronRight
                              size={20}
                              className={`text-gray-500 transform transition-transform ${
                                !collapsedSummons[index] ? 'rotate-90' : ''
                              }`}
                            />
                          </button>
                          <div className="flex items-center gap-2">
                            <Calendar className="text-gray-500" size={16} />
                            <span className="text-sm font-medium">
                              {summon.date_of_issuing
                                ? new Date(summon.date_of_issuing).toLocaleDateString()
                                : "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="text-gray-500" size={16} />
                            <span className="text-sm">{summon.din_number}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${summon.appeared ? 'text-green-600' : 'text-red-600'}`}>
                            <div className={`w-2 h-2 rounded-full ${summon.appeared ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-medium">
                              {summon.appeared ? "Appeared" : "Not Appeared"}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Issued by: {summon.issued_by}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            try {
                              // Toggle appeared status
                              const updatedSummons = [...selectedPerson.summons];
                              updatedSummons[index] = { 
                                ...summon, 
                                appeared: !summon.appeared,
                                // Reset statements if marking as not appeared
                                statements: !summon.appeared ? [] : summon.statements
                              };
                              
                              // Update person
                              await AxiosWrapper(
                                "put",
                                `investigation/summoned-persons/${selectedPerson.id}/`,
                                { ...selectedPerson, summons: updatedSummons }
                              );
                              
                              // Refresh person details
                              handleViewPerson(selectedPerson.id);
                              toast.success(`Person marked as ${!summon.appeared ? 'appeared' : 'not appeared'}`);
                            } catch (error) {
                              console.error("Error updating appeared status:", error);
                              handleDRFErrors(error);
                            }
                          }}
                          className={`text-sm px-2 py-1 rounded ${
                            summon.appeared 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {summon.appeared ? 'Mark as Not Appeared' : 'Mark as Appeared'}
                        </button>
                        
                        {summon.appeared && (
                          <button
                            onClick={() => {
                              setEditingStatement({ summonsIndex: index });
                              setNewStatementData({
                                statement_recorded_date: "",
                                statement_recorded_by: "",
                              });
                            }}
                            className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            Add Statement
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {!collapsedSummons[index] && (
                      <>
                        {/* New Statement Form */}
                        {editingStatement?.summonsIndex === index && (
                          <div className="p-4 border-t border-gray-200 bg-blue-50">
                            <div className="mb-3 text-sm font-medium text-blue-700 flex items-center gap-2">
                              <FileText size={16} />
                              Add New Statement
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Statement Recorded Date
                                </label>
                                <input
                                  type="date"
                                  value={newStatementData.statement_recorded_date}
                                  onChange={(e) => setNewStatementData(prev => ({
                                    ...prev,
                                    statement_recorded_date: e.target.value
                                  }))}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Statement Recorded By
                                </label>
                                <input
                                  type="text"
                                  value={newStatementData.statement_recorded_by}
                                  onChange={(e) => setNewStatementData(prev => ({
                                    ...prev,
                                    statement_recorded_by: e.target.value
                                  }))}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingStatement(null)}
                                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const updatedSummons = [...selectedPerson.summons];
                                    const updatedStatements = [
                                      ...(summon.statements || []),
                                      {
                                        ...newStatementData,
                                        documents: []
                                      }
                                    ];
                                    updatedSummons[index] = {
                                      ...summon,
                                      statements: updatedStatements
                                    };

                                    await AxiosWrapper(
                                      "put",
                                      `investigation/summoned-persons/${selectedPerson.id}/`,
                                      { ...selectedPerson, summons: updatedSummons }
                                    );

                                    handleViewPerson(selectedPerson.id);
                                    setEditingStatement(null);
                                    toast.success("Statement added successfully");
                                  } catch (error) {
                                    console.error("Error saving statement:", error);
                                    handleDRFErrors(error);
                                  }
                                }}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                              >
                                <Plus size={14} />
                                Save Statement
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Statements Section */}
                        {summon.appeared && (
                          <div className="p-3 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FileText size={16} className="text-blue-600" />
                                Statements Recorded
                              </div>
                              {/* Add Statement Button */}
                              <button
                                onClick={() => {
                                  setEditingStatement({ summonsIndex: index });
                                  setNewStatementData({
                                    statement_recorded_date: "",
                                    statement_recorded_by: "",
                                  });
                                }}
                                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                              >
                                <Plus size={14} />
                                Add Statement
                              </button>
                            </div>

                            {summon.statements && summon.statements.length > 0 ? (
                              <div className="space-y-4">
                                {summon.statements.map((statement, stIndex) => (
                                  <div key={statement.id || stIndex} 
                                    className="bg-white rounded-lg border border-blue-100 p-4 mb-3 last:mb-0">
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                                          Statement #{stIndex + 1}
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <div className="flex items-center gap-2">
                                            <Calendar className="text-gray-500" size={16} />
                                            <span className="text-sm font-medium text-gray-700">
                                              {statement.statement_recorded_date
                                                ? new Date(statement.statement_recorded_date).toLocaleDateString()
                                                : "-"}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <User className="text-gray-500" size={16} />
                                            <span className="text-sm text-gray-600">
                                              Recorded by: <span className="font-medium">{statement.statement_recorded_by}</span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => {
                                          setEditingDocument({ summonsIndex: index, statementIndex: stIndex });
                                          setNewDocumentData({
                                            document_name: "",
                                            document_type: "",
                                            document_number: ""
                                          });
                                        }}
                                        className="flex items-center gap-1 text-sm px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                                      >
                                        <Plus size={14} />
                                        Add Document
                                      </button>
                                    </div>

                                    {/* New Document Form */}
                                    {editingDocument?.summonsIndex === index && 
                                     editingDocument?.statementIndex === stIndex && (
                                      <div className="mb-4 bg-purple-50 rounded-lg p-4 border border-purple-100">
                                        <div className="mb-3 text-sm font-medium text-purple-700 flex items-center gap-2">
                                          <FileText size={16} />
                                          Add New Document
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Document Name
                                            </label>
                                            <input
                                              type="text"
                                              value={newDocumentData.document_name}
                                              onChange={(e) => setNewDocumentData(prev => ({
                                                ...prev,
                                                document_name: e.target.value
                                              }))}
                                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Document Type
                                            </label>
                                            <input
                                              type="text"
                                              value={newDocumentData.document_type}
                                              onChange={(e) => setNewDocumentData(prev => ({
                                                ...prev,
                                                document_type: e.target.value
                                              }))}
                                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                              Document Number
                                            </label>
                                            <input
                                              type="text"
                                              value={newDocumentData.document_number}
                                              onChange={(e) => setNewDocumentData(prev => ({
                                                ...prev,
                                                document_number: e.target.value
                                              }))}
                                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                          <button
                                            onClick={() => setEditingDocument(null)}
                                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            onClick={async () => {
                                              try {
                                                const updatedSummons = [...selectedPerson.summons];
                                                const updatedStatements = [...summon.statements];
                                                const updatedDocuments = [
                                                  ...(statement.documents || []),
                                                  newDocumentData
                                                ];
                                                updatedStatements[stIndex] = {
                                                  ...statement,
                                                  documents: updatedDocuments
                                                };
                                                updatedSummons[index] = {
                                                  ...summon,
                                                  statements: updatedStatements
                                                };

                                                await AxiosWrapper(
                                                  "put",
                                                  `investigation/summoned-persons/${selectedPerson.id}/`,
                                                  { ...selectedPerson, summons: updatedSummons }
                                                );

                                                handleViewPerson(selectedPerson.id);
                                                setEditingDocument(null);
                                                toast.success("Document added successfully");
                                              } catch (error) {
                                                console.error("Error saving document:", error);
                                                handleDRFErrors(error);
                                              }
                                            }}
                                            className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                          >
                                            Save Document
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Documents Table */}
                                    {statement.documents && statement.documents.length > 0 && (
                                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                                        <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                                          <div className="text-xs font-medium text-gray-700 flex items-center gap-2">
                                            <FileText size={14} />
                                            Attached Documents
                                          </div>
                                        </div>
                                        <div className="p-2">
                                          <table className="w-full text-sm">
                                            <thead>
                                              <tr className="text-xs text-gray-500 border-b border-gray-200">
                                                <th className="py-2 px-2 text-left font-medium">Name</th>
                                                <th className="py-2 px-2 text-left font-medium">Type</th>
                                                <th className="py-2 px-2 text-left font-medium">Number</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {statement.documents.map((doc, docIndex) => (
                                                <tr 
                                                  key={doc.id || docIndex}
                                                  className="border-b border-gray-100 last:border-0 hover:bg-white"
                                                >
                                                  <td className="py-2 px-2">
                                                    <div className="font-medium text-gray-900">{doc.document_name}</div>
                                                  </td>
                                                  <td className="py-2 px-2 text-gray-600">{doc.document_type}</td>
                                                  <td className="py-2 px-2 text-gray-600">{doc.document_number}</td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                                No statements recorded yet
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 border border-gray-200 rounded-lg">
                <p className="text-gray-500">No summons found</p>
              </div>
            )}
          </div>

          {/* Metadata Footer */}
          <div className="border-t border-gray-200 p-3 bg-gray-50 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              <div>Added: {selectedPerson.added_on ? new Date(selectedPerson.added_on).toLocaleString() : "-"}</div>
              <div>Updated: {selectedPerson.updated_on ? new Date(selectedPerson.updated_on).toLocaleString() : "-"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Summoned Persons</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Person
        </CustomButton>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {summonedPersons.map((person, index) => (
          <div
            key={person.id}
            className={`group cursor-pointer hover:bg-gray-50 transition-colors ${
              index !== 0 ? 'border-t border-gray-200' : ''
            }`}
          >
            <div 
              className="p-4 flex items-center justify-between"
              onClick={() => handleViewPerson(person.id)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{person.name_of_person_or_firm}</h3>
                  <p className="text-sm text-gray-600">{person.designation}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={16} />
                  <span>{person.summons ? person.summons.length : 0} Summons</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(e, person);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        ))}

        {summonedPersons.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">No summoned persons found</p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading summoned persons...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Form component
const SummonedPersonForm = ({ 
  onSubmit, 
  submitButtonText, 
  formData, 
  handleChange, 
  handleSummonsChange, 
  handleStatementChange,
  handleDocumentChange,
  addSummons,
  removeSummons,
  addStatement,
  removeStatement,
  addDocument,
  removeDocument
}) => {
  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        {/* Person Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            name="name_of_person_or_firm"
            label="Name of Person/Firm"
            type="text"
            value={formData.name_of_person_or_firm}
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
        </div>

        {/* Summons Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Summons</h4>
            <button
              type="button"
              onClick={addSummons}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-1" />
              Add Summons
            </button>
          </div>

          {formData.summons.map((summon, summonsIndex) => (
            <div key={summonsIndex} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
              {formData.summons.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSummons(summonsIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Issuing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_issuing"
                    value={summon.date_of_issuing}
                    onChange={(e) => handleSummonsChange(e, summonsIndex)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summons For Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="summons_for_date"
                    value={summon.summons_for_date}
                    onChange={(e) => handleSummonsChange(e, summonsIndex)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputBox
                  name="din_number"
                  label="DIN Number"
                  type="text"
                  value={summon.din_number}
                  onChange={(e) => handleSummonsChange(e, summonsIndex)}
                  required
                  maxLength={100}
                />
                <InputBox
                  name="issued_by"
                  label="Issued By"
                  type="text"
                  value={summon.issued_by}
                  onChange={(e) => handleSummonsChange(e, summonsIndex)}
                  required
                  maxLength={255}
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="appeared"
                    checked={summon.appeared}
                    onChange={(e) => handleSummonsChange(e, summonsIndex)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Appeared</span>
                </label>
              </div>

              {/* Statements Section */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium text-gray-700">Statements</h5>
                  <button
                    type="button"
                    onClick={() => addStatement(summonsIndex)}
                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Statement
                  </button>
                </div>

                {summon.statements.map((statement, statementIndex) => (
                  <div key={statementIndex} className="border border-gray-100 rounded-lg p-4 mb-4 relative">
                    {summon.statements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStatement(summonsIndex, statementIndex)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Statement Recorded Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="statement_recorded_date"
                          value={statement.statement_recorded_date}
                          onChange={(e) => handleStatementChange(e, summonsIndex, statementIndex)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <InputBox
                        name="statement_recorded_by"
                        label="Statement Recorded By"
                        type="text"
                        value={statement.statement_recorded_by}
                        onChange={(e) => handleStatementChange(e, summonsIndex, statementIndex)}
                        required
                        maxLength={255}
                      />
                    </div>

                    {/* Documents Section */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h6 className="font-medium text-gray-700">Documents</h6>
                        <button
                          type="button"
                          onClick={() => addDocument(summonsIndex, statementIndex)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Document
                        </button>
                      </div>

                      {statement.documents.map((document, documentIndex) => (
                        <div key={documentIndex} className="border border-gray-100 rounded-lg p-4 mb-4 relative">
                          {statement.documents.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDocument(summonsIndex, statementIndex, documentIndex)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </button>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputBox
                              name="document_name"
                              label="Document Name"
                              type="text"
                              value={document.document_name}
                              onChange={(e) => handleDocumentChange(e, summonsIndex, statementIndex, documentIndex)}
                              required
                              maxLength={255}
                            />
                            <InputBox
                              name="document_type"
                              label="Document Type"
                              type="text"
                              value={document.document_type}
                              onChange={(e) => handleDocumentChange(e, summonsIndex, statementIndex, documentIndex)}
                              required
                              maxLength={100}
                            />
                            <InputBox
                              name="document_number"
                              label="Document Number"
                              type="text"
                              value={document.document_number}
                              onChange={(e) => handleDocumentChange(e, summonsIndex, statementIndex, documentIndex)}
                              required
                              maxLength={100}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
};

export default SummonsDetails;