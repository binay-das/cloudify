'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Shield, Globe } from 'lucide-react';
import { motion } from '@/components/landing/motion';

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--chart-1),0.15),transparent_50%)]" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8 max-w-xl">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your files, <span className="text-primary">secure</span>, <span className="text-chart-1">accessible</span>, <span className="text-chart-2">everywhere</span>.
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Cloudify helps you store, share, and collaborate on files with unmatched security and simplicity. 
              Access your content from any device, anywhere in the world.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                className="group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start for free
                <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
              <Button size="lg" variant="outline">
                See pricing
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-chart-2" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-chart-1" />
                <span>Up to 2GB free storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-chart-4" />
                <span>Access anywhere</span>
              </div>
            </motion.div>
          </div>
          
          {/* Hero image/illustration */}
          <motion.div 
            className="relative rounded-xl shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative z-10 rounded-xl overflow-hidden bg-gradient-to-br from-card/80 to-card border border-border/50 backdrop-blur-sm">
              <div className="aspect-[16/11] bg-gradient-to-tr from-primary/5 to-chart-2/5 rounded-xl p-8">
                <div className="w-full h-full rounded-lg bg-card/80 shadow-lg border border-border/50 backdrop-blur-sm overflow-hidden">
                  <div className="h-8 w-full bg-muted/30 flex items-center px-4 border-b border-border/50">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-destructive/70" />
                      <div className="w-3 h-3 rounded-full bg-chart-4/70" />
                      <div className="w-3 h-3 rounded-full bg-chart-2/70" />
                    </div>
                    <div className="w-1/2 mx-auto h-5 rounded-md bg-muted/50" />
                  </div>
                  <div className="flex h-[calc(100%-2rem)]">
                    <div className="w-1/4 h-full border-r border-border/50 py-4 px-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-8 rounded mb-2 bg-muted/40" />
                      ))}
                    </div>
                    <div className="w-3/4 grid grid-cols-3 gap-3 p-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                        <div key={i} className="aspect-square rounded-md bg-muted/30 p-2">
                          <div className="w-full h-2/3 rounded bg-muted/40 mb-1" />
                          <div className="w-2/3 h-2 rounded bg-muted/40" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 -left-3 -z-10 h-10 bg-gradient-to-r from-chart-1/30 via-chart-2/30 to-chart-4/30 blur-xl rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}