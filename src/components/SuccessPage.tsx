import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SuccessPageProps {
  onContinue: () => void;
}

export default function SuccessPage({ onContinue }: SuccessPageProps) {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        {loading ? (
          <div className="mb-6">
            <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4 mx-auto"></div>
          </div>
        ) : subscription?.subscription_status === 'active' ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Nationleader Subscription Active</span>
            </div>
            <p className="text-sm text-blue-700">
              You now have access to premium features including up to 30 saved nations and early access to new features!
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <p className="text-blue-800">
              Your purchase is being processed. Premium features will be available shortly.
            </p>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>Continue to Nationbuilder</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="text-xs text-gray-500 mt-4">
          You will receive a confirmation email shortly with your receipt.
        </p>
      </div>
    </div>
  );
}