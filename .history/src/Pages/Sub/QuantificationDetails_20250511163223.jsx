import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Tag, DollarSign, Edit, Trash2 } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

// Form component outside of main component to prevent re-creation on every render
const DetectionForm = ({ onSubmit, submitButtonText, formData, handleChange }) => (
  <form onSubmit={onSubmit} className="p-4">
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Detection <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date_of_detection"
            value={formData.date_of_detection}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 date-picker"
            onFocus={(e) => e.target.showPicker()}
            required
          />
        </div>
        <InputBox
          name="detection_type"
          label="Detection Type"
          type="text"
          value={formData.detection_type}
          onChange={handleChange}
          required
          maxLength={50}
        />
      </div>

      <InputBox
        name="liability_detected_for_fy"
        label="Liability Detected for FY"
        type="text"
        value={formData.liability_detected_for_fy}
        onChange={handleChange}
        required
        maxLength={100}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InputBox
          name="igst"
          label="IGST Amount"
          type="number"
          value={formData.igst}
          onChange={handleChange}
          required
          className="md:col-span-1"
        />
        <InputBox
          name="cgst"
          label="CGST Amount"
          type="number"
          value={formData.cgst}
          onChange={handleChange}
          required
          className="md:col-span-1"
        />
        <InputBox
          name="sgst"
          label="SGST Amount"
          type="number"
          value={formData.sgst}
          onChange={handleChange}
          required
          className="md:col-span-1"
        />
        <InputBox
          name="cess"
          label="CESS Amount"
          type="number"
          value={formData.cess}
          onChange={handleChange}
          required
          className="md:col-span-1"
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

const QuantificationDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [detections, setDetections] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detectionToDelete, setDetectionToDelete] = useState(null);
  const [formData, setFormData] = useState({
    date_of_detection: "",
    detection_type: "",
    liability_detected_for_fy: "",
    igst: 0,
    cgst: 0,
    sgst: 0,
    cess: 0
  });

  // Create a resetForm function to reset form data to initial state
  const resetFormData = () => {
    setFormData({
      date_of_detection: "",
      detection_type: "",
      liability_detected_for_fy: "",
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0
    });
  };

  useEffect(() => {
    if (fileNumber) {
      fetchDetections();
    }
  }, [fileNumber]);

  const fetchDetections = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/detections/investigation/${fileNumber}/`
      );
      setDetections(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching detections:", error);
      setError(error.message || "Failed to fetch detections");
      toast.error(error.message || "Failed to fetch detections");
      setIsLoading(false);
    }
  };

  const handleAddDetection = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/detections/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchDetections();
      toast.success("Detection added successfully");
    } catch (error) {
      console.error("Error adding detection:", error);
      setError(error.message || "Failed to add detection");
      toast.error(error.message || "Failed to add detection");
    }
  };

  const handleViewDetection = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/detections/${id}/`);
      setSelectedDetection(data);
    } catch (error) {
      console.error("Error fetching detection details:", error);
      setError(error.message || "Failed to fetch detection details");
      toast.error(error.message || "Failed to fetch detection details");
    }
  };

  const handleEditDetection = () => {
    setFormData({
      date_of_detection: selectedDetection.date_of_detection || "",
      detection_type: selectedDetection.detection_type || "",
      liability_detected_for_fy: selectedDetection.liability_detected_for_fy || "",
      igst: selectedDetection.igst || 0,
      cgst: selectedDetection.cgst || 0,
      sgst: selectedDetection.sgst || 0,
      cess: selectedDetection.cess || 0
    });
    setIsEditing(true);
  };

  const handleUpdateDetection = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/detections/${selectedDetection.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      handleViewDetection(selectedDetection.id);
      fetchDetections();
      resetFormData();
      toast.success("Detection updated successfully");
    } catch (error) {
      console.error("Error updating detection:", error);
      toast.error(error.message || "Failed to update detection");
    }
  };

  const confirmDelete = (e, detection) => {
    e.stopPropagation();
    setDetectionToDelete(detection);
    setShowDeleteConfirm(true);
  };

  const handleDeleteDetection = async () => {
    if (!detectionToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/detections/${detectionToDelete.id}/`);
      setShowDeleteConfirm(false);
      setDetectionToDelete(null);
      
      if (selectedDetection && selectedDetection.id === detectionToDelete.id) {
        setSelectedDetection(null);
      }
      
      fetchDetections();
      toast.success("Detection deleted successfully");
    } catch (error) {
      console.error("Error deleting detection:", error);
      toast.error(error.message || "Failed to delete detection");
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  // Calculate total amount
  const getTotalAmount = (detection) => {
    const igst = parseInt(detection.igst) || 0;
    const sgst = parseInt(detection.sgst) || 0;
    const cgst = parseInt(detection.cgst) || 0;
    const cess = parseInt(detection.cess) || 0;
    return igst + sgst + cgst + cess;
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

  if (error && !selectedDetection && !showAddForm) {
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
          Are you sure you want to delete this detection record? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteDetection}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (selectedDetection && isEditing) {
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
              Edit Detection
            </h2>
          </div>
          <DetectionForm 
            onSubmit={handleUpdateDetection} 
            submitButtonText="Update Detection" 
            formData={formData}
            handleChange={handleChange}
          />
        </div>
      </div>
    );
  }

  if (selectedDetection) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 flex justify-between">
          <button
            onClick={() => setSelectedDetection(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleEditDetection}
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
              Detection Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Detection</p>
                  <p className="font-medium">
                    {selectedDetection.date_of_detection
                      ? new Date(selectedDetection.date_of_detection).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Detection Type</p>
                  <p className="font-medium">{selectedDetection.detection_type || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Liability Detected for FY</p>
                  <p className="font-medium">{selectedDetection.liability_detected_for_fy || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Added On</p>
                  <p className="font-medium">
                    {selectedDetection.added_on
                      ? new Date(selectedDetection.added_on).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Amounts</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-blue-500" size={18} />
                    <p className="font-medium">IGST</p>
                  </div>
                  <p className="text-xl font-bold">₹{selectedDetection.igst?.toLocaleString() || "0"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-green-500" size={18} />
                    <p className="font-medium">CGST</p>
                  </div>
                  <p className="text-xl font-bold">₹{selectedDetection.cgst?.toLocaleString() || "0"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-purple-500" size={18} />
                    <p className="font-medium">SGST</p>
                  </div>
                  <p className="text-xl font-bold">₹{selectedDetection.sgst?.toLocaleString() || "0"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-orange-500" size={18} />
                    <p className="font-medium">CESS</p>
                  </div>
                  <p className="text-xl font-bold">₹{selectedDetection.cess?.toLocaleString() || "0"}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-blue-600" size={20} />
                  <p className="font-semibold">Total Amount</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{selectedDetection.total_amount?.toLocaleString() || getTotalAmount(selectedDetection).toLocaleString()}
                </p>
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
              Add New Detection
            </h2>
          </div>
          <DetectionForm 
            onSubmit={handleAddDetection} 
            submitButtonText="Add Detection" 
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
        <h1 className="text-2xl font-bold text-gray-800">Quantification Details</h1>
        <CustomButton
          onClick={() => {
            resetFormData();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Detection
        </CustomButton>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Detection
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detection Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liability for FY
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IGST
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CGST
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SGST
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CESS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detections.map((detection) => (
                <tr key={detection.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetection(detection.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {detection.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {detection.date_of_detection ? new Date(detection.date_of_detection).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {detection.detection_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {detection.liability_detected_for_fy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{detection.igst?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{detection.cgst?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{detection.sgst?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{detection.cess?.toLocaleString() || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    ₹{detection.total_amount?.toLocaleString() || getTotalAmount(detection).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetection(detection.id);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => confirmDelete(e, detection)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detections.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No detections found</p>
        </div>
      )}
    </div>
  );
};

export default QuantificationDetails;