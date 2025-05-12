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
import ArrestDetails from '../Sub/ArrestDetails';
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
    { name: 'Arrest Details', component: ArrestDetails },



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
                <FileText className="text-[#00256c]" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Investigation in respect of <span className='bg-blue-100 px-2 rounded-sm'><span className='text-blue-700'>{investigation.taxpayers[0].trade_name}</span></span> having GSTIN <span className='bg-blue-100 px-2 rounded-sm'><span className='text-blue-700'>{investigation.taxpayers[0].gstin}</span></span>
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Detected on {investigation.date_of_detection ? new Date(investigation.date_of_detection).toLocaleDateString() : '-'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    investigation.status === 'Active' ? 'bg-green-100 text-green-800' :
                    investigation.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                    investigation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {investigation.status || 'Not Set'}
                  </span>
                </div>
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
              <div className="bg-white rounded-sm shadow-sm border border-gray-200">
                <div className="p-4 border-b bg-indigo-50 border-gray-100">
                  <h2 className="text-lg font-medium text-[#00256c] flex items-center gap-2">
                    <FileText size={20} className="text-[#00256c]" />
                    Case Information
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                      <FileText className="text-[#00256c]" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">File Number</p>
                        <p className="font-medium text-gray-900">{investigation.file_number || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                      <Calendar className="text-[#00256c]" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Date of Detection</p>
                        <p className="font-medium text-gray-900">{investigation.date_of_detection ? new Date(investigation.date_of_detection).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                      <Calendar className="text-[#00256c]" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Period Involved</p>
                        <p className="font-medium text-gray-900">{investigation.period_involved || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                      <User className="text-[#00256c]" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Assigned Officer</p>
                        <p className="font-medium text-gray-900">{investigation.currently_assigned_officer || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                      <FileText className="text-[#00256c]" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">E-Office File No.</p>
                        <p className="font-medium text-gray-900">{investigation.e_office_file_no || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                      <Building className="text-[#00256c]" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Nature of Offence</p>
                        <p className="font-medium text-gray-900">{investigation.nature_of_offence || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                      <FileText className="text-[#00256c]" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Source</p>
                        <p className="font-medium text-gray-900">
                          {investigation.other_source && investigation.other_source.length > 0 
                            ? investigation.other_source 
                            : (investigation.source_name || '-')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100 col-span-2">
                      <FileText className="text-[#00256c] mt-0.5" size={18} />
                      <div className="w-full">
                        <p className="text-xs text-gray-500">Brief Facts of Case</p>
                        <p className="font-medium text-gray-900 whitespace-pre-wrap mt-1">
                          {investigation.brief_facts_of_case || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taxpayer Details */}
              {investigation.taxpayers && investigation.taxpayers.length > 0 && (
                <div className="bg-white rounded-sm shadow-sm border border-gray-200">
                  <div className="p-4 bg-indigo-50 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-[#00256c] flex items-center gap-2">
                      <User size={20} className="text-[#00256c]" />
                      Taxpayer Information
                    </h2>
                  </div>
                  <div className="p-4">
                    {investigation.taxpayers.map((taxpayer, index) => (
                      <div key={taxpayer.id || index} className="mb-4 last:mb-0">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                            <Building className="text-[#00256c]" size={18} />
                            <div>
                              <p className="text-xs text-gray-500">GSTIN</p>
                              <p className="font-medium text-gray-900">{taxpayer.gstin || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                            <User className="text-[#00256c]" size={18} />
                            <div>
                              <p className="text-xs text-gray-500">Name</p>
                              <p className="font-medium text-gray-900">{taxpayer.name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                            <Building className="text-[#00256c]" size={18} />
                            <div>
                              <p className="text-xs text-gray-500">Trade Name</p>
                              <p className="font-medium text-gray-900">{taxpayer.trade_name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                            <Mail className="text-[#00256c]" size={18} />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="font-medium text-gray-900">{taxpayer.email || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                            <Phone className="text-[#00256c]" size={18} />
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="font-medium text-gray-900">{taxpayer.phone_number || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                            <Building className="text-[#00256c]" size={18} />
                            <div>
                              <p className="text-xs text-gray-500">Division</p>
                              <p className="font-medium text-gray-900">{taxpayer.division_name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100">
                            <Building className="text-[#00256c]" size={18} />
                            <div>
                              <p className="text-xs text-gray-500">Range</p>
                              <p className="font-medium text-gray-900">{taxpayer.range_name || '-'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-sm border border-gray-100 col-span-2">
                            <MapPin className="text-[#00256c]" size={18} />
                            <div className="w-full">
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="font-medium text-gray-900">{taxpayer.address || '-'}</p>
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
                  className={`w-full flex items-center justify-between p-2 mb-1 rounded-lg transition-colors text-sm ${
                    activePage === action.name.toLowerCase().replace(/\s+/g, '-')
                      ? 'bg-[#e6ecf7] text-[#00256c]'
                      : 'text-gray-600 hover:bg-[#e6ecf7]'
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