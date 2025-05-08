import React, { useState, useEffect } from "react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import CustomDropDown from "../../Utils/UI/CustomDropDown";
import { useForm } from "../../Context/FormContext";

const Investigation = () => {
  const {
    formData,
    taxpayerData,
    jurisdictionData,
    handleChange,
    handleDateChange,
    handleTaxpayerChange,
    handleJurisdictionChange,
    handleSubmit,
  } = useForm();

  // State for dropdown options
  const [sourceOptions, setSourceOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch source and division options when component mounts
  useEffect(() => {
    setSourceOptions([
      { value: "1", label: "Intelligence" },
      { value: "2", label: "CIU" },
      { value: "3", label: "DGARM" },
      { value: "4", label: "Informant/Complaint" },
      { value: "5", label: "Reference from other Commissionerate" },
    ]);

    setDivisionOptions([
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
    ]);

    setRangeOptions([
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
    ]);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit investigation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-2">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Investigation Register
        </h1>
      </div>

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Investigation submitted successfully!
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Investigation Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Investigation Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <CustomDropDown
                    name="source"
                    values={sourceOptions}
                    placeholder="Select source"
                    value={formData.source}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <InputBox
                  name="file_number"
                  label="File No."
                  type="text"
                  placeholder="Enter file number"
                  value={formData.file_number}
                  onChange={handleChange}
                />

                <InputBox
                  name="e_office_file_no"
                  label="E-Office File No."
                  type="text"
                  placeholder="Enter e-office file number"
                  value={formData.e_office_file_no}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Detection
                  </label>
                  <input
                    type="date"
                    name="date_of_detection"
                    className="w-full border border-gray-600 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    value={formData.date_of_detection}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date of SCN
                  </label>
                  <input
                    type="date"
                    name="due_date_of_scn"
                    className="w-full border border-gray-600 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    value={formData.due_date_of_scn}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period Involved
                  </label>
                  <input
                    type="date"
                    name="period_involved"
                    className="w-full border border-gray-600 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    value={formData.period_involved}
                    onChange={handleDateChange}
                  />
                </div>

                <InputBox
                  name="nature_of_offence"
                  label="Nature of Offence"
                  type="text"
                  placeholder="Enter nature of offence"
                  value={formData.nature_of_offence}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Division & Range Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Division & Range
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division Name
                  </label>
                  <CustomDropDown
                    name="division_name"
                    values={divisionOptions}
                    placeholder="Select division"
                    value={jurisdictionData.division_name}
                    onChange={handleJurisdictionChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Range Name
                  </label>
                  <CustomDropDown
                    name="range_name"
                    values={rangeOptions}
                    placeholder="Select range"
                    value={jurisdictionData.range_name}
                    onChange={handleJurisdictionChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Taxpayer Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Taxpayer Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputBox
                  name="gstin"
                  label="GSTIN"
                  type="text"
                  placeholder="Enter GSTIN"
                  value={taxpayerData.gstin}
                  onChange={handleTaxpayerChange}
                />

                <InputBox
                  name="name"
                  label="Legal Name"
                  type="text"
                  placeholder="Enter name"
                  value={taxpayerData.name}
                  onChange={handleTaxpayerChange}
                />

                <InputBox
                  name="trade_name"
                  label="Trade Name"
                  type="text"
                  placeholder="Enter trade name"
                  value={taxpayerData.trade_name}
                  onChange={handleTaxpayerChange}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PPoB
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Enter address"
                    value={taxpayerData.address}
                    onChange={handleTaxpayerChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <CustomButton
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 rounded-md font-medium transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </CustomButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Investigation;
