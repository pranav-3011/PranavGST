import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosWrapper } from '../../Utils/Auth/AxiosWrapper';
import { Plus, Edit, Trash2, Eye, ChevronRight, FileText, User, Building, Calendar, Phone, Mail, MapPin } from 'lucide-react';

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
  }, [fileNumber]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const actionButtons = [
    { name: 'Summons Details', component: SummonsDetails },
    { name: 'Inspection Details', component: InspectionDetails },
    { name: 'Search Details', component: SearchDetails },
    { name: 'Seizure Details', component: SeizureDetails },
    { name: 'Letter To Other Formation', component: LetterToOtherFormation },
    { name: 'ITC Block Unblock Details', component: ITCBlockUnblockDetails },
    { name: 'DRC Details', component: DrcDetails },
    { name: 'Quantification Details', component: QuantificationDetails },



    { name: 'Recovery Details', component: RecoveryDetails },
    // { name: 'Investigation Register', component: InvestigationRegister },
    // { name: 'Source', component: Source },
    { name: 'Taxpayer Details', component: TaxpayerDetails },
    // { name: 'Division', component: Division },
    // { name: 'Range', component: Range },
    // { name: 'Contact Person', component: ContactPerson },
    
    // { name: 'Office Conducted Inspection', component: OfficeConductedInspection },
    
    // { name: 'Office Conducted Search', component: OfficeConductedSearch },
    
    
    
    // { name: 'Statement Details', component: SatementDetails },
    
    { name: 'Advisory Details', component: AdvisoryDetails },
    { name: 'SCN Details', component: SCNDetails },
    
    
    // { name: 'Noticee Details', component: NoticeeDetails },
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
      <div className="mb-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Investigation #{investigation.file_number}
                </h1>
                <p className="text-sm text-gray-600">
                  Detected on {investigation.date_of_detection ? new Date(investigation.date_of_detection).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                <Edit size={18} />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Content */}
        <div className="md:col-span-3">
          {activePage === 'details' ? (
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Case Information
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">File Number</p>
                        <p className="font-medium">{investigation.file_number || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">Date of Detection</p>
                        <p className="font-medium">{investigation.date_of_detection ? new Date(investigation.date_of_detection).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                     
                      <div>
                      <Calendar className="text-gray-500" size={18} />
                        <p className="text-sm text-gray-600">Period From</p>
                        <p className="font-medium">{investigation.from_date ? new Date(investigation.from_date).toLocaleDateString() : '-'}</p>
                      </div>
                   
                   
                     
                      <div>
                        <p className="text-sm text-gray-600">Period To</p>
                        <p className="font-medium">{investigation.to_date ? new Date(investigation.to_date).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">Assigned Officer</p>
                        <p className="font-medium">{investigation.currently_assigned_officer || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">E-Office File No.</p>
                        <p className="font-medium">{investigation.e_office_file_no || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">Nature of Offence</p>
                        <p className="font-medium">{investigation.nature_of_offence || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="text-gray-500" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">Source</p>
                        <p className="font-medium">{investigation.source_name || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taxpayer Details */}
              {investigation.taxpayers && investigation.taxpayers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User size={20} className="text-blue-600" />
                      Taxpayer Information
                    </h2>
                  </div>
                  <div className="p-4">
                    {investigation.taxpayers.map((taxpayer, index) => (
                      <div key={taxpayer.id || index} className="mb-4 last:mb-0">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Building className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">GSTIN</p>
                              <p className="font-medium">{taxpayer.gstin || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Name</p>
                              <p className="font-medium">{taxpayer.name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Building className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Trade Name</p>
                              <p className="font-medium">{taxpayer.trade_name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Email</p>
                              <p className="font-medium">{taxpayer.email || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Phone</p>
                              <p className="font-medium">{taxpayer.phone_number || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Building className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Division</p>
                              <p className="font-medium">{taxpayer.division_name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Building className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Range</p>
                              <p className="font-medium">{taxpayer.range_name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="text-gray-500" size={18} />
                            <div>
                              <p className="text-sm text-gray-600">Address</p>
                              <p className="font-medium">{taxpayer.address || '-'}</p>
                            </div>
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
            <div className="p-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plus size={20} className="text-blue-600" />
                Actions
              </h2>
            </div>
            <div className="p-2">
              {actionButtons.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-sm ${
                    activePage === action.name.toLowerCase().replace(/\s+/g, '-')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{action.name}</span>
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