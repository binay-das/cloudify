'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Cloud, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Resources', href: '#resources' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary transition-transform hover:scale-105"
        >
          <Cloud className="h-8 w-8" />
          <span className="font-bold text-xl tracking-tight">Cloudify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">Get Started</Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-4">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md shadow-md p-4 flex flex-col space-y-4 border-b border-border animate-in fade-in slide-in-from-top-5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground py-2 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" className="w-full">
              Login
            </Button>
            <Button size="sm" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}