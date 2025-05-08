import React, { useState, useEffect } from "react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import CustomDropDown from "../../Utils/UI/CustomDropDown";
import { useForm } from "../../Context/FormContext";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, User, Building, Mail, Phone, MapPin, AlertCircle, CheckCircle } from "lucide-react";

const Investigation = () => {
  const {
    formData,
    taxpayerData,
    jurisdictionData,
    sourceOptions,
    divisionOptions,
    rangeOptions,
    isLoading,
    error,
    handleChange,
    handleDateChange,
    handleTaxpayerChange,
    handleJurisdictionChange,
    handleDivisionChange,
    handleSubmit,
    postInvestigation,
    fetchOptions
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("investigation");

  // Fetch options when component mounts
  useEffect(() => {
    fetchOptions();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await postInvestigation();
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit investigation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-7xl">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <h1 className="text-3xl font-bold text-gray-900">
            Investigation Register
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <FileText className="text-blue-500" size={18} />
            Fill in the details below to register a new investigation
          </p>
        </div>
      </motion.div>

      {/* Status Messages */}
      <AnimatePresence>
        <div className="mb-6 space-y-3">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm"
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="ml-3 text-sm text-green-700">Investigation submitted successfully!</p>
              </div>
            </motion.div>
          )}

          {submitError && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm"
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="ml-3 text-sm text-red-700">{submitError}</p>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4 bg-white p-2 rounded-lg shadow-sm" aria-label="Tabs">
          {["investigation", "jurisdiction", "taxpayer"].map((section) => (
            <motion.button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeSection === section
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {section === "investigation" ? "Investigation Details" :
               section === "jurisdiction" ? "Division & Range" :
               "Taxpayer Details"}
            </motion.button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investigation Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all hover:shadow-xl ${
              activeSection === "investigation" ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Investigation Details
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBox
                  name="file_number"
                  label="File No."
                  type="text"
                  value={formData.file_number}
                  onChange={handleChange}
                  required
                />

                <InputBox
                  name="e_office_file_no"
                  label="E-Office File No."
                  type="text"
                  value={formData.e_office_file_no}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Date of Detection <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_detection"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.date_of_detection}
                    onChange={handleDateChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Due Date of SCN
                  </label>
                  <input
                    type="date"
                    name="due_date_of_scn"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.due_date_of_scn}
                    onChange={handleDateChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-blue-500" />
                  Period Involved
                </label>
                <select
                  name="period_involved"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.period_involved}
                  onChange={handleChange}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <InputBox
                name="nature_of_offence"
                label="Nature of Offence"
                type="text"
                value={formData.nature_of_offence}
                onChange={handleChange}
              />
            </div>
          </motion.div>

          {/* Division & Range Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all hover:shadow-xl ${
              activeSection === "jurisdiction" ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg mr-4">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Division & Range
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building size={16} className="text-green-500" />
                  Division Name <span className="text-red-500">*</span>
                </label>
                <CustomDropDown
                  name="division_name"
                  values={divisionOptions}
                  placeholder="Select division"
                  value={jurisdictionData.division_name}
                  onChange={handleDivisionChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building size={16} className="text-green-500" />
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
          </motion.div>

          {/* Taxpayer Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all hover:shadow-xl ${
              activeSection === "taxpayer" ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg mr-4">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Taxpayer Details
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBox
                  name="gstin"
                  label="GSTIN"
                  type="text"
                  value={taxpayerData.gstin}
                  onChange={handleTaxpayerChange}
                  required
                />

                <InputBox
                  name="name"
                  label="Legal Name"
                  type="text"
                  value={taxpayerData.name}
                  onChange={handleTaxpayerChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBox
                  name="email"
                  label="Email"
                  type="email"
                  value={taxpayerData.email}
                  onChange={handleTaxpayerChange}
                />

                <InputBox
                  name="phone_number"
                  label="Phone Number"
                  type="tel"
                  value={taxpayerData.phone_number}
                  onChange={handleTaxpayerChange}
                />
              </div>

              <InputBox
                name="trade_name"
                label="Trade Name"
                type="text"
                value={taxpayerData.trade_name}
                onChange={handleTaxpayerChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-purple-500" />
                  PPoB <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Address"
                  value={taxpayerData.address}
                  onChange={handleTaxpayerChange}
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit Button - Visible only on mobile when in taxpayer section */}
            <div className="mt-8 lg:hidden">
              {activeSection === "taxpayer" && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CustomButton
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : 'Submit Investigation'}
                  </CustomButton>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Submit Button - Visible only on desktop */}
        <div className="mt-8 hidden lg:flex justify-end">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CustomButton
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </div>
              ) : 'Submit Investigation'}
            </CustomButton>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default Investigation;