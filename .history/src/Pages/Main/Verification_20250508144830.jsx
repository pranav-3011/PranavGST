import React, { useState, useEffect } from "react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import CustomDropDown from "../../Utils/UI/CustomDropDown";
import { useForm } from "../../Context/FormContext";

const Verification = () => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("verification");

  // State for dropdown options
  const [sourceOptions, setSourceOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    setIsLoading(false);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await handleSubmit(e, 'verification');
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading form options...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Verification Register
        </h1>
        <p className="text-gray-600 mt-1">Fill in the details below to register a new verification</p>
      </div>

      {/* Status Messages */}
      <div className="mb-6 space-y-3">
        {submitError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Verification submitted successfully!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Section */}
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all ${activeSection === "verification" ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Verification Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source <span className="text-red-500">*</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox
                  name="file_number"
                  label="File No."
                  type="text"
                  placeholder="Enter file number"
                  value={formData.file_number}
                  onChange={handleChange}
                  required
                />

                <InputBox
                  name="e_office_file_no"
                  label="E-Office File No."
                  type="text"
                  placeholder="Enter e-office file number"
                  value={formData.e_office_file_no}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Detection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_detection"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.date_of_detection}
                    onChange={handleDateChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date of SCN
                  </label>
                  <input
                    type="date"
                    name="due_date_of_scn"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.due_date_of_scn}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period Involved
                </label>
                <input
                  type="date"
                  name="period_involved"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all ${activeSection === "jurisdiction" ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Division & Range
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Division Name <span className="text-red-500">*</span>
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
                  Range Name <span className="text-red-500">*</span>
                </label>
                <CustomDropDown
                  name="range_name"
                  values={rangeOptions}
                  placeholder="Select range"
                  value={jurisdictionData.range_name}
                  onChange={handleJurisdictionChange}
                  className="w-full"
                  disabled={!jurisdictionData.division_name}
                />
              </div>
            </div>
          </div>

          {/* Taxpayer Details Section */}
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all ${activeSection === "taxpayer" ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Taxpayer Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputBox
                  name="gstin"
                  label="GSTIN"
                  type="text"
                  placeholder="Enter GSTIN"
                  value={taxpayerData.gstin}
                  onChange={handleTaxpayerChange}
                  required
                />

                <InputBox
                  name="name"
                  label="Legal Name"
                  type="text"
                  placeholder="Enter name"
                  value={taxpayerData.name}
                  onChange={handleTaxpayerChange}
                  required
                />
              </div>

              <InputBox
                name="trade_name"
                label="Trade Name"
                type="text"
                placeholder="Enter trade name"
                value={taxpayerData.trade_name}
                onChange={handleTaxpayerChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PPoB <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter address"
                  value={taxpayerData.address}
                  onChange={handleTaxpayerChange}
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit Button - Visible only on mobile when in taxpayer section */}
            <div className="mt-8 lg:hidden">
              {activeSection === "taxpayer" && (
                <CustomButton
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-sm"
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
                  ) : 'Submit Verification'}
                </CustomButton>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button - Visible only on desktop */}
        <div className="mt-8 hidden lg:flex justify-end">
          <CustomButton
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-sm"
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
            ) : 'Submit Verification'}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default Verification;
