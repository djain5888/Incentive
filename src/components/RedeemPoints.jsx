import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Gift, ShoppingCart, Ticket } from 'lucide-react';

const RedeemPoints = ({ totalPoints }) => {
  const { toast } = useToast();

  const handleRedeem = (item) => {
    toast({
      title: "🚧 Feature Not Implemented",
      description: `Redeeming for "${item}" isn't available yet—but you can request it in your next prompt! 🚀`,
    });
  };

  const rewards = [
    { name: 'Gift Card', points: 500, icon: Ticket },
    { name: 'Product Discount', points: 1000, icon: ShoppingCart },
    { name: 'Exclusive Merchandise', points: 2500, icon: Gift },
  ];

  return (
    <Card className="glass-effect border-white/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-purple-400" />
          Redeem Points
        </CardTitle>
        <CardDescription>Use your points to claim rewards!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-gray-400">Your Balance</p>
          <p className="text-4xl font-bold text-yellow-400">{totalPoints} <span className="text-lg">points</span></p>
        </div>
        <div className="space-y-4">
          {rewards.map((reward, index) => {
            const canAfford = totalPoints >= reward.points;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect border-white/10">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <reward.icon className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="font-semibold">{reward.name}</p>
                        <p className="text-sm text-yellow-500">{reward.points} points</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRedeem(reward.name)}
                      disabled={!canAfford}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50"
                    >
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RedeemPoints;