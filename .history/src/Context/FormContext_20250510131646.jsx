import React, { createContext, useContext, useState, useCallback } from 'react';
import { AxiosWrapper } from '../Utils/Auth/AxiosWrapper';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  // Get current date in YYYY-MM-DD format for date inputs
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Form state for main form
  const [formData, setFormData] = useState({
    source: "",
    file_number: "",
    e_office_file_no: "",
    date_of_detection: "",
    due_date_of_scn: "",
    nature_of_offence: "",
    period_involved: "",
  });

  // State for taxpayer details
  const [taxpayerData, setTaxpayerData] = useState({
    gstin: "",
    name: "",
    trade_name: "",
    email: "",
    phone_number: "",
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

  // State for dropdown options
  const [sourceOptions, setSourceOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch source and division options
  const fetchOptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch source options
      const sourceData = await AxiosWrapper('get', 'investigation/sources/');
      setSourceOptions(sourceData.map(source => ({
        value: source.id.toString(),
        label: source.name
      })));

      // Fetch division options
      const divisionData = await AxiosWrapper('get', 'investigation/divisions/');
      setDivisionOptions(divisionData.map(division => ({
        value: division.id.toString(),
        label: division.name
      })));

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching options:', error);
      setError('Failed to load form options');
      setIsLoading(false);
    }
  }, []);

  // Function to fetch ranges
  const fetchRanges = async (divisionId) => {
    if (!divisionId) {
      setRangeOptions([]);
      return;
    }

    try {
      const rangeData = await AxiosWrapper('get', `investigation/ranges/division/${divisionId}/`);
      setRangeOptions(rangeData.map(range => ({
        value: range.id.toString(),
        label: range.name
      })));
    } catch (error) {
      console.error('Error fetching ranges:', error);
      setError('Failed to load range options');
      setRangeOptions([]);
    }
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle date changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
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

  // Handle jurisdiction data changes
  const handleJurisdictionChange = (e) => {
    const { name, value } = e.target;
    setJurisdictionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle division changes
  const handleDivisionChange = (e) => {
    const { name, value } = e.target;
    setJurisdictionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    fetchRanges(value);
  };

  // Handle contact person data changes
  const handleContactPersonChange = (e) => {
    const { name, value } = e.target;
    setContactPersonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Post investigation entry
  const postInvestigation = async () => {
    try {
      // // Format period_involved as YYYY-MM-DD
      // const formattedPeriod = formData.period_involved.split('T')[0];

      const data = await AxiosWrapper('post', 'investigation/investigations/', {
        taxpayers: [
          {
            gstin: taxpayerData.gstin,
            name: taxpayerData.name,
            trade_name: taxpayerData.trade_name,
            email: taxpayerData.email,
            phone_number: taxpayerData.phone_number,
            address: taxpayerData.address,
            division: parseInt(jurisdictionData.division_name) || 0,
            range: parseInt(jurisdictionData.range_name) || 0
          }
        ],
        file_number: formData.file_number,
        e_office_file_no: formData.e_office_file_no,
        date_of_detection: formData.date_of_detection,
        nature_of_offence: formData.nature_of_offence,
        period_involved: formData.period_involved,
        source: parseInt(formData.source) || 0
      });

      resetForm(); // Reset form after successful submission
      return data;
    } catch (error) {
      console.error('Error posting investigation:', error);
      throw error;
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      source: "",
      file_number: "",
      e_office_file_no: "",
      date_of_detection: "",
      due_date_of_scn: "",
      nature_of_offence: "",
      period_involved: "",  
    });
    setTaxpayerData({
      gstin: "",
      name: "",
      trade_name: "",
      address: "",
    });
    setJurisdictionData({
      division_name: "",
      range_name: "",
    });
    setContactPersonData({
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone_number: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e, formType) => {
    e.preventDefault();
    if (formType === 'investigation') {
      try {
        await postInvestigation();
        console.log('Investigation posted successfully');
      } catch (error) {
        console.error('Error in form submission:', error);
      }
    } else {
      const completeData = {
        [formType]: formData,
        taxpayer: taxpayerData,
        jurisdiction: jurisdictionData,
        contactPerson: contactPersonData,
      };
      console.log("Form data submitted:", completeData);
    }
  };

  const value = {
    formData,
    taxpayerData,
    jurisdictionData,
    contactPersonData,
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
    handleContactPersonChange,
    handleSubmit,
    postInvestigation,
    resetForm,
    fetchOptions,
    fetchRanges
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}; 