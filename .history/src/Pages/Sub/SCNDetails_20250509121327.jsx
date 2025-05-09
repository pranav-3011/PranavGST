import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, DollarSign, Edit, Trash2, User, FileWarning, Hash, X } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const SCNDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [scns, setScns] = useState([]);
  const [selectedScn, setSelectedScn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scnToDelete, setScnToDelete] = useState(null);
  
  // Initial form data with empty noticees array
  const [formData, setFormData] = useState({
    din_on_authorization: "",
    scn_issued_date: "",
    scn_issued_by: "",
    scn_issued_under_section: "",
    drc_01_portal_reference_number: "",
    noticees: [{
      name_of_noticee: "",
      address: "",
      amounts: [{
        amount_type: "",
        amount: "",
        description: ""
      }]
    }]
  });

  // Reset form data to initial state
  const resetFormData = () => {
    setFormData({
      din_on_authorization: "",
      scn_issued_date: "",
      scn_issued_by: "",
      scn_issued_under_section: "",
      drc_01_portal_reference_number: "",
      noticees: [{
        name_of_noticee: "",
        address: "",
        amounts: [{
          amount_type: "",
          amount: "",
          description: ""
        }]
      }]
    });
  };

  // Fetch SCNs on component mount
  useEffect(() => {
    if (fileNumber) {
      fetchScns();
    }
  }, [fileNumber]);

  // Function to fetch SCNs list
  const fetchScns = async () => {
    try {
      const data = await AxiosWrapper(
        "get",
        `investigation/scns/investigation/${fileNumber}/`
      );
      setScns(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching SCNs:", error);
      setError(error.message || "Failed to fetch SCNs");
      toast.error(error.message || "Failed to fetch SCNs");
      setIsLoading(false);
    }
  };

  // Function to add a new SCN
  const handleAddScn = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("post", "investigation/scns/", {
        ...formData,
        investigation: fileNumber,
      });
      setShowAddForm(false);
      resetFormData();
      fetchScns();
      toast.success("SCN added successfully");
    } catch (error) {
      console.error("Error adding SCN:", error);
      setError(error.message || "Failed to add SCN");
      toast.error(error.message || "Failed to add SCN");
    }
  };

  // Function to view SCN details
  const handleViewScn = async (id) => {
    try {
      const data = await AxiosWrapper("get", `investigation/scns/${id}/`);
      setSelectedScn(data);
    } catch (error) {
      console.error("Error fetching SCN details:", error);
      setError(error.message || "Failed to fetch SCN details");
      toast.error(error.message || "Failed to fetch SCN details");
    }
  };

  // Function to set up editing form
  const handleEditScn = () => {
    setFormData({
      din_on_authorization: selectedScn.din_on_authorization || "",
      scn_issued_date: selectedScn.scn_issued_date || "",
      scn_issued_by: selectedScn.scn_issued_by || "",
      scn_issued_under_section: selectedScn.scn_issued_under_section || "",
      drc_01_portal_reference_number: selectedScn.drc_01_portal_reference_number || "",
      noticees: selectedScn.noticees || [{
        name_of_noticee: "",
        address: "",
        amounts: [{
          amount_type: "",
          amount: "",
          description: ""
        }]
      }]
    });
    setIsEditing(true);
  };

  // Function to update an SCN
  const handleUpdateScn = async (e) => {
    e.preventDefault();
    try {
      await AxiosWrapper("put", `investigation/scns/${selectedScn.id}/`, {
        ...formData,
        investigation: fileNumber,
      });
      setIsEditing(false);
      // Refresh the selected SCN data
      handleViewScn(selectedScn.id);
      // Refresh the list
      fetchScns();
      resetFormData();
      toast.success("SCN updated successfully");
    } catch (error) {
      console.error("Error updating SCN:", error);
      toast.error(error.message || "Failed to update SCN");
    }
  };

  // Function to confirm deletion
  const confirmDelete = (e, scn) => {
    e.stopPropagation(); // Prevent card click event
    setScnToDelete(scn);
    setShowDeleteConfirm(true);
  };

  // Function to delete an SCN
  const handleDeleteScn = async () => {
    if (!scnToDelete) return;
    
    try {
      await AxiosWrapper("delete", `investigation/scns/${scnToDelete.id}/`);
      setShowDeleteConfirm(false);
      setScnToDelete(null);
      
      // If we're viewing the deleted SCN, go back to the list
      if (selectedScn && selectedScn.id === scnToDelete.id) {
        setSelectedScn(null);
      }
      
      // Refresh the list
      fetchScns();
      toast.success("SCN deleted successfully");
    } catch (error) {
      console.error("Error deleting SCN:", error);
      toast.error(error.message || "Failed to delete SCN");
      setShowDeleteConfirm(false);
    }
  };

  // Format amount to currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Calculate total amount for a noticee
  const calculateTotalForNoticee = (amounts) => {
    return amounts.reduce((total, amountItem) => {
      return total + (parseFloat(amountItem.amount) || 0);
    }, 0);
  };

  // Calculate total amount for the entire SCN
  const calculateTotalForScn = (noticees) => {
    return noticees.reduce((total, noticee) => {
      return total + (parseFloat(noticee.total_amount) || 0);
    }, 0);
  };

  return <div>Implementation pending</div>;
};

export default SCNDetails;
