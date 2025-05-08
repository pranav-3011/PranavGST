import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, Eye, Calendar, MapPin, Building, User } from "lucide-react";
import CustomButton from "../../Utils/UI/CustomButton";

const InspectionDetails = () => {
  const { fileNumber } = useParams();
  const [inspections, setInspections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

  useEffect(() => {
    fetchInspections();
  }, [fileNumber]);

  const fetchInspections = async () => {
    try {
      const data = await AxiosWrapper('get', `investigation/inspections/investigation/${fileNumber}/`);
      setInspections(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setError(error.message || 'Failed to fetch inspections');
      setIsLoading(false);
    }
  };

  const handleAddInspection = async (formData) => {
    try {
      await AxiosWrapper('post', 'investigation/inspections/', formData);
      setShowAddForm(false);
      fetchInspections();
    } catch (error) {
      console.error('Error adding inspection:', error);
      setError(error.message || 'Failed to add inspection');
    }
  };

  const handleViewInspection = async (id) => {
    try {
      const data = await AxiosWrapper('get', `investigation/inspections/${id}/`);
      setSelectedInspection(data);
    } catch (error) {
      console.error('Error fetching inspection details:', error);
      setError(error.message || 'Failed to fetch inspection details');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading inspections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inspection Details</h1>
        <CustomButton
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Inspection
        </CustomButton>
      </div>

      {/* Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inspections.map((inspection) => (
          <div
            key={inspection.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewInspection(inspection.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Inspection #{inspection.id}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(inspection.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{inspection.location || 'No location specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{inspection.inspector || 'No inspector assigned'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Inspection Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Inspection</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddInspection(Object.fromEntries(formData));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspector <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="inspector"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <CustomButton
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Inspection
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Inspection Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Inspection Details</h2>
              <button
                onClick={() => setSelectedInspection(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(selectedInspection.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{selectedInspection.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-gray-500" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Inspector</p>
                    <p className="font-medium">{selectedInspection.inspector}</p>
                  </div>
                </div>
              </div>
              {selectedInspection.remarks && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Remarks</h3>
                  <p className="text-gray-600">{selectedInspection.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionDetails;
