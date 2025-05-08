import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, Building, MapPin, Phone, Mail, X } from "lucide-react";
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
    officers: [{ name: "", designation: "", phone_number: "" }],
    date_of_authorization: "",
    purpose_of_visit: "",
    din_on_authorization: "",
    date_of_inspection: "",
    outcome_of_inspection: "",
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
        officers: [{ name: "", designation: "", phone_number: "" }],
        date_of_authorization: "",
        purpose_of_visit: "",
        din_on_authorization: "",
        date_of_inspection: "",
        outcome_of_inspection: "",
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

  const handleOfficerChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedOfficers = [...prev.officers];
      updatedOfficers[index] = {
        ...updatedOfficers[index],
        [field]: value,
      };
      return {
        ...prev,
        officers: updatedOfficers,
      };
    });
  };

  const addOfficer = () => {
    setFormData((prev) => ({
      ...prev,
      officers: [...prev.officers, { name: "", designation: "", phone_number: "" }],
    }));
  };

  const removeOfficer = (index) => {
    setFormData((prev) => ({
      ...prev,
      officers: prev.officers.filter((_, i) => i !== index),
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
                  <p className="text-sm text-gray-600">Date of Authorization</p>
                  <p className="font-medium">
                    {selectedInspection.date_of_authorization
                      ? new Date(selectedInspection.date_of_authorization).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
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
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Purpose of Visit</p>
                  <p className="font-medium">{selectedInspection.purpose_of_visit || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">DIN on Authorization</p>
                  <p className="font-medium">{selectedInspection.din_on_authorization || "-"}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="text-gray-500" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Outcome of Inspection</p>
                  <p className="font-medium">{selectedInspection.outcome_of_inspection || "-"}</p>
                </div>
              </div>
            </div>

            {/* Officers Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Officers</h3>
              <div className="space-y-4">
                {selectedInspection.officers?.map((officer, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{officer.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium">{officer.designation || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{officer.phone_number || "-"}</p>
                    </div>
                  </div>
                ))}
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
            <div className="space-y-6">
              {/* Dates Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Authorization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_authorization"
                    value={formData.date_of_authorization}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

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
              </div>

              {/* Purpose and DIN Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox
                  name="purpose_of_visit"
                  label="Purpose of Visit"
                  type="text"
                  value={formData.purpose_of_visit}
                  onChange={handleChange}
                  required
                />

                <InputBox
                  name="din_on_authorization"
                  label="DIN on Authorization"
                  type="text"
                  value={formData.din_on_authorization}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Outcome Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outcome of Inspection <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="outcome_of_inspection"
                  value={formData.outcome_of_inspection}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Officers Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Officers</h3>
                  <CustomButton
                    type="button"
                    onClick={addOfficer}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Add Officer
                  </CustomButton>
                </div>

                <div className="space-y-4">
                  {formData.officers.map((officer, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeOfficer(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                        >
                          <X size={20} />
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputBox
                          name={`officer_name_${index}`}
                          label="Name"
                          type="text"
                          value={officer.name}
                          onChange={(e) => handleOfficerChange(index, "name", e.target.value)}
                          required
                        />
                        <InputBox
                          name={`officer_designation_${index}`}
                          label="Designation"
                          type="text"
                          value={officer.designation}
                          onChange={(e) => handleOfficerChange(index, "designation", e.target.value)}
                          required
                        />
                        <InputBox
                          name={`officer_phone_${index}`}
                          label="Phone Number"
                          type="text"
                          value={officer.phone_number}
                          onChange={(e) => handleOfficerChange(index, "phone_number", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
                <Calendar size={16} />
                <span>
                  Auth: {inspection.date_of_authorization
                    ? new Date(inspection.date_of_authorization).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} />
                <span>{inspection.purpose_of_visit || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{inspection.officers?.[0]?.name || "-"}</span>
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
