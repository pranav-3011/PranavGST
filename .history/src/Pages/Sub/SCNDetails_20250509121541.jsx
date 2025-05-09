import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, DollarSign, Edit, Trash2, User, FileWarning, Hash, X } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

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
  
  // Initial form data with empty noticees array
  const [formData, setFormData] = useState({
    din_on_authorization: "",
    scn_issued_date: "",
    scn_issued_by: "",
    scn_issued_under_section: "",
    drc_01_portal_reference_number: "",
    noticees: [{
      name_of_noticee: "",
      address: "",
      amounts: [{
        amount_type: "",
        amount: "",
        description: ""
      }]
    }]
  });

  // Reset form data to initial state
  const resetFormData = () => {
    setFormData({
      din_on_authorization: "",
      scn_issued_date: "",
      scn_issued_by: "",
      scn_issued_under_section: "",
      drc_01_portal_reference_number: "",
      noticees: [{
        name_of_noticee: "",
        address: "",
        amounts: [{
          amount_type: "",
          amount: "",
          description: ""
        }]
      }]
    });
  };

  // Handle form input changes for SCN fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form input changes for noticee fields
  const handleNoticeeChange = (e, noticeeIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedNoticees = [...prev.noticees];
      updatedNoticees[noticeeIndex] = {
        ...updatedNoticees[noticeeIndex],
        [name]: value
      };
      return {
        ...prev,
        noticees: updatedNoticees
      };
    });
  };

  // Handle form input changes for amount fields
  const handleAmountChange = (e, noticeeIndex, amountIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedNoticees = [...prev.noticees];
      const updatedAmounts = [...updatedNoticees[noticeeIndex].amounts];
      updatedAmounts[amountIndex] = {
        ...updatedAmounts[amountIndex],
        [name]: value
      };
      updatedNoticees[noticeeIndex] = {
        ...updatedNoticees[noticeeIndex],
        amounts: updatedAmounts
      };
      return {
        ...prev,
        noticees: updatedNoticees
      };
    });
  };

  // Add a new noticee to the form
  const addNoticee = () => {
    setFormData((prev) => ({
      ...prev,
      noticees: [
        ...prev.noticees,
        {
          name_of_noticee: "",
          address: "",
          amounts: [{
            amount_type: "",
            amount: "",
            description: ""
          }]
        }
      ]
    }));
  };

  // Remove a noticee from the form
  const removeNoticee = (noticeeIndex) => {
    setFormData((prev) => {
      // Don't allow removing if it's the last noticee
      if (prev.noticees.length <= 1) {
        return prev;
      }
      
      const updatedNoticees = prev.noticees.filter((_, index) => index !== noticeeIndex);
      return {
        ...prev,
        noticees: updatedNoticees
      };
    });
  };

  // Add a new amount to a noticee
  const addAmount = (noticeeIndex) => {
    setFormData((prev) => {
      const updatedNoticees = [...prev.noticees];
      updatedNoticees[noticeeIndex] = {
        ...updatedNoticees[noticeeIndex],
        amounts: [
          ...updatedNoticees[noticeeIndex].amounts,
          {
            amount_type: "",
            amount: "",
            description: ""
          }
        ]
      };
      return {
        ...prev,
        noticees: updatedNoticees
      };
    });
  };

  // Remove an amount from a noticee
  const removeAmount = (noticeeIndex, amountIndex) => {
    setFormData((prev) => {
      const updatedNoticees = [...prev.noticees];
      // Don't allow removing if it's the last amount
      if (updatedNoticees[noticeeIndex].amounts.length <= 1) {
        return prev;
      }
      
      const updatedAmounts = updatedNoticees[noticeeIndex].amounts.filter((_, index) => index !== amountIndex);
      updatedNoticees[noticeeIndex] = {
        ...updatedNoticees[noticeeIndex],
        amounts: updatedAmounts
      };
      return {
        ...prev,
        noticees: updatedNoticees
      };
    });
  };

  // Fetch SCNs on component mount
  useEffect(() => {
    if (fileNumber) {
      fetchScns();
    }
  }, [fileNumber]);

  // Function to fetch SCNs list
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

  // Function to add a new SCN
  const handleAddScn = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/scns/", {
        ...formData,
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

  // Function to view SCN details
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

  // Function to set up editing form
  const handleEditScn = () => {
    setFormData({
      din_on_authorization: selectedScn.din_on_authorization || "",
      scn_issued_date: selectedScn.scn_issued_date || "",
      scn_issued_by: selectedScn.scn_issued_by || "",
      scn_issued_under_section: selectedScn.scn_issued_under_section || "",
      drc_01_portal_reference_number: selectedScn.drc_01_portal_reference_number || "",
      noticees: selectedScn.noticees || [{
        name_of_noticee: "",
        address: "",
        amounts: [{
          amount_type: "",
          amount: "",
          description: ""
        }]
      }]
    });
    setIsEditing(true);
  };

  // Function to update an SCN
  const handleUpdateScn = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/scns/${selectedScn.id}/`, {
        ...formData,
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

  // Function to confirm deletion
  const confirmDelete = (e, scn) => {
    e.stopPropagation(); // Prevent card click event
    setScnToDelete(scn);
    setShowDeleteConfirm(true);
  };

  // Function to delete an SCN
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

  // Format amount to currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate total amount for a noticee
  const calculateTotalForNoticee = (amounts) => {
    return amounts.reduce((total, amountItem) => {
      return total + (parseFloat(amountItem.amount) || 0);
    }, 0);
  };

  // Calculate total amount for the entire SCN
  const calculateTotalForScn = (noticees) => {
    return noticees.reduce((total, noticee) => {
      return total + (parseFloat(noticee.total_amount) || 0);
    }, 0);
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
            handleNoticeeChange={handleNoticeeChange}
            handleAmountChange={handleAmountChange}
            addNoticee={addNoticee}
            removeNoticee={removeNoticee}
            addAmount={addAmount}
            removeAmount={removeAmount}
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
              Add New SCN
            </h2>
          </div>
          <ScnForm 
            onSubmit={handleAddScn} 
            submitButtonText="Add SCN" 
            formData={formData}
            handleChange={handleChange}
            handleNoticeeChange={handleNoticeeChange}
            handleAmountChange={handleAmountChange}
            addNoticee={addNoticee}
            removeNoticee={removeNoticee}
            addAmount={addAmount}
            removeAmount={removeAmount}
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
              Show Cause Notice Details
            </h2>
          </div>
          <div className="p-4">
            {/* SCN Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SCN Issued By</p>
                  <p className="font-medium">{selectedScn.scn_issued_by || "-"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">SCN Issued Under Section</p>
                  <p className="font-medium">{selectedScn.scn_issued_under_section || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DRC-01 Portal Reference Number</p>
                  <p className="font-medium">{selectedScn.drc_01_portal_reference_number || "-"}</p>
                </div>
              </div>
            </div>

            {selectedScn.din_on_authorization && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
                <Hash className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedScn.din_on_authorization}</p>
                </div>
              </div>
            )}

            {/* Noticees Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Noticees</h3>
              
              {selectedScn.noticees && selectedScn.noticees.length > 0 ? (
                <div className="space-y-6">
                  {selectedScn.noticees.map((noticee, index) => (
                    <div key={noticee.id || index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Noticee: {noticee.name_of_noticee}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Address</p>
                          <p className="font-medium">{noticee.address}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                          <p className="font-medium text-indigo-600 text-lg">
                            {formatAmount(noticee.total_amount || calculateTotalForNoticee(noticee.amounts || []))}
                          </p>
                        </div>
                      </div>
                      
                      {noticee.amounts && noticee.amounts.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Amount Details</h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                  </th>
                                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                  </th>
                                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {noticee.amounts.map((amount, amtIndex) => (
                                  <tr key={amount.id || amtIndex}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {amount.amount_type}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                      {formatAmount(amount.amount)}
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-900">
                                      {amount.description || "-"}
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
              ) : (
                <div className="text-center py-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">No noticees found</p>
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
            
            {/* Total SCN Amount */}
            {selectedScn.noticees && selectedScn.noticees.length > 0 && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-indigo-600" size={20} />
                  <p className="font-semibold">Total SCN Amount</p>
                </div>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatAmount(calculateTotalForScn(selectedScn.noticees))}
                </p>
              </div>
            )}
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileWarning className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">SCN #{scn.id}</p>
                  <p className="font-medium">
                    Issued on: {scn.scn_issued_date
                      ? new Date(scn.scn_issued_date).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span className="truncate">By: {scn.scn_issued_by || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash size={16} />
                  <span className="truncate">Section: {scn.scn_issued_under_section || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={16} />
                  <span>Noticees: {scn.noticees ? scn.noticees.length : 0}</span>
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

// Form component outside of main component to prevent re-creation on every render
const ScnForm = ({ 
  onSubmit, 
  submitButtonText, 
  formData, 
  handleChange, 
  handleNoticeeChange, 
  handleAmountChange,
  addNoticee,
  removeNoticee,
  addAmount,
  removeAmount
}) => {
  return (
    <form onSubmit={onSubmit} className="p-4">
      <div className="space-y-6">
        {/* SCN Main Info */}
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
            value={formData.din_on_authorization}
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

        {/* Noticees Section */}
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Noticees</h3>
            <button
              type="button"
              onClick={addNoticee}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-1" />
              Add Noticee
            </button>
          </div>

          {formData.noticees.map((noticee, noticeeIndex) => (
            <div key={noticeeIndex} className="border border-gray-200 rounded-lg p-4 relative">
              {formData.noticees.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeNoticee(noticeeIndex)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
              
              <h4 className="font-medium text-gray-700 mb-3">Noticee #{noticeeIndex + 1}</h4>
              
              <div className="space-y-4">
                <InputBox
                  name="name_of_noticee"
                  label="Name of Noticee"
                  type="text"
                  value={noticee.name_of_noticee}
                  onChange={(e) => handleNoticeeChange(e, noticeeIndex)}
                  required
                  maxLength={255}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={noticee.address}
                    onChange={(e) => handleNoticeeChange(e, noticeeIndex)}
                    required
                  ></textarea>
                </div>
                
                {/* Amounts Section */}
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-gray-700">Amounts</h5>
                    <button
                      type="button"
                      onClick={() => addAmount(noticeeIndex)}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Amount
                    </button>
                  </div>
                  
                  {noticee.amounts.map((amount, amountIndex) => (
                    <div key={amountIndex} className="border border-gray-100 rounded-md p-3 relative">
                      {noticee.amounts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAmount(noticeeIndex, amountIndex)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InputBox
                          name="amount_type"
                          label="Amount Type"
                          type="text"
                          value={amount.amount_type}
                          onChange={(e) => handleAmountChange(e, noticeeIndex, amountIndex)}
                          required
                          maxLength={100}
                          className="col-span-1"
                        />
                        <InputBox
                          name="amount"
                          label="Amount"
                          type="number"
                          value={amount.amount}
                          onChange={(e) => handleAmountChange(e, noticeeIndex, amountIndex)}
                          step="0.01"
                          required
                          className="col-span-1"
                        />
                        <InputBox
                          name="description"
                          label="Description"
                          type="text"
                          value={amount.description || ""}
                          onChange={(e) => handleAmountChange(e, noticeeIndex, amountIndex)}
                          className="col-span-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
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

export default SCNDetails;
