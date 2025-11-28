'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  
  const planDetails = {
    pro: {
      name: 'Pro',
      price: '₹199',
      features: ['Unlimited sessions', 'All frequencies', 'Smart analytics', 'Custom focus modes'],
    },
    premium: {
      name: 'Premium Wellness',
      price: '₹399',
      features: ['Everything in Pro', 'Weekly AI reports', 'Mood tracking', 'Offline mode'],
    },
  };

  const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back Button */}
        <Link href="/pricing">
          <motion.button
            className="flex items-center gap-2 text-[#7aa2f7] hover:text-[#5b9eff] transition-colors mb-6"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft size={20} />
            <span>Back to Pricing</span>
          </motion.button>
        </Link>

        <div className="bg-gradient-to-br from-[#1e2642]/90 to-[#2a3254]/90 backdrop-blur-xl rounded-2xl border border-[#5b9eff]/20 shadow-2xl shadow-[#5b9eff]/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] p-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Checkout - {selectedPlan.name} Plan
            </h1>
            <p className="text-white/80">Demo Mode - No actual payment will be processed</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Order Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="bg-[#1a1f35]/50 rounded-xl p-6 border border-[#5b9eff]/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-semibold text-white text-lg">{selectedPlan.name} Plan</div>
                    <div className="text-sm text-[#7aa2f7]/60 mt-1">Billed monthly</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedPlan.price}/mo</div>
                </div>
                
                <div className="border-t border-[#5b9eff]/10 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-[#7aa2f7] mb-2">Includes:</h3>
                  <ul className="space-y-1.5">
                    {selectedPlan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-[#a9b1d6] flex items-center gap-2">
                        <span className="text-[#34d399]">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Demo Notice */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#5b9eff]/20 border border-[#7c3aed]/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/30 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-[#bb9af7]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Demo Mode</h3>
                    <p className="text-sm text-[#a9b1d6]">
                      This is a demonstration checkout page for hackathon purposes. 
                      No actual payment will be processed. In production, this would integrate 
                      with payment providers like Razorpay or Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fake Payment Form */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#7aa2f7] mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    disabled
                    className="w-full px-4 py-3 bg-[#1a1f35]/50 border border-[#5b9eff]/20 rounded-lg text-white placeholder:text-[#7aa2f7]/30 focus:outline-none focus:ring-2 focus:ring-[#5b9eff] disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#7aa2f7] mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      disabled
                      className="w-full px-4 py-3 bg-[#1a1f35]/50 border border-[#5b9eff]/20 rounded-lg text-white placeholder:text-[#7aa2f7]/30 focus:outline-none focus:ring-2 focus:ring-[#5b9eff] disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#7aa2f7] mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      disabled
                      className="w-full px-4 py-3 bg-[#1a1f35]/50 border border-[#5b9eff]/20 rounded-lg text-white placeholder:text-[#7aa2f7]/30 focus:outline-none focus:ring-2 focus:ring-[#5b9eff] disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link href="/pricing" className="flex-1">
                <motion.button
                  className="w-full py-4 bg-[#2a3254] border border-[#5b9eff]/30 rounded-xl text-[#7aa2f7] font-semibold hover:bg-[#3a4264] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </Link>
              <Link href="/?upgraded=true" className="flex-1">
                <motion.button
                  className="w-full py-4 bg-gradient-to-r from-[#5b9eff] to-[#7c3aed] rounded-xl text-white font-semibold shadow-lg shadow-[#5b9eff]/40"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Complete Demo Checkout
                </motion.button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#7aa2f7]/60">
              <div className="flex items-center gap-1">
                <Lock size={12} />
                <span>Secure Checkout</span>
              </div>
              <div>256-bit SSL Encrypted</div>
              <div>Money-back Guarantee</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#1a1f35] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5b9eff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#7aa2f7]">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
