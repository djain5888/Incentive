import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Edit, X, Save } from 'lucide-react';

const ManageDistributors = () => {
  const { users, saveUsers, distributorLimits, setDistributorLimit } = useData();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDistributorId, setEditingDistributorId] = useState(null);
  const [newLimit, setNewLimit] = useState('');
  const [newDistributor, setNewDistributor] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    totalLimit: ''
  });

  const distributors = users.filter(u => u.role === 'distributor');

  const handleAddDistributor = (e) => {
    e.preventDefault();
    const userExists = users.find(u => u.email === newDistributor.email);
    if (userExists) {
      toast({ title: "Error", description: "A user with this email already exists.", variant: "destructive" });
      return;
    }

    const newId = Date.now();
    const newUser = {
      id: newId,
      name: newDistributor.name,
      email: newDistributor.email,
      phone: newDistributor.phone,
      role: 'distributor'
    };
    saveUsers([...users, newUser]);
    setDistributorLimit(newId, parseFloat(newDistributor.totalLimit));
    
    toast({ title: "Success", description: "New distributor added successfully." });
    setNewDistributor({ name: '', email: '', password: '', phone: '', totalLimit: '' });
    setShowAddForm(false);
  };

  const handleUpdateLimit = (distributorId) => {
    setDistributorLimit(distributorId, parseFloat(newLimit));
    toast({ title: "Success", description: "Distributor limit updated." });
    setEditingDistributorId(null);
    setNewLimit('');
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><UserPlus className="w-6 h-6 text-purple-400" /> Manage Distributors</CardTitle>
        <CardDescription>Add new distributors and manage their credit limits.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full mb-6 bg-gradient-to-r from-blue-600 to-purple-600">
          {showAddForm ? 'Cancel' : 'Add New Distributor'}
        </Button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <form onSubmit={handleAddDistributor} className="space-y-4 mb-6 p-4 bg-white/5 rounded-lg">
                <h3 className="font-semibold">New Distributor Form</h3>
                <Input placeholder="Full Name" value={newDistributor.name} onChange={(e) => setNewDistributor({...newDistributor, name: e.target.value})} required className="glass-effect" />
                <Input type="email" placeholder="Email" value={newDistributor.email} onChange={(e) => setNewDistributor({...newDistributor, email: e.target.value})} required className="glass-effect" />
                <Input type="password" placeholder="Password" value={newDistributor.password} onChange={(e) => setNewDistributor({...newDistributor, password: e.target.value})} required className="glass-effect" />
                <Input type="tel" placeholder="Phone Number" value={newDistributor.phone} onChange={(e) => setNewDistributor({...newDistributor, phone: e.target.value})} required className="glass-effect" />
                <Input type="number" placeholder="Initial Credit Limit" value={newDistributor.totalLimit} onChange={(e) => setNewDistributor({...newDistributor, totalLimit: e.target.value})} required className="glass-effect" />
                <Button type="submit" className="w-full">Save Distributor</Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {distributors.map(dist => {
            const limits = distributorLimits[dist.id] || { totalLimit: 0, usedLimit: 0 };
            const isEditing = editingDistributorId === dist.id;
            return (
              <div key={dist.id} className="glass-effect p-4 rounded-lg border border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{dist.name}</p>
                    <p className="text-sm text-gray-400">{dist.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => handleUpdateLimit(dist.id)}><Save className="w-4 h-4 text-green-400" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingDistributorId(null)}><X className="w-4 h-4 text-red-400" /></Button>
                      </>
                    ) : (
                      <Button size="icon" variant="ghost" onClick={() => { setEditingDistributorId(dist.id); setNewLimit(limits.totalLimit); }}><Edit className="w-4 h-4" /></Button>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <div className="mt-4">
                    <Input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} className="glass-effect" />
                  </div>
                ) : (
                  <div className="mt-2 text-sm">
                    <p>Limit: <span className="font-medium text-blue-400">${limits.totalLimit}</span></p>
                    <p>Used: <span className="font-medium text-orange-400">${limits.usedLimit}</span></p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageDistributors;