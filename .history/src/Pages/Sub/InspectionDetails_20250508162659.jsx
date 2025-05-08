import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, Eye, Calendar, MapPin, Building, FileText } from "lucide-react";

const InspectionDetails = () => {
  const { fileNumber } = useParams();
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleAddInspection = () => {
    navigate(`/investigation/${fileNumber}/inspection/new`);
  };

  const handleViewInspection = (inspectionId) => {
    navigate(`/investigation/${fileNumber}/inspection/${inspectionId}`);
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
    <div className="max-w-full mx-auto p-4">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inspections</h1>
          <p className="text-gray-600 mt-1">Manage inspections for investigation #{fileNumber}</p>
        </div>
        <button
          onClick={handleAddInspection}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Inspection
        </button>
      </div>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inspections.map((inspection) => (
          <div
            key={inspection.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewInspection(inspection.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Inspection #{inspection.id}</h3>
                <p className="text-sm text-gray-600">
                  {inspection.date_of_inspection ? new Date(inspection.date_of_inspection).toLocaleDateString() : 'No date'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{inspection.location || 'No location specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building size={16} />
                <span>{inspection.premises || 'No premises specified'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>{inspection.status || 'No status'}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewInspection(inspection.id);
                }}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          </div>
        ))}

        {inspections.length === 0 && (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-500">No inspections found</div>
            <button
              onClick={handleAddInspection}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add First Inspection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectionDetails;
