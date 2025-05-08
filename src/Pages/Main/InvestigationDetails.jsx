import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosWrapper } from '../../Utils/Auth/AxiosWrapper';
import { Plus, Edit, Trash2, Eye, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    // Commented out API call for now
    /*
    const fetchInvestigationDetails = async () => {
      try {
        const data = await AxiosWrapper('get', `investigation/investigations/${fileNumber}/`);
        setInvestigation(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching investigation details:', error);
        setError(error.message || 'Failed to fetch investigation details');
        setIsLoading(false);
      }
    };

    fetchInvestigationDetails();
    */

    // Static data for testing
    const staticData = {
      id: 2,
      taxpayers: [
        {
          id: 2,
          division_name: "D1",
          range_name: "RD1",
          added_on: "2025-05-07T22:58:18.752024+05:30",
          updated_on: "2025-05-07T22:58:18.752037+05:30",
          gstin: "dzcx",
          name: "svdc",
          trade_name: "dsv",
          email: "",
          phone_number: "",
          address: "vscvfccv",
          division: 1,
          range: 1
        }
      ],
      source_name: "DGARM",
      added_by: "admin",
      updated_by: "admin",
      currently_assigned_officer: "admin",
      added_on: "2025-05-07T22:58:18.743794+05:30",
      updated_on: "2025-05-07T22:58:18.743811+05:30",
      file_number: "dvz",
      e_office_file_no: "dvc",
      date_of_detection: "2025-05-08",
      nature_of_offence: "dzv",
      period_involved: "2025-05-08",
      source: 3
    };

    setInvestigation(staticData);
    setIsLoading(false);
  }, [fileNumber]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
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
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="p-4">
        <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          No investigation details found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div 
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setActivePage('details')}
            >
              <h1 className="text-2xl font-semibold text-gray-900">
                Investigation Details
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                File Number: {investigation.file_number}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit size={20} />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="md:col-span-3">
          {activePage === 'details' ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        File Number
                      </label>
                      <p className="text-gray-900 font-medium">{investigation.file_number || '-'}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Detection
                      </label>
                      <p className="text-gray-900 font-medium">
                        {investigation.date_of_detection ? new Date(investigation.date_of_detection).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Period Involved
                      </label>
                      <p className="text-gray-900 font-medium">
                        {investigation.period_involved ? new Date(investigation.period_involved).toLocaleDateString() : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currently Assigned Officer
                      </label>
                      <p className="text-gray-900 font-medium">{investigation.currently_assigned_officer || '-'}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-Office File No.
                      </label>
                      <p className="text-gray-900 font-medium">{investigation.e_office_file_no || '-'}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nature of Offence
                      </label>
                      <p className="text-gray-900 font-medium">{investigation.nature_of_offence || '-'}</p>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Source
                      </label>
                      <p className="text-gray-900 font-medium">{investigation.source_name || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taxpayer Details */}
              {investigation.taxpayers && investigation.taxpayers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Taxpayer Details
                    </h2>
                  </div>
                  <div className="p-6">
                    {investigation.taxpayers.map((taxpayer, index) => (
                      <div key={taxpayer.id || index} className="mb-6 last:mb-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              GSTIN
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.gstin || '-'}</p>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.name || '-'}</p>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Trade Name
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.trade_name || '-'}</p>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.email || '-'}</p>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.phone_number || '-'}</p>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Division
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.division_name || '-'}</p>
                          </div>
                          <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Range
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.range_name || '-'}</p>
                          </div>
                          <div className="md:col-span-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Address
                            </label>
                            <p className="text-gray-900 font-medium">{taxpayer.address || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            renderActivePage()
          )}
        </div>

        {/* Action Buttons Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Actions
              </h2>
            </div>
            <div className="p-2">
              {actionButtons.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activePage === action.name.toLowerCase().replace(/\s+/g, '-')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={18} />
                    <span className="text-sm font-medium">{action.name}</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationDetails;