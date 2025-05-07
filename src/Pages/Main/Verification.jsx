import React, { useState, useEffect } from "react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import CustomDropDown from "../../Utils/UI/CustomDropDown";

const Verification = () => {
  // Get current date in YYYY-MM-DD format for date inputs
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State for source options - would typically be fetched from an API
  const [sourceOptions, setSourceOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);

  // Form state for Verification
  const [formData, setFormData] = useState({
    source: "",
    file_number: "",
    e_office_file_no: "",
    date_of_detection: getCurrentDate(),
    due_date_of_scn: getCurrentDate(),
    nature_of_offence: "",
    period_involved: "",
  });

  // State for taxpayer details
  const [taxpayerData, setTaxpayerData] = useState({
    gstin: "",
    name: "",
    trade_name: "",
    address: "",
  });

  // Combined state for division and range
  const [jurisdictionData, setJurisdictionData] = useState({
    division_name: "",
    range_name: "",
  });

  // State for contact person
  const [contactPersonData, setContactPersonData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone_number: "",
  });

  // Handle input changes for Verification form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle date input changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    // Ensure proper date format
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle taxpayer data changes
  const handleTaxpayerChange = (e) => {
    const { name, value } = e.target;
    setTaxpayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle jurisdiction data changes (division and range)
  const handleJurisdictionChange = (e) => {
    const { name, value } = e.target;
    setJurisdictionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle contact person data changes
  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    setContactPersonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const completeData = {
      Verification: formData,
      taxpayer: taxpayerData,
      jurisdiction: jurisdictionData,
      contactPerson: contactPersonData,
    };
    console.log("Form data submitted:", completeData);
  };

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

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Verification Register
        </h1>
        {/* <p className="text-sm text-gray-600 mt-1">
          Please fill in all the required information below
        </p> */}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Verification Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Verification Details
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

                <InputBox
                  name="period_involved"
                  label="Period Involved"
                  type="text"
                  placeholder="Enter period involved"
                  value={formData.period_involved}
                  onChange={handleChange}
                />

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

            {/* Taxpayer Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
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
                  name="legal_name"
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
                    name="PPoB"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Enter address"
                    value={taxpayerData.address}
                    onChange={handleTaxpayerChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Division and Range Combined Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
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

            {/* Contact Person Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Contact Person
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputBox
                  name="first_name"
                  label="First Name"
                  type="text"
                  placeholder="Enter first name"
                  value={contactPersonData.first_name}
                  onChange={handleContactPersonChange}
                />

                <InputBox
                  name="last_name"
                  label="Last Name"
                  type="text"
                  placeholder="Enter last name"
                  value={contactPersonData.last_name}
                  onChange={handleContactPersonChange}
                />

                <InputBox
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  value={contactPersonData.email}
                  onChange={handleContactPersonChange}
                />

                <InputBox
                  name="phone_number"
                  label="Phone Number"
                  type="text"
                  placeholder="Enter phone number"
                  value={contactPersonData.phone_number}
                  onChange={handleContactPersonChange}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    placeholder="Enter address"
                    value={contactPersonData.address}
                    onChange={handleContactPersonChange}
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <CustomButton
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 rounded-md font-medium transition-colors"
              >
                Submit
              </CustomButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Verification;
