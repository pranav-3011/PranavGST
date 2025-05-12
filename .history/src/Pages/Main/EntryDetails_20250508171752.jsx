import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Link, Button, Chip } from '@mui/material';
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
      headerName: '#',
      width: 50,
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1
    },
    { 
      field: 'file_number', 
      headerName: 'File No.', 
      width: 110,
      renderCell: (params) => (
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/investigation/${params.row.id}`)}
          sx={{ textDecoration: 'none', fontWeight: 'medium' }}
        >
          {params.row?.file_number || '-'}
        </Link>
      )
    },
    { 
      field: 'e_office_file_no', 
      headerName: 'E-Office No.', 
      width: 120
    },
    { 
      field: 'date_of_detection', 
      headerName: 'Detection Date', 
      width: 120,
      renderCell: (params) => {
        if (!params.row?.date_of_detection) return '-';
        return new Date(params.row.date_of_detection).toLocaleDateString();
      }
    },
    { 
      field: 'nature_of_offence', 
      headerName: 'Offence Type', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.row?.nature_of_offence || 'N/A'} 
          size="small" 
          variant="outlined"
          color="primary"
        />
      )
    },
    { 
      field: 'taxpayer_name', 
      headerName: 'Taxpayer', 
      width: 180,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        return taxpayers[0]?.name || '-';
      }
    },
    { 
      field: 'gstin', 
      headerName: 'GSTIN', 
      width: 130,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        return taxpayers[0]?.gstin || '-';
      }
    },
    { 
      field: 'division_range', 
      headerName: 'Division/Range', 
      width: 150,
      renderCell: (params) => {
        const taxpayers = params.row?.taxpayers || [];
        const division = taxpayers[0]?.division_name || '-';
        const range = taxpayers[0]?.range_name || '-';
        return `${division}/${range}`;
      }
    },
    { 
      field: 'source_name', 
      headerName: 'Source', 
      width: 100
    },
    { 
      field: 'currently_assigned_officer', 
      headerName: 'Assigned To', 
      width: 130
    },
  ];

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          {error}
        </Paper>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ height: '100%', width: '100%', p: 2, borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h1" fontWeight="medium">
          Investigation Entries
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          size="small"
          onClick={() => navigate('/entry-details/investigation')}
        >
          Add Case
        </Button>
      </Box>
      
      <Box sx={{ height: 'calc(100vh - 180px)', width: '100%' }}>
        <DataGrid
          rows={investigations}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15, 25, 50]}
          disableSelectionOnClick
          loading={isLoading}
          getRowId={(row) => row.id}
          density="compact"
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.lightest',
              borderRadius: 1,
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9f9f9',
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default EntryDetails;
