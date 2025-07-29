'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { motion } from '@/components/landing/motion';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for individuals just getting started',
    features: [
      '2GB of storage',
      'Basic file sharing',
      'Web access',
      'Mobile app access',
      '7-day version history',
    ],
    cta: 'Sign Up Free',
    featured: false,
  },
  {
    name: 'Plus',
    price: { monthly: 9.99, yearly: 8.99 },
    description: 'Great for professionals who need more space',
    features: [
      '100GB of storage',
      'Advanced sharing controls',
      'Web, desktop & mobile access',
      '30-day version history',
      'File recovery',
      'Smart sync',
    ],
    cta: 'Try Free for 30 Days',
    featured: true,
  },
  {
    name: 'Business',
    price: { monthly: 19.99, yearly: 16.99 },
    description: 'For teams that need to collaborate seamlessly',
    features: [
      'Unlimited storage',
      'Team folder management',
      'Admin controls',
      'Advanced security features',
      '180-day version history',
      'File recovery',
      'Smart sync',
      'Priority support',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include core Cloudify features.
          </p>
          
          <div className="mt-8 inline-flex items-center p-1 bg-muted rounded-lg">
            <Button 
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'} 
              onClick={() => setBillingCycle('monthly')}
              className="rounded-md"
            >
              Monthly
            </Button>
            <Button 
              variant={billingCycle === 'yearly' ? 'default' : 'ghost'} 
              onClick={() => setBillingCycle('yearly')}
              className="rounded-md"
            >
              Yearly <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">Save 20%</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex ${plan.featured ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <Card className={`flex flex-col w-full ${
                plan.featured ? 'border-primary shadow-lg relative overflow-hidden' : ''
              }`}>
                {plan.featured && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs py-1 px-3 rounded-bl-md">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className={plan.featured ? 'pb-8' : ''}>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-chart-2 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.featured ? 'bg-primary hover:bg-primary/90' : ''}`} 
                    variant={plan.featured ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          All plans include a 30-day money-back guarantee. No credit card required for free trial.
        </div>
      </div>
    </section>
  );
}