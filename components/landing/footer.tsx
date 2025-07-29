'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Cloud, Mail, Twitter, Facebook, Instagram, Linkedin, Github } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Enterprise', href: '#enterprise' },
      { label: 'Changelog', href: '#changelog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Guides', href: '#guides' },
      { label: 'Help Center', href: '#help' },
      { label: 'API Reference', href: '#api' },
      { label: 'Community', href: '#community' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Legal', href: '#legal' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: '#twitter', label: 'Twitter' },
  { icon: Facebook, href: '#facebook', label: 'Facebook' },
  { icon: Instagram, href: '#instagram', label: 'Instagram' },
  { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
  { icon: Github, href: '#github', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Cloud className="h-8 w-8 text-primary" />
              <span className="font-bold text-2xl">Cloudify</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Secure cloud storage that puts you in control. Store, share, and collaborate on all your files from anywhere.
            </p>
            <div className="flex flex-col space-y-4">
              <h4 className="font-medium">Subscribe to our newsletter</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="max-w-xs" 
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
          
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-4">
              <h4 className="font-medium text-lg">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="my-10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Cloudify. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-1">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Button 
                  key={social.label}
                  variant="ghost" 
                  size="icon"
                  asChild
                >
                  <Link href={social.href} aria-label={social.label}>
                    <Icon className="h-5 w-5" />
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}