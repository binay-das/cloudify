'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from '@/components/landing/motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    content: 'Cloudify has completely transformed how our team collaborates. The intuitive interface and powerful sharing features have made our workflow so much smoother.',
    author: 'Sarah Johnson',
    role: 'Creative Director, DesignHub',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    initials: 'SJ'
  },
  {
    content: 'The security features in Cloudify give me peace of mind when handling sensitive client documents. Its reliable, fast, and incredibly easy to use.',
    author: 'Michael Chen',
    role: 'Financial Advisor, WealthWise',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    initials: 'MC'
  },
  {
    content: 'As someone who works across multiple devices, Cloudifys seamless sync is a game-changer. I can start work on my laptop and continue on my phone without missing a beat.',
    author: 'Emily Rodriguez',
    role: 'Remote Project Manager',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    initials: 'ER'
  },
  {
    content: 'Weve tried many storage solutions, but Cloudify stands out with its balance of powerful features and user-friendly design. Our entire team adopted it within days.',
    author: 'Thomas Wright',
    role: 'CTO, TechStart',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    initials: 'TW'
  },
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by thousands</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's what our customers have to say about their experience with Cloudify.
          </p>
        </div>
        
        {/* Desktop Testimonials */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6 flex flex-col h-full">
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="text-lg mb-6 flex-grow">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Testimonials (Carousel) */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Card className="mx-4">
                    <CardContent className="pt-6">
                      <Quote className="h-8 w-8 text-primary/40 mb-4" />
                      <p className="text-lg mb-6">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                          <AvatarFallback>{testimonial.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}