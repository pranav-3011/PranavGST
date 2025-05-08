import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosWrapper } from '../../Utils/Auth/AxiosWrapper';
import { Plus, Edit, Trash2, Eye, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';

// Import sub-pages
import InvestigationRegister from '../Sub/InvestigationRegister';
import Source from '../Sub/Source';
import TaxpayerDetails from '../Sub/TaxpayerDetails';
import Division from '../Sub/Division';
import Range from '../Sub/Range';
import ContactPerson from '../Sub/ContactPerson';
import InspectionDetails from '../Sub/InspectionDetails';
import SearchDetails from '../Sub/SearchDetails';
import OfficeConductedInspection from '../Sub/OfficeConductedInspection';
import SeizureDetails from '../Sub/SeizureDetails';
import OfficeConductedSearch from '../Sub/OfficeConductedSearch';
import DrcDetails from '../Sub/DrcDetails';
import SummonsDetails from '../Sub/SummonsDetails';
import RecoveryDetails from '../Sub/RecoveryDetails';
import SatementDetails from '../Sub/SatementDetails';
import QuantificationDetails from '../Sub/QuantificationDetails';
import AdvisoryDetails from '../Sub/AdvisoryDetails';
import SCNDetails from '../Sub/SCNDetails';
import ITCBlockUnblockDetails from '../Sub/ITCBlockUnblockDetails';
import LetterToOtherFormation from '../Sub/LetterToOtherFormation';
import NoticeeDetails from '../Sub/NoticeeDetails';
import InvolvedPerson from '../Sub/InvolvedPerson';

const InvestigationDetails = () => {
  const { fileNumber } = useParams();
  const navigate = useNavigate();
  const [investigation, setInvestigation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState('details');
  const [actionStatus, setActionStatus] = useState({});

  useEffect(() => {
    const fetchInvestigationDetails = async () => {
      try {
        const data = await AxiosWrapper('get', `investigation/investigations/${fileNumber}/`);
        setInvestigation(data);
        
        // Mock action status - in a real app, this would come from the API
        const mockStatus = {
          'Investigation Register': 'completed',
          'Source': 'completed',
          'Taxpayer Details': 'completed',
          'Division': 'pending',
          'Range': 'pending',
          'Contact Person': 'not-started',
          // Add more statuses as needed
        };
        setActionStatus(mockStatus);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching investigation details:', error);
        setError(error.message || 'Failed to fetch investigation details');
        setIsLoading(false);
      }
    };

    fetchInvestigationDetails();
  }, [fileNumber]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'not-started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="mr-1" />;
      case 'pending': return <Clock size={16} className="mr-1" />;
      case 'not-started': return <XCircle size={16} className="mr-1" />;
      default: return <XCircle size={16} className="mr-1" />;
    }
  };

  const actionButtons = [
    { name: 'Investigation Register', component: InvestigationRegister },
    { name: 'Source', component: Source },
    { name: 'Taxpayer Details', component: TaxpayerDetails },
    { name: 'Division', component: Division },
    { name: 'Range', component: Range },
    { name: 'Contact Person', component: ContactPerson },
    { name: 'Inspection Details', component: InspectionDetails },
    { name: 'Search Details', component: SearchDetails },
    { name: 'Office Conducted Inspection', component: OfficeConductedInspection },
    { name: 'Seizure Details', component: SeizureDetails },
    { name: 'Office Conducted Search', component: OfficeConductedSearch },
    { name: 'DRC Details', component: DrcDetails },
    { name: 'Summons Details', component: SummonsDetails },
    { name: 'Recovery Details', component: RecoveryDetails },
    { name: 'Statement Details', component: SatementDetails },
    { name: 'Quantification Details', component: QuantificationDetails },
    { name: 'Advisory Details', component: AdvisoryDetails },
    { name: 'SCN Details', component: SCNDetails },
    { name: 'ITC Block Unblock Details', component: ITCBlockUnblockDetails },
    { name: 'Letter To Other Formation', component: LetterToOtherFormation },
    { name: 'Noticee Details', component: NoticeeDetails },
    { name: 'Involved Person', component: InvolvedPerson },
  ];

  const handleActionClick = (actionName) => {
    setActivePage(actionName.toLowerCase().replace(/\s+/g, '-'));
  };

  const renderActivePage = () => {
    const action = actionButtons.find(btn => btn.name.toLowerCase().replace(/\s+/g, '-') === activePage);
    if (action) {
      const Component = action.component;
      return <Component fileNumber={fileNumber} />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">No investigation details found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div 
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setActivePage('details')}
            >
              <h1 className="text-2xl font-bold text-gray-900">
                Investigation #{investigation.file_number}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor('pending')}`}>
                  <span className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    In Progress
                  </span>
                </span>
                <span className="text-sm text-gray-600">
                  Created: {new Date(investigation.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                title="Edit"
              >
                <Edit size={18} />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {activePage === 'details' ? (
            <>
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Basic Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailCard label="File Number" value={investigation.file_number} />
                    <DetailCard label="Date of Detection" value={investigation.date_of_detection ? new Date(investigation.date_of_detection).toLocaleDateString() : '-'} />
                    <DetailCard label="Period Involved" value={investigation.period_involved ? new Date(investigation.period_involved).toLocaleDateString() : '-'} />
                    <DetailCard label="Currently Assigned Officer" value={investigation.currently_assigned_officer || '-'} />
                    <DetailCard label="E-Office File No." value={investigation.e_office_file_no || '-'} />
                    <DetailCard label="Nature of Offence" value={investigation.nature_of_offence || '-'} />
                    <DetailCard label="Source" value={investigation.source_name || '-'} />
                    <DetailCard label="Status" value={
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('pending')}`}>
                        In Progress
                      </span>
                    } />
                  </div>
                </div>
              </div>

              {/* Taxpayer Details */}
              {investigation.taxpayers && investigation.taxpayers.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Taxpayer Details
                    </h2>
                  </div>
                  <div className="p-6">
                    {investigation.taxpayers.map((taxpayer, index) => (
                      <div key={taxpayer.id || index} className="mb-6 last:mb-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <DetailCard label="GSTIN" value={taxpayer.gstin || '-'} />
                          <DetailCard label="Name" value={taxpayer.name || '-'} />
                          <DetailCard label="Trade Name" value={taxpayer.trade_name || '-'} />
                          <DetailCard label="Email" value={taxpayer.email || '-'} />
                          <DetailCard label="Phone Number" value={taxpayer.phone_number || '-'} />
                          <DetailCard label="Division" value={taxpayer.division_name || '-'} />
                          <DetailCard label="Range" value={taxpayer.range_name || '-'} />
                          <div className="md:col-span-2">
                            <DetailCard label="Address" value={taxpayer.address || '-'} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            renderActivePage()
          )}
        </div>

        {/* Action Buttons Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Investigation Actions
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {actionButtons.map((action, index) => {
                const status = actionStatus[action.name] || 'not-started';
                return (
                  <button
                    key={index}
                    onClick={() => handleActionClick(action.name)}
                    className={`w-full flex items-center justify-between p-4 transition-colors ${
                      activePage === action.name.toLowerCase().replace(/\s+/g, '-')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-1 rounded-full ${status === 'completed' ? 'bg-green-100 text-green-600' : status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                        {getStatusIcon(status)}
                      </span>
                      <span className="text-sm font-medium">{action.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Card Component
const DetailCard = ({ label, value }) => (
  <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <p className="text-gray-900 font-medium truncate">{value}</p>
  </div>
);

export default InvestigationDetails;