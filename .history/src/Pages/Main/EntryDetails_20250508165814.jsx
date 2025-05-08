import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Link, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AxiosWrapper } from '../../Utils/Auth/AxiosWrapper';

const EntryDetails = () => {
  const [investigations, setInvestigations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const data = await AxiosWrapper('get', 'investigation/investigations/');
        setInvestigations(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching investigations:', error);
        setError(error.message || 'Failed to fetch investigations');
        setIsLoading(false);
      }
    };

    fetchInvestigations();
  }, []);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No',
      width: 70,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1
    },
    { 
      field: 'file_number', 
      headerName: 'File Number', 
      width: 130,
      renderCell: (params) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/investigation/${params.row.id}`)}
          sx={{ textDecoration: 'none', color: 'primary.main' }}
        >
          {params.row?.file_number || '-'}
        </Link>
      )
    },
    { 
      field: 'e_office_file_no', 
      headerName: 'E-Office File No.', 
      width: 150,
      renderCell: (params) => params.row?.e_office_file_no || '-'
    },
    { 
      field: 'date_of_detection', 
      headerName: 'Date of Detection', 
      width: 150,
      renderCell: (params) => {
        if (!params.row?.date_of_detection) return '-';
        return new Date(params.row.date_of_detection).toLocaleDateString();
      }
    },
    { 
      field: 'nature_of_offence', 
      headerName: 'Nature of Offence', 
      width: 200,
      renderCell: (params) => params.row?.nature_of_offence || '-'
    },
    { 
      field: 'period_involved', 
      headerName: 'Period Involved', 
      width: 150,
      renderCell: (params) => {
        if (!params.row?.period_involved) return '-';
        return new Date(params.row.period_involved).toLocaleDateString();
      }
    },
    { 
      field: 'taxpayer_name', 
      headerName: 'Taxpayer Name', 
      width: 200,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        return taxpayers[0]?.name || '-';
      }
    },
    { 
      field: 'gstin', 
      headerName: 'GSTIN', 
      width: 150,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        return taxpayers[0]?.gstin || '-';
      }
    },
    { 
      field: 'trade_name', 
      headerName: 'Trade Name', 
      width: 150,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        return taxpayers[0]?.trade_name || '-';
      }
    },
    { 
      field: 'division_name', 
      headerName: 'Division', 
      width: 130,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        return taxpayers[0]?.division_name || '-';
      }
    },
    { 
      field: 'range_name', 
      headerName: 'Range', 
      width: 130,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        return taxpayers[0]?.range_name || '-';
      }
    },
    { 
      field: 'source_name', 
      headerName: 'Source', 
      width: 130,
      renderCell: (params) => params.row?.source_name || '-'
    },
    { 
      field: 'currently_assigned_officer', 
      headerName: 'Assigned Officer', 
      width: 150,
      renderCell: (params) => params.row?.currently_assigned_officer || '-'
    },
  ];

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          {error}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Investigation Entries
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/investigation')}
        >
          Add Case
        </Button>
      </Box>
      
      <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={investigations}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={isLoading}
          getRowId={(row) => row.id}
          // density="compact"
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default EntryDetails;
