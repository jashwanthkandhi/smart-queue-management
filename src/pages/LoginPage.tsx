import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, Users } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomerLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    login('customer');
    navigate('/join');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Welcome</h1>
          <p className="text-muted-foreground">
            Select your login type to continue
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-4">
            {/* Customer Login */}
            <Button
              onClick={handleCustomerLogin}
              disabled={isLoading}
              className="w-full h-24 flex flex-col items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              <Users size={32} />
              <span>Customer Login</span>
            </Button>

            {/* Admin Login */}
            <Button
              onClick={handleAdminLogin}
              className="w-full h-24 flex flex-col items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              <Lock size={32} />
              <span>Admin Login</span>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Customer login is instant. Admin requires a password.
          </p>
        </Card>
      </div>
    </div>
  );
}
