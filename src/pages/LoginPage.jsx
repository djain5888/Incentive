import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Users, Award, TrendingUp } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      if (user) {
        login(user);
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${user.name}!`,
        });
        
        switch (user.role) {
          case 'fabricator':
            navigate('/fabricator');
            break;
          case 'dealer':
            navigate('/dealer');
            break;
          case 'distributor':
            navigate('/distributor');
            break;
          case 'company':
            navigate('/company');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  const demoLogin = (role) => {
    const demoUser = users.find(u => u.role === role);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword('demo123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Login - Fabricator Incentive System</title>
        <meta name="description" content="Login to access your fabricator incentive management dashboard" />
      </Helmet>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating-animation" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold gradient-text">
              Incentive Hub
            </h1>
            <p className="text-xl text-gray-300 max-w-lg">
              Streamline your fabricator incentive program with our comprehensive management platform
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
            <motion.div whileHover={{ scale: 1.05 }} className="glass-effect rounded-lg p-4 text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <span className="text-sm font-medium">Multi-Role Access</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="glass-effect rounded-lg p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <span className="text-sm font-medium">Approval Workflow</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="glass-effect rounded-lg p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <span className="text-sm font-medium">Points System</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="glass-effect rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-400" />
              <span className="text-sm font-medium">Real-time Tracking</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="glass-effect border-white/20 pulse-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass-effect border-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="glass-effect border-white/20" />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-400 hover:underline">
                  Sign Up
                </Link>
              </div>

              <div className="space-y-3">
                <p className="text-center text-sm text-gray-400">Or use a demo account:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => demoLogin('fabricator')} className="glass-effect border-white/20 hover:bg-white/10">Fabricator</Button>
                  <Button variant="outline" size="sm" onClick={() => demoLogin('dealer')} className="glass-effect border-white/20 hover:bg-white/10">Dealer</Button>
                  <Button variant="outline" size="sm" onClick={() => demoLogin('distributor')} className="glass-effect border-white/20 hover:bg-white/10">Distributor</Button>
                  <Button variant="outline" size="sm" onClick={() => demoLogin('company')} className="glass-effect border-white/20 hover:bg-white/10">Company</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;