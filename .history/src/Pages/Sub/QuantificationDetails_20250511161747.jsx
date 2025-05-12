import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, Edit, Trash2, X } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const QuantificationDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [quantifications, setQuantifications] = useState([]);
  const [selectedQuantification, setSelectedQuantification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quantificationToDelete, setQuantificationToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date_of_quantification: "",
    amount: "",
    liability_detected_for_fy: "",
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      date_of_quantification: "",
      amount: "",
      liability_detected_for_fy: "",
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchQuantifications();
    }
  }, [fileNumber]);

  const fetchQuantifications = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/quantifications/investigation/${fileNumber}/`
      );
      setQuantifications(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching quantifications:", error);
      setError(error.message || "Failed to fetch quantifications");
      toast.error(error.message || "Failed to fetch quantifications");
      setIsLoading(false);
    }
  };

  const handleAddQuantification = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/quantifications/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchQuantifications();
      toast.success("Quantification added successfully");
    } catch (error) {
      console.error("Error adding quantification:", error);
      setError(error.message || "Failed to add quantification");
      toast.error(error.message || "Failed to add quantification");
    }
  };

  const handleViewQuantification = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/quantifications/${id}/`);
      setSelectedQuantification(data);
    } catch (error) {
      console.error("Error fetching quantification details:", error);
      setError(error.message || "Failed to fetch quantification details");
      toast.error(error.message || "Failed to fetch quantification details");
    }
  };

  const handleEditQuantification = () => {
    setFormData({
      date_of_quantification: selectedQuantification.date_of_quantification || "",
      amount: selectedQuantification.amount || "",
      liability_detected_for_fy: selectedQuantification.liability_detected_for_fy || "",
    });
    setIsEditing(true);
  };

  const handleUpdateQuantification = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/quantifications/${selectedQuantification.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected quantification data
      handleViewQuantification(selectedQuantification.id);
      // Refresh the list
      fetchQuantifications();
      resetFormData();
      toast.success("Quantification updated successfully");
    } catch (error) {
      console.error("Error updating quantification:", error);
      toast.error(error.message || "Failed to update quantification");
    }
  };

  const confirmDelete = (e, quantification) => {
    e.stopPropagation(); // Prevent card click event
    setQuantificationToDelete(quantification);
    setShowDeleteConfirm(true);
  };

  const handleDeleteQuantification = async () => {
    if (!quantificationToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/quantifications/${quantificationToDelete.id}/`);
      setShowDeleteConfirm(false);
      setQuantificationToDelete(null);
      
      // If we're viewing the deleted quantification, go back to the list
      if (selectedQuantification && selectedQuantification.id === quantificationToDelete.id) {
        setSelectedQuantification(null);
      }
      
      // Refresh the list
      fetchQuantifications();
      toast.success("Quantification deleted successfully");
    } catch (error) {
      console.error("Error deleting quantification:", error);
      toast.error(error.message || "Failed to delete quantification");
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
          Are you sure you want to delete this quantification record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteQuantification}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

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

  if (error && !selectedQuantification && !showAddForm) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (selectedQuantification && isEditing) {
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
              Edit Quantification
            </h2>
          </div>
          <form onSubmit={handleUpdateQuantification} className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Quantification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_quantification"
                    value={formData.date_of_quantification}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
                    onFocus={(e) => e.target.showPicker()}
                    required
                  />
                </div>

                <InputBox
                  name="amount"
                  label="Amount"
                  type="text"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <InputBox
                name="liability_detected_for_fy"
                label="Liability Detected For FY"
                type="text"
                value={formData.liability_detected_for_fy}
                onChange={handleChange}
                required
              />

              <div className="flex justify-end space-x-4 mt-6">
                <CustomButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    resetFormData();
                  }}
                >
                  Cancel
                </CustomButton>
                <CustomButton type="submit" variant="blue">
                  Update Quantification
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (selectedQuantification) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => setSelectedQuantification(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex gap-2">
            <CustomButton
              onClick={handleEditQuantification}
              variant="blue"
              className="flex items-center gap-1"
            >
              <Edit size={16} /> Edit
            </CustomButton>
            <CustomButton
              onClick={(e) => confirmDelete(e, selectedQuantification)}
              variant="red"
              className="flex items-center gap-1"
            >
              <Trash2 size={16} /> Delete
            </CustomButton>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quantification Details</h2>
            <div className="flex items-center mt-1 text-gray-500 text-sm">
              <User size={14} className="mr-1" />
              <span>Added by: {selectedQuantification.added_by || "N/A"}</span>
              <span className="mx-2">|</span>
              <Calendar size={14} className="mr-1" />
              <span>Added on: {new Date(selectedQuantification.added_on).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Quantification</p>
                  <p className="font-medium">
                    {selectedQuantification.date_of_quantification
                      ? new Date(selectedQuantification.date_of_quantification).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">{selectedQuantification.amount || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Liability Detected For FY</p>
                  <p className="font-medium">{selectedQuantification.liability_detected_for_fy || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Investigation ID</p>
                  <p className="font-medium">{selectedQuantification.investigation || "-"}</p>
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
              Add New Quantification
            </h2>
          </div>
          <form onSubmit={handleAddQuantification} className="p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Quantification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_quantification"
                    value={formData.date_of_quantification}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
                    onFocus={(e) => e.target.showPicker()}
                    required
                  />
                </div>

                <InputBox
                  name="amount"
                  label="Amount"
                  type="text"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <InputBox
                name="liability_detected_for_fy"
                label="Liability Detected For FY"
                type="text"
                value={formData.liability_detected_for_fy}
                onChange={handleChange}
                required
              />

              <div className="flex justify-end space-x-4 mt-6">
                <CustomButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    resetFormData();
                  }}
                >
                  Cancel
                </CustomButton>
                <CustomButton type="submit" variant="blue">
                  Add Quantification
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {showDeleteConfirm && <DeleteConfirmationModal />}
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Quantification List</h1>
        <CustomButton
          onClick={() => setShowAddForm(true)}
          variant="blue"
          className="flex items-center gap-1"
        >
          <Plus size={18} /> Add Quantification
        </CustomButton>
      </div>

      {quantifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No quantification records found.</p>
          <CustomButton
            onClick={() => setShowAddForm(true)}
            variant="blue"
            className="mt-4"
          >
            Add First Quantification
          </CustomButton>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    FY
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quantifications.map((quantification) => (
                  <tr 
                    key={quantification.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewQuantification(quantification.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quantification.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {quantification.date_of_quantification 
                          ? new Date(quantification.date_of_quantification).toLocaleDateString() 
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quantification.amount || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{quantification.liability_detected_for_fy || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{quantification.added_by || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewQuantification(quantification.id);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => confirmDelete(e, quantification)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantificationDetails;