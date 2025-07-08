import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useData } from '@/contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'fabricator'
  });
  const [loading, setLoading] = useState(false);
  const { users, saveUsers } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const userExists = users.find(u => u.email === formData.email);
      if (userExists) {
        toast({
          title: "Registration Failed",
          description: "An account with this email already exists.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        ...formData,
        points: formData.role === 'fabricator' ? 0 : undefined,
      };

      saveUsers([...users, newUser]);

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please log in.",
      });
      
      navigate('/login');
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Sign Up - Fabricator Incentive System</title>
        <meta name="description" content="Create a new account for the fabricator incentive management system" />
      </Helmet>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating-animation" style={{animationDelay: '2s'}}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-effect border-white/20 pulse-glow">
          <CardHeader className="text-center">
            <UserPlus className="w-12 h-12 mx-auto text-blue-400" />
            <CardTitle className="text-2xl font-bold mt-4">Create an Account</CardTitle>
            <CardDescription>Join the Incentive Hub today!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required className="glass-effect border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required className="glass-effect border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required className="glass-effect border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input name="phone" type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} required className="glass-effect border-white/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">I am a...</label>
                <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                  <SelectTrigger className="w-full glass-effect border-white/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabricator">Fabricator</SelectItem>
                    <SelectItem value="dealer">Dealer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
            <div className="text-center text-sm text-gray-400 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-400 hover:underline">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;