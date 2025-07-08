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
import { LogOut, Plus, FileText, Award, Clock, CheckCircle, XCircle, User, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RequestDetailsModal from '@/components/RequestDetailsModal';
import RedeemPoints from '@/components/RedeemPoints';
import RequestFilters from '@/components/RequestFilters';

const FabricatorDashboard = () => {
  const { user, logout } = useAuth();
  const { requests, users, addRequest } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    dealerNumber: '',
    amount: '',
    productDetails: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', search: '' });

  const myRequests = useMemo(() => {
    return requests
      .filter(req => req.fabricatorId === user.id)
      .filter(req => {
        const statusMatch = filters.status === 'all' || req.status.startsWith(filters.status);
        const searchMatch = filters.search === '' || 
                            req.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
                            req.dealerName.toLowerCase().includes(filters.search.toLowerCase());
        return statusMatch && searchMatch;
      });
  }, [requests, user.id, filters]);

  const fabricatorData = users.find(u => u.id === user.id);
  const totalPoints = fabricatorData?.points || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dealer = users.find(u => u.id === parseInt(formData.dealerNumber) && u.role === 'dealer');
    if (!dealer) {
      toast({
        title: "Invalid Dealer",
        description: "Dealer ID not found in system.",
        variant: "destructive"
      });
      return;
    }

    const newRequest = {
      ...formData,
      fabricatorId: user.id,
      fabricatorName: user.name,
      dealerId: dealer.id,
      dealerName: dealer.name,
      // Distributor will be assigned by dealer
      distributorId: null,
      distributorName: null,
      amount: parseFloat(formData.amount)
    };

    addRequest(newRequest);
    
    toast({
      title: "Request Submitted!",
      description: "Your incentive request has been sent to the dealer for approval.",
    });

    setFormData({ invoiceNumber: '', dealerNumber: '', amount: '', productDetails: '' });
    setShowForm(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_dealer: { label: 'Pending Dealer', variant: 'secondary', icon: Clock },
      pending_distributor: { label: 'Pending Distributor', variant: 'secondary', icon: Clock },
      pending_company: { label: 'Pending Company', variant: 'secondary', icon: Clock },
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
        <title>Fabricator Dashboard - Incentive System</title>
        <meta name="description" content="Manage your incentive requests and track points as a fabricator" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Fabricator Dashboard</h1>
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
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{totalPoints}</div>
              <p className="text-xs text-muted-foreground">Available to redeem</p>
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
              <div className="text-2xl font-bold text-blue-500">{requests.filter(req => req.fabricatorId === user.id).length}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {requests.filter(req => req.fabricatorId === user.id && req.status !== 'approved' && req.status !== 'rejected').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" /> New Incentive Request
            </Button>
          </motion.div>

          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <CardTitle>Submit New Request</CardTitle>
                  <CardDescription>Fill in the details for your incentive request</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Invoice Number</label>
                        <Input 
                          placeholder="Enter invoice number" 
                          value={formData.invoiceNumber} 
                          onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})} 
                          required 
                          className="glass-effect border-white/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dealer ID</label>
                        <Input 
                          placeholder="Enter dealer ID (e.g., 2)" 
                          value={formData.dealerNumber} 
                          onChange={(e) => setFormData({...formData, dealerNumber: e.target.value})} 
                          required 
                          className="glass-effect border-white/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          value={formData.amount} 
                          onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                          required 
                          className="glass-effect border-white/20" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Product Details</label>
                        <Input 
                          placeholder="Enter product details" 
                          value={formData.productDetails} 
                          onChange={(e) => setFormData({...formData, productDetails: e.target.value})} 
                          required 
                          className="glass-effect border-white/20" 
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-gradient-to-r from-green-600 to-blue-600">Submit Request</Button>
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="glass-effect border-white/20">Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle>My Requests</CardTitle>
                <CardDescription>Track the status of your incentive requests</CardDescription>
              </CardHeader>
              <CardContent>
                <RequestFilters onFilterChange={setFilters} searchPlaceholder="Search by invoice or dealer..." />
                <div className="mt-6 space-y-4">
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
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">Invoice #{request.invoiceNumber}</h3>
                            <p className="text-sm text-gray-400">Dealer: {request.dealerName} • Amount: ${request.amount}</p>
                          </div>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-sm text-gray-300">
                          <p>Product: {request.productDetails}</p>
                          <p>Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
                          {request.distributorName && (
                            <p>Distributor: {request.distributorName}</p>
                          )}
                          {request.points > 0 && (
                            <p className="text-yellow-500 font-medium">Points Earned: {request.points}</p>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <RedeemPoints totalPoints={totalPoints} />
          </motion.div>
        </div>
      </div>

      {selectedRequest && (
        <RequestDetailsModal 
          request={selectedRequest} 
          isOpen={!!selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
    </div>
  );
};

export default FabricatorDashboard;