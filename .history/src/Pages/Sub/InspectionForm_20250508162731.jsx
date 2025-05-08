import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import CustomDropDown from "../../Utils/UI/CustomDropDown";

const InspectionForm = () => {
  const { fileNumber, inspectionId } = useParams();
  const navigate = useNavigate();
  const isEditMode = inspectionId !== "new";

  const [formData, setFormData] = useState({
    date_of_inspection: "",
    location: "",
    premises: "",
    status: "",
    remarks: "",
    findings: "",
    documents: [],
  });

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchInspectionDetails();
    }
  }, [inspectionId]);

  const fetchInspectionDetails = async () => {
    try {
      const data = await AxiosWrapper('get', `investigation/inspections/${inspectionId}/`);
      setFormData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching inspection details:', error);
      setError(error.message || 'Failed to fetch inspection details');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        await AxiosWrapper('put', `investigation/inspections/${inspectionId}/`, formData);
      } else {
        await AxiosWrapper('post', 'investigation/inspections/', {
          ...formData,
          investigation: fileNumber,
        });
      }
      navigate(`/investigation/${fileNumber}/inspections`);
    } catch (error) {
      console.error('Error submitting inspection:', error);
      setError(error.message || 'Failed to submit inspection');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading inspection details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Inspection' : 'New Inspection'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Update inspection details' : 'Fill in the details to create a new inspection'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Inspection <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_inspection"
                value={formData.date_of_inspection}
                onChange={handleDateChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <InputBox
              name="location"
              label="Location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <InputBox
              name="premises"
              label="Premises"
              type="text"
              value={formData.premises}
              onChange={handleChange}
              required
            />

            <CustomDropDown
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "pending", label: "Pending" },
                { value: "in_progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              required
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                rows="3"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Findings
              </label>
              <textarea
                name="findings"
                rows="4"
                value={formData.findings}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <CustomButton
            type="button"
            onClick={() => navigate(`/investigation/${fileNumber}/inspections`)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              isEditMode ? 'Update Inspection' : 'Create Inspection'
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default InspectionForm; 