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
          <SummonedPersonForm 
            onSubmit={handleAddPerson} 
            submitButtonText="Add Person" 
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
          <div className="flex space-x-2">
            <button
              onClick={handleEditPerson}
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
              Summoned Person Details
            </h2>
          </div>
          <div className="p-4">
            {/* Person Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Name of Person/Firm</p>
                  <p className="font-medium">{selectedPerson.name_of_person_or_firm || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium">{selectedPerson.designation || "-"}</p>
                </div>
              </div>
            </div>

            {/* Summons Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Summons</h3>
              
              {selectedPerson.summons && selectedPerson.summons.length > 0 ? (
                <div className="space-y-6">
                  {selectedPerson.summons.map((summon, index) => (
                    <div key={summon.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="text-gray-500" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">Date of Issuing</p>
                            <p className="font-medium">
                              {summon.date_of_issuing
                                ? new Date(summon.date_of_issuing).toLocaleDateString()
                                : "-"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="text-gray-500" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">Summons For Date</p>
                            <p className="font-medium">
                              {summon.summons_for_date
                                ? new Date(summon.summons_for_date).toLocaleDateString()
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Hash className="text-gray-500" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">DIN Number</p>
                            <p className="font-medium">{summon.din_number || "-"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="text-gray-500" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">Issued By</p>
                            <p className="font-medium">{summon.issued_by || "-"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${summon.appeared ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <p className="text-sm text-gray-600">
                            {summon.appeared ? "Appeared" : "Not Appeared"}
                          </p>
                        </div>
                      </div>

                      {/* Statements Section */}
                      {summon.statements && summon.statements.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-3">Statements</h4>
                          {summon.statements.map((statement, stIndex) => (
                            <div key={statement.id || stIndex} className="border border-gray-100 rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <Calendar className="text-gray-500" size={18} />
                                  <div>
                                    <p className="text-sm text-gray-600">Statement Recorded Date</p>
                                    <p className="font-medium">
                                      {statement.statement_recorded_date
                                        ? new Date(statement.statement_recorded_date).toLocaleDateString()
                                        : "-"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                  <User className="text-gray-500" size={18} />
                                  <div>
                                    <p className="text-sm text-gray-600">Recorded By</p>
                                    <p className="font-medium">{statement.statement_recorded_by || "-"}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Documents Section */}
                              {statement.documents && statement.documents.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="font-medium text-gray-700 mb-2">Documents</h5>
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                          </th>
                                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                          </th>
                                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Number
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                                        {statement.documents.map((doc, docIndex) => (
                                          <tr key={doc.id || docIndex}>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                              {doc.document_name}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                              {doc.document_type}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-900">
                                              {doc.document_number}
                                            </td>
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

            {/* Metadata Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedPerson.added_on
                      ? new Date(selectedPerson.added_on).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Updated On</p>
                  <p className="font-medium">
                    {selectedPerson.updated_on
                      ? new Date(selectedPerson.updated_on).toLocaleString()
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summonedPersons.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => confirmDelete(e, person)}
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </div>
            
            <div onClick={() => handleViewPerson(person.id)} className="h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <User className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Person/Firm</p>
                  <p className="font-medium">{person.name_of_person_or_firm}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span className="truncate">Designation: {person.designation || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText size={16} />
                  <span>Summons: {person.summons ? person.summons.length : 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
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