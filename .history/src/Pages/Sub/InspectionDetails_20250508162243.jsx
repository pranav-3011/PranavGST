import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AxiosWrapper } from "../../Utils/Auth/AxiosWrapper";
import { Plus, Edit, Trash2, Eye, ChevronRight } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper, Link, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import InputBox from "../../Utils/UI/InputBox";
import CustomButton from "../../Utils/UI/CustomButton";

const InspectionDetails = () => {
  const { fileNumber } = useParams();
  const [inspections, setInspections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [formData, setFormData] = useState({
    date_of_inspection: "",
    time_of_inspection: "",
    place_of_inspection: "",
    officer_in_charge: "",
    remarks: "",
  });

  useEffect(() => {
    fetchInspections();
  }, [fileNumber]);

  const fetchInspections = async () => {
    try {
      const data = await AxiosWrapper("get", `investigation/inspections/investigation/${fileNumber}/`);
      setInspections(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching inspections:", error);
      setError(error.message || "Failed to fetch inspections");
      setIsLoading(false);
    }
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedInspection(null);
    setFormData({
      date_of_inspection: "",
      time_of_inspection: "",
      place_of_inspection: "",
      officer_in_charge: "",
      remarks: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedInspection) {
        await AxiosWrapper("put", `investigation/inspections/${selectedInspection.id}/`, formData);
      } else {
        await AxiosWrapper("post", "investigation/inspections/", {
          ...formData,
          investigation: fileNumber,
        });
      }
      handleCloseForm();
      fetchInspections();
    } catch (error) {
      console.error("Error submitting inspection:", error);
      setError(error.message || "Failed to submit inspection");
    }
  };

  const handleEdit = async (inspection) => {
    setSelectedInspection(inspection);
    setFormData({
      date_of_inspection: inspection.date_of_inspection || "",
      time_of_inspection: inspection.time_of_inspection || "",
      place_of_inspection: inspection.place_of_inspection || "",
      officer_in_charge: inspection.officer_in_charge || "",
      remarks: inspection.remarks || "",
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inspection?")) {
      try {
        await AxiosWrapper("delete", `investigation/inspections/${id}/`);
        fetchInspections();
      } catch (error) {
        console.error("Error deleting inspection:", error);
        setError(error.message || "Failed to delete inspection");
      }
    }
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "S.No",
      width: 70,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    {
      field: "date_of_inspection",
      headerName: "Date of Inspection",
      width: 150,
      renderCell: (params) => {
        if (!params.row?.date_of_inspection) return "-";
        return new Date(params.row.date_of_inspection).toLocaleDateString();
      },
    },
    {
      field: "time_of_inspection",
      headerName: "Time of Inspection",
      width: 150,
      renderCell: (params) => params.row?.time_of_inspection || "-",
    },
    {
      field: "place_of_inspection",
      headerName: "Place of Inspection",
      width: 200,
      renderCell: (params) => params.row?.place_of_inspection || "-",
    },
    {
      field: "officer_in_charge",
      headerName: "Officer in Charge",
      width: 200,
      renderCell: (params) => params.row?.officer_in_charge || "-",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 300,
      renderCell: (params) => params.row?.remarks || "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(params.row.id)}
            className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inspection Details</h1>
        <CustomButton
          onClick={handleOpenForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Inspection
        </CustomButton>
      </div>

      <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
        <DataGrid
          rows={inspections}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={isLoading}
          getRowId={(row) => row.id}
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Box>

      {/* Inspection Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedInspection ? "Edit Inspection" : "Add New Inspection"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputBox
                name="date_of_inspection"
                label="Date of Inspection"
                type="date"
                value={formData.date_of_inspection}
                onChange={handleChange}
                required
              />
              <InputBox
                name="time_of_inspection"
                label="Time of Inspection"
                type="time"
                value={formData.time_of_inspection}
                onChange={handleChange}
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
              name="officer_in_charge"
              label="Officer in Charge"
              type="text"
              value={formData.officer_in_charge}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.remarks}
                onChange={handleChange}
              ></textarea>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <CustomButton
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
          >
            {selectedInspection ? "Update" : "Submit"}
          </CustomButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InspectionDetails;
