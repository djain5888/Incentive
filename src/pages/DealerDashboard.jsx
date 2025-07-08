import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, CheckCircle, XCircle, Clock, FileText, TrendingUp, User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RequestDetailsModal from '@/components/RequestDetailsModal';
import RequestFilters from '@/components/RequestFilters';

const DealerDashboard = () => {
  const { user, logout } = useAuth();
  const { requests, updateRequest, users } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [showDistributorModal, setShowDistributorModal] = useState(false);
  const [selectedRequestForDistributor, setSelectedRequestForDistributor] = useState(null);
  const [distributorPhone, setDistributorPhone] = useState('');

  const myRequests = useMemo(() => {
    return requests
      .filter(req => req.dealerId === user.id)
      .filter(req => {
        const statusMatch = filters.status === 'all' || req.status.startsWith(filters.status) || (filters.status === 'approved' && req.status !== 'pending_dealer' && req.status !== 'rejected');
        const searchMatch = filters.search === '' || 
                            req.fabricatorName.toLowerCase().includes(filters.search.toLowerCase()) ||
                            req.fabricatorId.toString().includes(filters.search);
        return statusMatch && searchMatch;
      });
  }, [requests, user.id, filters]);

  const approvedCount = requests.filter(req => req.dealerId === user.id && req.status !== 'pending_dealer' && req.status !== 'rejected').length;

  const handleAssignDistributor = (request) => {
    setSelectedRequestForDistributor(request);
    setShowDistributorModal(true);
  };

  const submitDistributorAssignment = () => {
    const distributor = users.find(u => u.phone === distributorPhone && u.role === 'distributor');
    
    if (!distributor) {
      toast({
        title: "Invalid Distributor",
        description: "Distributor with that phone number not found.",
        variant: "destructive"
      });
      return;
    }

    // Update the request with distributor information and approve it
    updateRequest(selectedRequestForDistributor.id, {
      distributorId: distributor.id,
      distributorName: distributor.name,
      status: 'pending_distributor',
      dealerApproval: { 
        approved: true, 
        approvedBy: user.name, 
        approvedAt: new Date().toISOString() 
      }
    });

    toast({
      title: "Request Approved & Forwarded!",
      description: `Request has been forwarded to ${distributor.name} for approval.`,
    });

    setShowDistributorModal(false);
    setSelectedRequestForDistributor(null);
    setDistributorPhone('');
    setSelectedRequest(null);
  };

  const handleApproval = (requestId, approved) => {
    const request = requests.find(req => req.id === requestId);
    
    if (approved) {
      // If distributor is not assigned, show distributor assignment modal
      if (!request.distributorId) {
        handleAssignDistributor(request);
        return;
      }
      
      // If distributor is already assigned, just approve
      updateRequest(requestId, {
        status: 'pending_distributor',
        dealerApproval: { approved: true, approvedBy: user.name, approvedAt: new Date().toISOString() },
      });
      toast({ title: "Request Approved!", description: `Request for ${request.fabricatorName} has been forwarded to ${request.distributorName}.` });
    } else {
      updateRequest(requestId, {
        status: 'rejected',
        dealerApproval: { approved: false, rejectedBy: user.name, rejectedAt: new Date().toISOString(), reason: 'Rejected by dealer' }
      });
      toast({ title: "Request Rejected", description: `Request for ${request.fabricatorName} has been rejected.`, variant: "destructive" });
    }
    setSelectedRequest(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_dealer: { label: 'Pending Review', variant: 'secondary', icon: Clock },
      pending_distributor: { label: 'Forwarded to Distributor', variant: 'default', icon: CheckCircle },
      pending_company: { label: 'At Company', variant: 'default', icon: Clock },
      approved: { label: 'Approved', variant: 'default', icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending_dealer;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <Helmet>
        <title>Dealer Dashboard - Incentive System</title>
        <meta name="description" content="Review and approve fabricator incentive requests as a dealer" />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dealer Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/profile')} variant="outline" className="glass-effect border-white/20 hover:bg-white/10">
            <User className="w-4 h-4 mr-2" /> Profile
          </Button>
          <Button onClick={logout} variant="outline" className="glass-effect border-white/20 hover:bg-red-500/20">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {requests.filter(req => req.dealerId === user.id && req.status === 'pending_dealer').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {requests.filter(req => req.dealerId === user.id).length}
              </div>
              <p className="text-xs text-muted-foreground">All time received</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Forwarded to distributor</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>All requests received from fabricators</CardDescription>
          </CardHeader>
          <CardContent>
            <RequestFilters onFilterChange={setFilters} searchPlaceholder="Search by fabricator name or ID..." />
            <div className="mt-6 space-y-3">
              {myRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No requests match your filters.</p>
                </div>
              ) : (
                myRequests.map((request) => (
                  <motion.div 
                    key={request.id} 
                    whileHover={{ scale: 1.02 }}
                    className="glass-effect rounded-lg p-4 border border-white/10 cursor-pointer" 
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{request.fabricatorName}</h4>
                        <p className="text-sm text-gray-400">Invoice #{request.invoiceNumber} • ${request.amount}</p>
                        {request.distributorName && (
                          <p className="text-sm text-green-400 mt-1">
                            <UserPlus className="w-3 h-3 inline mr-1" />
                            Distributor: {request.distributorName}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {getStatusBadge(request.status)}
                        <p className="text-xs text-gray-400 mt-1">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {/* Action buttons for pending requests */}
                    {request.status === 'pending_dealer' && (
                      <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          onClick={() => handleAssignDistributor(request)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Assign Distributor & Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproval(request.id, false)}
                          className="border-red-500 text-red-500 hover:bg-red-500/20"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest} 
          isOpen={!!selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
          onApprove={(id) => handleApproval(id, true)} 
          onReject={(id) => handleApproval(id, false)} 
          userRole={user.role} 
        />
      )}

      {/* Distributor Assignment Modal */}
      {showDistributorModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDistributorModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-effect rounded-lg p-6 max-w-md w-full border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Assign Distributor</h2>
            <p className="text-gray-400 mb-4">
              Enter the distributor's phone number to forward this request.
            </p>
            
            {selectedRequestForDistributor && (
              <div className="mb-4 p-3 glass-effect rounded-lg border border-white/10">
                <p className="text-sm text-gray-400">Request Details:</p>
                <p className="font-medium">{selectedRequestForDistributor.fabricatorName}</p>
                <p className="text-sm">Invoice: {selectedRequestForDistributor.invoiceNumber}</p>
                <p className="text-sm">Amount: ${selectedRequestForDistributor.amount}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Distributor Phone Number</label>
                <Input
                  placeholder="Enter phone number (e.g. +1987654321)"
                  value={distributorPhone}
                  onChange={(e) => setDistributorPhone(e.target.value)}
                  className="glass-effect border-white/20"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={submitDistributorAssignment}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={!distributorPhone}
                >
                  Assign & Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDistributorModal(false);
                    setDistributorPhone('');
                    setSelectedRequestForDistributor(null);
                  }}
                  className="glass-effect border-white/20"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DealerDashboard;