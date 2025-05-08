import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Paper, Link, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AxiosWrapper } from '../../Utils/Auth/AxiosWrapper';
import AddIcon from '@mui/icons-material/Add';

const EntryDetails = () => {
  const [investigations, setInvestigations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

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
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            borderRadius: 2,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)'
          }}
        >
          {error}
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 2,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
          height: 'calc(100vh - 100px)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Investigation Entries
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/entry-details/investigation')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)'
              }
            }}
          >
            Add Case
          </Button>
        </Box>
        
        <Box sx={{ height: 'calc(100% - 80px)' }}>
          <DataGrid
            rows={investigations}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            loading={isLoading}
            getRowId={(row) => row.id}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.default,
                borderRadius: 1,
                '& .MuiDataGrid-columnHeader': {
                  py: 2
                }
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              },
              '& .MuiDataGrid-cell': {
                borderColor: theme.palette.divider
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${theme.palette.divider}`
              }
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default EntryDetails;
