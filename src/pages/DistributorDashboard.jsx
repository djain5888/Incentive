import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, CheckCircle, XCircle, Clock, DollarSign, TrendingUp, AlertTriangle, User, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RequestDetailsModal from '@/components/RequestDetailsModal';
import RequestFilters from '@/components/RequestFilters';

const DistributorDashboard = () => {
  const { user, logout } = useAuth();
  const { requests, updateRequest, distributorLimits, users } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', search: '' });

  const myRequests = useMemo(() => {
    return requests
      .filter(req => req.distributorId === user.id)
      .filter(req => {
        const statusMatch = filters.status === 'all' || req.status.startsWith(filters.status) || (filters.status === 'approved' && req.status !== 'pending_distributor' && req.status !== 'rejected');
        const searchMatch = filters.search === '' || 
                            req.dealerName.toLowerCase().includes(filters.search.toLowerCase()) ||
                            req.dealerId.toString().includes(filters.search);
        return statusMatch && searchMatch;
      });
  }, [requests, user.id, filters]);

  const myLimits = distributorLimits[user.id] || { totalLimit: 0, usedLimit: 0 };
  const availableLimit = myLimits.totalLimit - myLimits.usedLimit;

  const handleApproval = (requestId, approved) => {
    const request = requests.find(req => req.id === requestId);
    const company = users.find(u => u.role === 'company');
    
    if (approved) {
      if (request.amount > availableLimit) {
        toast({ title: "Insufficient Limit", description: `Request amount (${request.amount}) exceeds your available limit (${availableLimit}).`, variant: "destructive" });
        return;
      }
      if (company) {
        updateRequest(requestId, {
          status: 'pending_company',
          distributorApproval: { approved: true, approvedBy: user.name, approvedAt: new Date().toISOString() },
          companyId: company.id,
          companyName: company.name
        });
        toast({ title: "Request Approved!", description: `Request for ${request.fabricatorName} has been forwarded to company.` });
      }
    } else {
      updateRequest(requestId, {
        status: 'rejected',
        distributorApproval: { approved: false, rejectedBy: user.name, rejectedAt: new Date().toISOString(), reason: 'Rejected by distributor' }
      });
      toast({ title: "Request Rejected", description: `Request for ${request.fabricatorName} has been rejected.`, variant: "destructive" });
    }
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <Helmet>
        <title>Distributor Dashboard - Incentive System</title>
        <meta name="description" content="Manage incentive requests and approval limits as a distributor" />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Distributor Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/profile')} variant="outline" className="glass-effect border-white/20 hover:bg-white/10"><User className="w-4 h-4 mr-2" /> Profile</Button>
          <Button onClick={logout} variant="outline" className="glass-effect border-white/20 hover:bg-red-500/20"><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Approvals</CardTitle><Clock className="h-4 w-4 text-orange-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-orange-500">{requests.filter(req => req.distributorId === user.id && req.status === 'pending_distributor').length}</div><p className="text-xs text-muted-foreground">Awaiting your review</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Limit</CardTitle><DollarSign className="h-4 w-4 text-blue-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-blue-500">${myLimits.totalLimit}</div><p className="text-xs text-muted-foreground">Approved by company</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Used Limit</CardTitle><TrendingUp className="h-4 w-4 text-red-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-red-500">${myLimits.usedLimit}</div><p className="text-xs text-muted-foreground">{myLimits.totalLimit > 0 ? Math.round((myLimits.usedLimit / myLimits.totalLimit) * 100) : 0}% utilized</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Available Limit</CardTitle><AlertTriangle className={`h-4 w-4 ${availableLimit < 1000 ? 'text-red-500' : 'text-green-500'}`} /></CardHeader>
            <CardContent><div className={`text-2xl font-bold ${availableLimit < 1000 ? 'text-red-500' : 'text-green-500'}`}>${availableLimit}</div><p className="text-xs text-muted-foreground">Remaining for approvals</p></CardContent>
          </Card>
        </motion.div>
      </div>

      {availableLimit < 1000 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
          <Card className="glass-effect border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6"><div className="flex items-center gap-3"><AlertTriangle className="w-6 h-6 text-red-500" /><div><h3 className="font-semibold text-red-400">Low Approval Limit</h3><p className="text-sm text-red-300">Your available limit is running low. Contact the company to increase your limit.</p></div></div></CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="glass-effect border-white/20">
          <CardHeader><CardTitle>Request History</CardTitle><CardDescription>All requests processed by you</CardDescription></CardHeader>
          <CardContent>
            <RequestFilters onFilterChange={setFilters} searchPlaceholder="Search by dealer name or ID..." />
            <div className="mt-6 space-y-3">
              {myRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-400"><FileText className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No requests match your filters.</p></div>
              ) : (
                myRequests.map((request) => (
                  <div key={request.id} className="glass-effect rounded-lg p-4 border border-white/10 cursor-pointer" onClick={() => setSelectedRequest(request)}>
                    <div className="flex justify-between items-center">
                      <div><h4 className="font-medium">{request.fabricatorName}</h4><p className="text-sm text-gray-400">Invoice #{request.invoiceNumber} • ${request.amount} • via {request.dealerName}</p></div>
                      <div className="text-right">
                        <Badge variant={request.status === 'approved' ? 'default' : request.status.includes('pending') ? 'secondary' : 'destructive'}>
                          {request.status.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {selectedRequest && (
        <RequestDetailsModal request={selectedRequest} isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} onApprove={(id) => handleApproval(id, true)} onReject={(id) => handleApproval(id, false)} userRole={user.role} availableLimit={availableLimit} />
      )}
    </div>
  );
};

export default DistributorDashboard;