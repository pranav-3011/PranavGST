import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, User, Building, MapPin, Phone, Mail, X, Search, Filter, ChevronDown } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";

const InspectionDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredInspections = inspections.filter((inspection) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inspection.purpose_of_visit?.toLowerCase().includes(searchLower) ||
      inspection.officers?.some(
        (officer) =>
          officer.name?.toLowerCase().includes(searchLower) ||
          officer.designation?.toLowerCase().includes(searchLower)
      )
    );
  });

  if (!fileNumber) {
    return (
      <div className="p-4">
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>No investigation selected</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-gray-600">Loading inspections...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (selectedInspection) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <button
            onClick={() => setSelectedInspection(null)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              Inspection Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date of Authorization</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedInspection.date_of_authorization
                      ? new Date(selectedInspection.date_of_authorization).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date of Inspection</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedInspection.date_of_inspection
                      ? new Date(selectedInspection.date_of_inspection).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Purpose of Visit</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedInspection.purpose_of_visit || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">DIN on Authorization</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedInspection.din_on_authorization || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-2">Outcome of Inspection</p>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedInspection.outcome_of_inspection || "-"}</p>
            </div>

            {/* Officers Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Officers
              </h3>
              <div className="space-y-4">
                {selectedInspection.officers?.map((officer, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-gray-900">{officer.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Designation</p>
                      <p className="text-gray-900">{officer.designation || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone Number</p>
                      <p className="text-gray-900">{officer.phone_number || "-"}</p>
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
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(false)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Plus size={24} className="text-blue-600" />
              Add New Inspection
            </h2>
          </div>
          <form onSubmit={handleAddInspection} className="p-6">
            <div className="space-y-6">
              {/* Dates Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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

                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                  <InputBox
                    name="purpose_of_visit"
                    label="Purpose of Visit"
                    type="text"
                    value={formData.purpose_of_visit}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                  <InputBox
                    name="din_on_authorization"
                    label="DIN on Authorization"
                    type="text"
                    value={formData.din_on_authorization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Outcome Section */}
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    Officers
                  </h3>
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
                    <div key={index} className="p-4 bg-gray-50 rounded-lg relative border border-gray-200">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeOfficer(index)}
                          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition-colors"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-sm"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
            <CustomButton
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} />
              Add New Inspection
            </CustomButton>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filter Section */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search inspections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter size={20} />
                Filter
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Inspections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredInspections.map((inspection) => (
              <div
                key={inspection.id}
                onClick={() => handleViewInspection(inspection.id)}
                className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inspection #{inspection.id}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {inspection.date_of_inspection
                        ? new Date(inspection.date_of_inspection).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-blue-600" />
                    <span>
                      Auth: {inspection.date_of_authorization
                        ? new Date(inspection.date_of_authorization).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={16} className="text-blue-600" />
                    <span className="line-clamp-1">{inspection.purpose_of_visit || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} className="text-blue-600" />
                    <span>{inspection.officers?.[0]?.name || "-"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInspections.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-50 rounded-lg inline-block">
                <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No inspections found</p>
                {searchTerm && (
                  <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;

