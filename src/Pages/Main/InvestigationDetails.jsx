import React from 'react';
import { useParams } from 'react-router-dom';
const InvestigationDetails = () => {
    const { fileNumber } = useParams();
  return <div>Investigation Details {fileNumber}</div>;
};

export default InvestigationDetails;