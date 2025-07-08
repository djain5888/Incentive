import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Briefcase, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser(formData);
    toast({
      title: "Profile Updated!",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>My Profile - Incentive System</title>
        <meta name="description" content="View and edit your profile information" />
      </Helmet>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating-animation" style={{animationDelay: '2s'}}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Button onClick={() => navigate(-1)} variant="ghost" className="absolute -top-14 left-0 text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <Card className="glass-effect border-white/20 pulse-glow">
          <CardHeader className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mx-auto flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold mt-4">{user.name}</CardTitle>
            <CardDescription className="capitalize">{user.role}</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} className="glass-effect border-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} className="glass-effect border-white/20" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} className="glass-effect border-white/20" />
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600">Save Changes</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="w-full glass-effect border-white/20">Cancel</Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-lg">{user.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-lg">{user.phone}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span className="text-lg capitalize">{user.role}</span>
                </div>
                <Button onClick={() => setIsEditing(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;