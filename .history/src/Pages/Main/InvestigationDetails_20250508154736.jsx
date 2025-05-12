import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AxiosWrapper } from '../../Utils/Auth/AxiosWrapper';
import { Plus, Edit, Trash2, Eye, ChevronRight, FileText, Calendar, User, Building, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-react';

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

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-4xl">
          <LoadingSkeleton />
        </div>
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
    <div className="max-w-full mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-center">
            <div 
              className="cursor-pointer group"
              onClick={() => setActivePage('details')}
            >
              <h1 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Investigation Details
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <FileText className="text-blue-500" size={18} />
                <p className="text-sm text-gray-600">
                  File Number: <span className="font-semibold">{investigation.file_number}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                title="Edit"
              >
                <Edit size={20} />
              </button>
              <button
                className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-105"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {activePage === 'details' ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="text-blue-500" size={20} />
                      Basic Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          File Number
                        </label>
                        <p className="text-gray-900 font-medium">{investigation.file_number || '-'}</p>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <Calendar size={16} className="text-blue-500" />
                          Date of Detection
                        </label>
                        <p className="text-gray-900 font-medium">
                          {investigation.date_of_detection ? new Date(investigation.date_of_detection).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          Period Involved
                        </label>
                        <p className="text-gray-900 font-medium">
                          {investigation.period_involved ? new Date(investigation.period_involved).toLocaleDateString() : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <User size={16} className="text-blue-500" />
                          Currently Assigned Officer
                        </label>
                        <p className="text-gray-900 font-medium">{investigation.currently_assigned_officer || '-'}</p>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          E-Office File No.
                        </label>
                        <p className="text-gray-900 font-medium">{investigation.e_office_file_no || '-'}</p>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          Nature of Offence
                        </label>
                        <p className="text-gray-900 font-medium">{investigation.nature_of_offence || '-'}</p>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          Source
                        </label>
                        <p className="text-gray-900 font-medium">{investigation.source_name || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Taxpayer Details */}
                {investigation.taxpayers && investigation.taxpayers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <User className="text-green-500" size={20} />
                        Taxpayer Details
                      </h2>
                    </div>
                    <div className="p-6">
                      {investigation.taxpayers.map((taxpayer, index) => (
                        <motion.div
                          key={taxpayer.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-8 last:mb-0"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Building size={16} className="text-green-500" />
                                GSTIN
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.gstin || '-'}</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <User size={16} className="text-green-500" />
                                Name
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.name || '-'}</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <FileText size={16} className="text-green-500" />
                                Trade Name
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.trade_name || '-'}</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Mail size={16} className="text-green-500" />
                                Email
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.email || '-'}</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <Phone size={16} className="text-green-500" />
                                Phone Number
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.phone_number || '-'}</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <FileText size={16} className="text-green-500" />
                                Division
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.division_name || '-'}</p>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <FileText size={16} className="text-green-500" />
                                Range
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.range_name || '-'}</p>
                            </div>
                            <div className="md:col-span-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
                              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                <MapPin size={16} className="text-green-500" />
                                Address
                              </label>
                              <p className="text-gray-900 font-medium">{taxpayer.address || '-'}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderActivePage()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plus size={20} className="text-purple-500" />
                Actions
              </h2>
            </div>
            <div className="p-2">
              {actionButtons.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleActionClick(action.name)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 mb-1 ${
                    activePage === action.name.toLowerCase().replace(/\s+/g, '-')
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={18} className={activePage === action.name.toLowerCase().replace(/\s+/g, '-') ? 'text-purple-500' : 'text-gray-400'} />
                    <span className="text-sm font-medium">{action.name}</span>
                  </div>
                  <ChevronRight size={16} className={activePage === action.name.toLowerCase().replace(/\s+/g, '-') ? 'text-purple-500' : 'text-gray-400'} />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationDetails;