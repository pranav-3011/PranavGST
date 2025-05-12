import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, ArrowLeft, FileText, Calendar, Edit, Trash2, User, FileWarning, Hash, X } from "lucide-react";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";
import { toast } from "react-toastify";

const SummonsDetails = ({ fileNumber }) => {
  const navigate = useNavigate();
  const [summonedPersons, setSummonedPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);

  // Initial form data
  const [formData, setFormData] = useState({
    name_of_person_or_firm: "",
    designation: "",
    investigation: "",
    summons: [{
      date_of_issuing: "",
      summons_for_date: "",
      din_number: "",
      issued_by: "",
      appeared: false,
      statements: [{
        statement_recorded_date: "",
        statement_recorded_by: "",
        documents: [{
          document_name: "",
          document_type: "",
          document_number: ""
        }]
      }]
    }]
  });

  // Reset form data to initial state
  const resetFormData = () => {
    setFormData({
      name_of_person_or_firm: "",
      designation: "",
      investigation: "",
      summons: [{
        date_of_issuing: "",
        summons_for_date: "",
        din_number: "",
        issued_by: "",
        appeared: false,
        statements: [{
          statement_recorded_date: "",
          statement_recorded_by: "",
          documents: [{
            document_name: "",
            document_type: "",
            document_number: ""
          }]
        }]
      }]
    });
  };

  // Handle form input changes for main fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form input changes for summons fields
  const handleSummonsChange = (e, summonsIndex) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        [name]: type === 'checkbox' ? checked : value
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Handle form input changes for statement fields
  const handleStatementChange = (e, summonsIndex, statementIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        [name]: value
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Handle form input changes for document fields
  const handleDocumentChange = (e, summonsIndex, statementIndex, documentIndex) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      const updatedDocuments = [...updatedStatements[statementIndex].documents];
      updatedDocuments[documentIndex] = {
        ...updatedDocuments[documentIndex],
        [name]: value
      };
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        documents: updatedDocuments
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Add new summons
  const addSummons = () => {
    setFormData((prev) => ({
      ...prev,
      summons: [
        ...prev.summons,
        {
          date_of_issuing: "",
          summons_for_date: "",
          din_number: "",
          issued_by: "",
          appeared: false,
          statements: [{
            statement_recorded_date: "",
            statement_recorded_by: "",
            documents: [{
              document_name: "",
              document_type: "",
              document_number: ""
            }]
          }]
        }
      ]
    }));
  };

  // Remove summons
  const removeSummons = (summonsIndex) => {
    setFormData((prev) => {
      if (prev.summons.length <= 1) return prev;
      const updatedSummons = prev.summons.filter((_, index) => index !== summonsIndex);
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Add new statement
  const addStatement = (summonsIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: [
          ...updatedSummons[summonsIndex].statements,
          {
            statement_recorded_date: "",
            statement_recorded_by: "",
            documents: [{
              document_name: "",
              document_type: "",
              document_number: ""
            }]
          }
        ]
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Remove statement
  const removeStatement = (summonsIndex, statementIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      if (updatedSummons[summonsIndex].statements.length <= 1) return prev;
      const updatedStatements = updatedSummons[summonsIndex].statements.filter((_, index) => index !== statementIndex);
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Add new document
  const addDocument = (summonsIndex, statementIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        documents: [
          ...updatedStatements[statementIndex].documents,
          {
            document_name: "",
            document_type: "",
            document_number: ""
          }
        ]
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  // Remove document
  const removeDocument = (summonsIndex, statementIndex, documentIndex) => {
    setFormData((prev) => {
      const updatedSummons = [...prev.summons];
      const updatedStatements = [...updatedSummons[summonsIndex].statements];
      if (updatedStatements[statementIndex].documents.length <= 1) return prev;
      const updatedDocuments = updatedStatements[statementIndex].documents.filter((_, index) => index !== documentIndex);
      updatedStatements[statementIndex] = {
        ...updatedStatements[statementIndex],
        documents: updatedDocuments
      };
      updatedSummons[summonsIndex] = {
        ...updatedSummons[summonsIndex],
        statements: updatedStatements
      };
      return {
        ...prev,
        summons: updatedSummons
      };
    });
  };

  return (
    <div>SummonsDetails</div>
  )
}

export default SummonsDetails