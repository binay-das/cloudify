'use client';

import { Button } from '@/components/ui/button';
import { motion } from '@/components/landing/motion';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-chart-1 to-chart-2 p-8 md:p-12">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              className="text-center md:text-left text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to simplify your digital life?</h2>
              <p className="text-white/80 text-lg md:max-w-xl">
                Join thousands of users who trust Cloudify with their important files. Start your free trial today — no credit card required.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" className="bg-white hover:bg-white/90 text-chart-2">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}