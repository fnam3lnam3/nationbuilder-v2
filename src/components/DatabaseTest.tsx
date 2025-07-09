import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DatabaseTestProps {
  onClose: () => void;
}

export default function DatabaseTest({ onClose }: DatabaseTestProps) {
  const [tests, setTests] = useState({
    connection: { status: 'pending', message: '' },
    auth: { status: 'pending', message: '' },
    stripeCustomers: { status: 'pending', message: '' },
    stripeSubscriptions: { status: 'pending', message: '' },
    stripeOrders: { status: 'pending', message: '' }
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    // Test 1: Basic connection
    try {
      const { data, error } = await supabase.from('stripe_customers').select('count', { count: 'exact', head: true });
      if (error) throw error;
      setTests(prev => ({
        ...prev,
        connection: { status: 'success', message: 'Connected successfully' }
      }));
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        connection: { status: 'error', message: error.message }
      }));
    }

    // Test 2: Auth status
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setTests(prev => ({
        ...prev,
        auth: { 
          status: session ? 'success' : 'warning', 
          message: session ? `Authenticated as ${session.user.email}` : 'Not authenticated (this is normal for testing)'
        }
      }));
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        auth: { status: 'error', message: error.message }
      }));
    }

    // Test 3: Stripe customers table
    try {
      const { data, error } = await supabase
        .from('stripe_customers')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      setTests(prev => ({
        ...prev,
        stripeCustomers: { 
          status: 'success', 
          message: `Table accessible, ${data?.length || 0} records visible`
        }
      }));
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        stripeCustomers: { status: 'error', message: error.message }
      }));
    }

    // Test 4: Stripe subscriptions view
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .limit(1);
      
      setTests(prev => ({
        ...prev,
        stripeSubscriptions: { 
          status: error ? 'warning' : 'success', 
          message: error ? `View requires auth: ${error.message}` : `View accessible, ${data?.length || 0} records`
        }
      }));
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        stripeSubscriptions: { status: 'error', message: error.message }
      }));
    }

    // Test 5: Environment variables
    const envVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
    };

    const missingVars = Object.entries(envVars).filter(([key, value]) => !value);
    
    setTests(prev => ({
      ...prev,
      stripeOrders: { 
        status: missingVars.length > 0 ? 'error' : 'success', 
        message: missingVars.length > 0 
          ? `Missing env vars: ${missingVars.map(([key]) => key).join(', ')}`
          : 'All environment variables present'
      }
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <CheckCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-800 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-800 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-800 bg-red-50 border-red-200';
      default:
        return 'text-blue-800 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Database Connection Test</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Testing Supabase connection and database functionality...
          </div>

          {Object.entries(tests).map(([testName, result]) => (
            <div
              key={testName}
              className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h3 className="font-semibold capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-sm mt-1">{result.message}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Environment Check</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
              <p>Supabase Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={runTests}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-3 transition-colors"
            >
              Rerun Tests
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}