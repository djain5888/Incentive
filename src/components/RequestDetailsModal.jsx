import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import RequestTracker from '@/components/RequestTracker';

const RequestDetailsModal = ({ isOpen, onClose, request, onApprove, onReject, userRole, availableLimit }) => {
  if (!isOpen) return null;

  const canTakeAction = 
    (userRole === 'dealer' && request.status === 'pending_dealer') ||
    (userRole === 'distributor' && request.status === 'pending_distributor') ||
    (userRole === 'company' && request.status === 'pending_company');

  const insufficientLimit = userRole === 'distributor' && request.amount > availableLimit;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Request Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <CardDescription>Invoice #{request.invoiceNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-400">Fabricator:</span><span className="ml-2 font-medium">{request.fabricatorName}</span></div>
                <div><span className="text-gray-400">Amount:</span><span className="ml-2 font-medium text-green-400">${request.amount}</span></div>
                <div><span className="text-gray-400">Dealer:</span><span className="ml-2">{request.dealerName}</span></div>
                <div><span className="text-gray-400">Distributor:</span><span className="ml-2">{request.distributorName || 'N/A'}</span></div>
                <div><span className="text-gray-400">Product:</span><span className="ml-2">{request.productDetails}</span></div>
                <div><span className="text-gray-400">Submitted:</span><span className="ml-2">{new Date(request.createdAt).toLocaleDateString()}</span></div>
              </div>

              <RequestTracker request={request} />

              {insufficientLimit && (
                <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Amount exceeds available limit by ${request.amount - availableLimit}</span>
                  </div>
                </div>
              )}

              {canTakeAction && (
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button onClick={() => onApprove(request.id)} disabled={insufficientLimit} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50">
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button onClick={() => onReject(request.id)} variant="outline" className="glass-effect border-red-500/50 text-red-400 hover:bg-red-500/20">
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RequestDetailsModal;