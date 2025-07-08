import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2, Save } from 'lucide-react';

const ManageMappings = () => {
  const { users, assignDistributorToDealer } = useData();
  const { toast } = useToast();
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState(null);

  const dealers = users.filter(u => u.role === 'dealer');
  const distributors = users.filter(u => u.role === 'distributor');

  const handleSaveMapping = () => {
    if (!selectedDealer || !selectedDistributor) {
      toast({ title: "Error", description: "Please select both a dealer and a distributor.", variant: "destructive" });
      return;
    }
    assignDistributorToDealer(parseInt(selectedDealer), parseInt(selectedDistributor));
    toast({ title: "Success", description: "Dealer has been mapped to the distributor." });
    setSelectedDealer(null);
    setSelectedDistributor(null);
  };

  const getDistributorName = (distributorId) => {
    const distributor = distributors.find(d => d.id === distributorId);
    return distributor ? distributor.name : 'Not Mapped';
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Link2 className="w-6 h-6 text-green-400" /> Manage Mappings</CardTitle>
        <CardDescription>Assign dealers to their respective distributors.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Dealer</label>
            <Select onValueChange={setSelectedDealer} value={selectedDealer}>
              <SelectTrigger className="w-full glass-effect border-white/20">
                <SelectValue placeholder="Choose a dealer..." />
              </SelectTrigger>
              <SelectContent>
                {dealers.map(dealer => (
                  <SelectItem key={dealer.id} value={dealer.id.toString()}>
                    {dealer.name} (Current: {getDistributorName(dealer.distributorId)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Assign to Distributor</label>
            <Select onValueChange={setSelectedDistributor} value={selectedDistributor}>
              <SelectTrigger className="w-full glass-effect border-white/20">
                <SelectValue placeholder="Choose a distributor..." />
              </SelectTrigger>
              <SelectContent>
                {distributors.map(distributor => (
                  <SelectItem key={distributor.id} value={distributor.id.toString()}>{distributor.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSaveMapping} className="w-full bg-gradient-to-r from-green-600 to-blue-600">
          <Save className="w-4 h-4 mr-2" /> Save Mapping
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManageMappings;