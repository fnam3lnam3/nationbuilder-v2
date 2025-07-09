import React, { useState, useEffect } from 'react';
import { Crown, Check, Loader2 } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface SubscriptionPlansProps {
  user: any;
  onClose: () => void;
}

export default function SubscriptionPlans({ user, onClose }: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSubscribe = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user) return;

    setLoading(priceId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: window.location.href,
          mode
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (priceId: string) => {
    return currentSubscription?.price_id === priceId && 
           currentSubscription?.subscription_status === 'active';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Upgrade Your Nation Building</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {currentSubscription?.subscription_status === 'active' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  You have an active Nationleader Subscription
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {stripeProducts.map((product) => (
              <div
                key={product.id}
                className={`border rounded-lg p-6 ${
                  isCurrentPlan(product.priceId)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300'
                } transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {product.description}
                    </p>
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      $2.99/month
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">Create up to 30 saved nations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">First access to new features</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">Priority social features (coming soon)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {isCurrentPlan(product.priceId) ? (
                      <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium">
                        Current Plan
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSubscribe(product.priceId, product.mode)}
                        disabled={loading === product.priceId}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        {loading === product.priceId ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>Subscribe Now</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Secure payment processing by Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}