import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, CheckCircle, XCircle, Clock, Award, Users, TrendingUp, User, Link2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RequestDetailsModal from '@/components/RequestDetailsModal';
import ManageDistributors from '@/components/ManageDistributors';
import ManageMappings from '@/components/ManageMappings';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const { requests, updateRequest, updateDistributorLimit, updateUserPoints } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('approvals');

  const pendingRequests = requests.filter(req => 
    req.companyId === user.id && req.status === 'pending_company'
  );
  
  const allRequests = requests;
  const approvedRequests = allRequests.filter(req => req.status === 'approved');
  const totalPointsAwarded = approvedRequests.reduce((sum, req) => sum + req.points, 0);

  const handleApproval = (requestId, approved) => {
    const request = requests.find(req => req.id === requestId);
    
    if (approved) {
      const points = Math.floor(request.amount * 0.1);
      
      updateRequest(requestId, {
        status: 'approved',
        companyApproval: { approved: true, approvedBy: user.name, approvedAt: new Date().toISOString() },
        points: points
      });

      updateDistributorLimit(request.distributorId, request.amount);
      updateUserPoints(request.fabricatorId, points);
      
      toast({ title: "Request Approved!", description: `${points} points awarded to ${request.fabricatorName}. Distributor limit updated.` });
    } else {
      updateRequest(requestId, {
        status: 'rejected',
        companyApproval: { approved: false, rejectedBy: user.name, rejectedAt: new Date().toISOString(), reason: 'Rejected by company' }
      });
      
      toast({ title: "Request Rejected", description: `Request for ${request.fabricatorName} has been rejected.`, variant: "destructive" });
    }
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <Helmet>
        <title>Company Dashboard - Incentive System</title>
        <meta name="description" content="Final approval and management of the incentive system" />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Company Dashboard</h1>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Final Approval</CardTitle><Clock className="h-4 w-4 text-orange-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-orange-500">{pendingRequests.length}</div><p className="text-xs text-muted-foreground">Awaiting your decision</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Requests</CardTitle><Users className="h-4 w-4 text-blue-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-blue-500">{allRequests.length}</div><p className="text-xs text-muted-foreground">System-wide submissions</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Approved Requests</CardTitle><TrendingUp className="h-4 w-4 text-green-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-500">{approvedRequests.length}</div><p className="text-xs text-muted-foreground">Successfully processed</p></CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Points Awarded</CardTitle><Award className="h-4 w-4 text-yellow-500" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-yellow-500">{totalPointsAwarded}</div><p className="text-xs text-muted-foreground">Total incentive points</p></CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-orange-500" /> Final Approvals Required</CardTitle>
                <CardDescription>Authenticate and approve incentive requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-400"><CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No pending final approvals</p><p className="text-sm">All requests have been processed.</p></div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <motion.div key={request.id} whileHover={{ scale: 1.02 }} className="glass-effect rounded-lg p-4 border border-white/10 cursor-pointer" onClick={() => setSelectedRequest(request)}>
                        <div className="flex justify-between items-start">
                          <div><h3 className="font-semibold">Final Approval for {request.fabricatorName}</h3><p className="text-sm text-gray-400">Invoice #{request.invoiceNumber} • Amount: ${request.amount}</p></div>
                          <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Final Review</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <ManageDistributors />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <ManageMappings />
          </motion.div>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailsModal request={selectedRequest} isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} onApprove={(id) => handleApproval(id, true)} onReject={(id) => handleApproval(id, false)} userRole={user.role} />
      )}
    </div>
  );
};

export default CompanyDashboard;