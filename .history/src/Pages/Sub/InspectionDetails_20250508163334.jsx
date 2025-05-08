import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, Building, MapPin, Phone, Mail } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";

const InspectionDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date_of_inspection: "",
    place_of_inspection: "",
    officer_name: "",
    findings: "",
    remarks: "",
  });

  useEffect(() => {
    if (fileNumber) {
      fetchInspections();
    }
  }, [fileNumber]);

  const fetchInspections = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/inspections/investigation/${fileNumber}/`
      );
      setInspections(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching inspections:", error);
      setError(error.message || "Failed to fetch inspections");
      setIsLoading(false);
    }
  };

  const handleAddInspection = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/inspections/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      setFormData({
        date_of_inspection: "",
        place_of_inspection: "",
        officer_name: "",
        findings: "",
        remarks: "",
      });
      fetchInspections();
    } catch (error) {
      console.error("Error adding inspection:", error);
      setError(error.message || "Failed to add inspection");
    }
  };

  const handleViewInspection = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/inspections/${id}/`);
      setSelectedInspection(data);
    } catch (error) {
      console.error("Error fetching inspection details:", error);
      setError(error.message || "Failed to fetch inspection details");
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

  if (error) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (selectedInspection) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <button
            onClick={() => setSelectedInspection(null)}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              Inspection Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Date of Inspection</p>
                  <p className="font-medium">
                    {selectedInspection.date_of_inspection
                      ? new Date(selectedInspection.date_of_inspection).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Place of Inspection</p>
                  <p className="font-medium">{selectedInspection.place_of_inspection || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Officer Name</p>
                  <p className="font-medium">{selectedInspection.officer_name || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Findings</p>
                  <p className="font-medium">{selectedInspection.findings || "-"}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Remarks</p>
                  <p className="font-medium">{selectedInspection.remarks || "-"}</p>
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
            onClick={() => setShowAddForm(false)}
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
              Add New Inspection
            </h2>
          </div>
          <form onSubmit={handleAddInspection} className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Inspection <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_inspection"
                  value={formData.date_of_inspection}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <InputBox
                name="place_of_inspection"
                label="Place of Inspection"
                type="text"
                value={formData.place_of_inspection}
                onChange={handleChange}
                required
              />

              <InputBox
                name="officer_name"
                label="Officer Name"
                type="text"
                value={formData.officer_name}
                onChange={handleChange}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Findings <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="findings"
                  value={formData.findings}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <CustomButton
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Add Inspection
                </CustomButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inspections</h1>
        <CustomButton
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Inspection
        </CustomButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {inspections.map((inspection) => (
          <div
            key={inspection.id}
            onClick={() => handleViewInspection(inspection.id)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inspection #{inspection.id}</p>
                <p className="font-medium">
                  {inspection.date_of_inspection
                    ? new Date(inspection.date_of_inspection).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{inspection.place_of_inspection || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{inspection.officer_name || "-"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {inspections.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No inspections found</p>
        </div>
      )}
    </div>
  );
};

export default InspectionDetails;
