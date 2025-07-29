'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from '@/components/landing/motion';
import { 
  Lock, 
  Smartphone, 
  History, 
  FolderSearch, 
  Share2, 
  Zap, 
  FileCheck, 
  Fingerprint 
} from 'lucide-react';

const features = [
  {
    title: 'Secure Storage',
    description: 'End-to-end encryption keeps your files completely private and secure.',
    icon: Lock,
    color: 'text-chart-1',
    delay: 0.1
  },
  {
    title: 'Access Anywhere',
    description: 'Seamlessly access your files from any device, anywhere in the world.',
    icon: Smartphone,
    color: 'text-chart-2',
    delay: 0.2
  },
  {
    title: 'Version History',
    description: 'Track changes and restore previous versions of your files with ease.',
    icon: History,
    color: 'text-chart-3',
    delay: 0.3
  },
  {
    title: 'Smart Search',
    description: 'Find any file instantly with our powerful search capabilities.',
    icon: FolderSearch,
    color: 'text-chart-4',
    delay: 0.4
  },
  {
    title: 'Easy Sharing',
    description: 'Share files and folders with anyone through secure links and permissions.',
    icon: Share2,
    color: 'text-chart-5',
    delay: 0.5
  },
  {
    title: 'Lightning Fast',
    description: 'Experience rapid uploads and downloads with our optimized infrastructure.',
    icon: Zap,
    color: 'text-chart-1',
    delay: 0.6
  },
  {
    title: 'File Recovery',
    description: 'Never lose important data with automatic backup and recovery options.',
    icon: FileCheck,
    color: 'text-chart-2',
    delay: 0.7
  },
  {
    title: 'Advanced Security',
    description: 'Multi-factor authentication and breach detection keep your account safe.',
    icon: Fingerprint,
    color: 'text-chart-4',
    delay: 0.8
  }
];

export function Features() {
  const [visibleFeatures, setVisibleFeatures] = React.useState<number[]>([]);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleFeatures(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('[data-feature]').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need, nothing you don't</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cloudify combines powerful features with an intuitive interface, making file management simpler than ever before.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleFeatures.includes(index);
            
            return (
              <div 
                key={feature.title} 
                data-feature 
                data-index={index}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: isVisible ? feature.delay : 0 }}
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                    <CardHeader>
                      <div className={`${feature.color} p-2 rounded-md inline-flex bg-muted mb-2`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-foreground/80">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}