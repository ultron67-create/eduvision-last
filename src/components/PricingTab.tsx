import React, { useState } from 'react';
import { Check, Star, Zap, Users, Download } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  color: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'Forever',
    description: 'Perfect for getting started with AI-powered learning',
    features: [
      'Upload & analyze content',
      'Up to 5 questions per upload',
      'Basic video generation (up to 3 min)',
      'Mobile access',
      '1 GB storage',
      'Basic research insights'
    ],
    highlighted: false,
    cta: 'Get Started',
    color: 'blue'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious learners wanting advanced features',
    features: [
      'Everything in Free',
      'Unlimited uploads',
      'Advanced questions (up to 10 per upload)',
      'Video generation up to 45 min',
      '5 custom video scripts/month',
      '50 GB storage',
      'Deep research insights',
      'Priority support',
      'No ads'
    ],
    highlighted: true,
    cta: 'Start Free Trial',
    color: 'purple'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'quote',
    description: 'For schools, tutors, and large organizations',
    features: [
      'Everything in Pro',
      'Unlimited video generation',
      'Unlimited storage',
      'Custom branding',
      'Team collaboration',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Training included'
    ],
    highlighted: false,
    cta: 'Contact Sales',
    color: 'green'
  }
];

const paymentMethods = [
  { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
  { id: 'apple', name: 'Apple Pay', icon: '🍎' },
  { id: 'google', name: 'Google Pay', icon: '🔵' }
];

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Analysis',
    description: 'Advanced AI analyzes your educational content and extracts key concepts automatically'
  },
  {
    icon: Download,
    title: 'Generate Videos',
    description: 'Create beautiful educational videos from any topic with multiple animation styles'
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Share content with classmates and work together on learning materials'
  },
  {
    icon: Star,
    title: 'Personalized Experience',
    description: 'Content adapts to your education level and learning preferences'
  }
];

export function PricingTab() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('pro');

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Choose the perfect plan for your learning journey. All plans include our core features.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all text-sm sm:text-base ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual <span className="ml-2 text-green-600 font-bold">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto w-full px-4 sm:px-0">
        {pricingPlans.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-2xl transition-all transform hover:scale-105 ${
              plan.highlighted
                ? 'ring-2 ring-blue-600 shadow-2xl scale-105 bg-white'
                : 'bg-white shadow-lg hover:shadow-xl'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star size={16} fill="currentColor" />
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period !== 'quote' && (
                      <span className="text-gray-600 text-sm">{plan.period}</span>
                    )}
                  </div>
                  {plan.id === 'pro' && billingCycle === 'annual' && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Billed as $182.40/year
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>

              {/* Features List */}
              <div className="space-y-3 border-t pt-6">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Features Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-12 max-w-5xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Choose EduVision?
        </h3>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="flex gap-4">
                <div className="bg-blue-100 p-3 rounded-lg h-fit">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto w-full">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Secure Payment Methods
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors cursor-pointer"
            >
              <div className="text-3xl mb-2">{method.icon}</div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">{method.name}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            All payments are encrypted and processed securely through Stripe. Your financial information is never stored on our servers.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto w-full">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {[
            {
              q: 'Can I change plans anytime?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.'
            },
            {
              q: 'Do you offer a free trial?',
              a: 'The Free plan is always available. Pro plan includes a 7-day free trial with full access to all features.'
            },
            {
              q: 'What happens if I exceed my storage limit?',
              a: 'We notify you when you reach 80% of your storage. You can delete old content or upgrade to a plan with more storage.'
            },
            {
              q: 'Is there a cancellation fee?',
              a: 'No cancellation fees. You can cancel anytime. Access continues until the end of your billing period.'
            },
            {
              q: 'Do you offer discounts for students?',
              a: 'Yes! Students get 30% off Pro plans with a valid .edu email address. Contact support for details.'
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{faq.q}</h4>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold">Ready to Transform Your Learning?</h3>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of students using EduVision to learn smarter, not harder.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm sm:text-base">
            Start Your Journey Today
          </button>
        </div>
      </div>
    </div>
  );
}
