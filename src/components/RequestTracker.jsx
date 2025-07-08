import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Loader } from 'lucide-react';

const RequestTracker = ({ request }) => {
  const getStatus = (stage) => {
    switch (stage) {
      case 'dealer':
        if (request.status === 'rejected' && request.dealerApproval?.rejectedBy) return 'rejected';
        if (request.dealerApproval?.approved) return 'approved';
        if (request.status === 'pending_dealer') return 'pending';
        return 'upcoming';
      case 'distributor':
        if (request.status === 'rejected' && request.distributorApproval?.rejectedBy) return 'rejected';
        if (request.distributorApproval?.approved) return 'approved';
        if (request.status === 'pending_distributor') return 'pending';
        return 'upcoming';
      case 'company':
        if (request.status === 'rejected' && request.companyApproval?.rejectedBy) return 'rejected';
        if (request.status === 'approved') return 'approved';
        if (request.status === 'pending_company') return 'pending';
        return 'upcoming';
      default:
        return 'upcoming';
    }
  };

  const stages = [
    { name: 'Dealer Approval', status: getStatus('dealer') },
    { name: 'Distributor Approval', status: getStatus('distributor') },
    { name: 'Company Approval', status: getStatus('company') },
  ];

  const statusIcons = {
    approved: <CheckCircle className="w-6 h-6 text-green-400" />,
    pending: <Loader className="w-6 h-6 text-orange-400 animate-spin" />,
    rejected: <XCircle className="w-6 h-6 text-red-400" />,
    upcoming: <Clock className="w-6 h-6 text-gray-500" />,
  };

  const statusColors = {
    approved: 'bg-green-500',
    pending: 'bg-orange-500',
    rejected: 'bg-red-500',
    upcoming: 'bg-gray-600',
  };

  return (
    <div className="p-4 rounded-lg bg-white/5">
      <h4 className="font-semibold mb-4">Request Progress</h4>
      <div className="flex items-center">
        {stages.map((stage, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2, type: 'spring' }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  stage.status !== 'upcoming' ? 'border-blue-400' : 'border-gray-600'
                } bg-background`}
              >
                {statusIcons[stage.status]}
              </motion.div>
              <p className="text-xs mt-2 text-center">{stage.name}</p>
            </div>
            {index < stages.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-600 relative">
                <motion.div
                  className={`h-full absolute left-0 ${statusColors[stages[index + 1].status]}`}
                  initial={{ width: 0 }}
                  animate={{ width: stage.status === 'approved' ? '100%' : '0%' }}
                  transition={{ delay: index * 0.2 + 0.1, duration: 0.5 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RequestTracker;