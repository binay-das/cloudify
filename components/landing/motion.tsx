'use client';

import React from 'react';

// Create a simple motion library to avoid adding framer-motion as a dependency
// This is a minimal implementation for basic animations

type MotionProps = {
  initial?: Record<string, number>;
  animate?: Record<string, number>;
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string;
  };
  className?: string;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

// Helper function to create CSS transition string
const createTransition = (transition: MotionProps['transition']) => {
  const { duration = 0.3, ease = 'ease' } = transition || {};
  return `all ${duration}s ${ease}`;
};

// Helper function to create CSS transform string
const createTransform = (props: Record<string, number>) => {
  const transforms: string[] = [];
  
  if (props.x) transforms.push(`translateX(${props.x}px)`);
  if (props.y) transforms.push(`translateY(${props.y}px)`);
  if (props.scale) transforms.push(`scale(${props.scale})`);
  if (props.rotate) transforms.push(`rotate(${props.rotate}deg)`);
  
  return transforms.join(' ');
};

export const motion = {
  div: React.forwardRef<HTMLDivElement, MotionProps & React.HTMLAttributes<HTMLDivElement>>(
    ({ initial, animate, transition, className, children, style, ...props }, ref) => {
      const [isAnimated, setIsAnimated] = React.useState(false);
      
      React.useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 10);
        return () => clearTimeout(timer);
      }, []);

      const initialStyles = initial ? {
        opacity: initial.opacity,
        transform: createTransform(initial),
      } : {};

      const animateStyles = animate ? {
        opacity: animate.opacity,
        transform: createTransform(animate),
      } : {};

      const transitionStyle = {
        transition: createTransition(transition),
      };

      const combinedStyles = {
        ...style,
        ...initialStyles,
        ...(isAnimated ? animateStyles : {}),
        ...transitionStyle,
      };

      return (
        <div ref={ref} className={className} style={combinedStyles} {...props}>
          {children}
        </div>
      );
    }
  ),
  h1: React.forwardRef<HTMLHeadingElement, MotionProps & React.HTMLAttributes<HTMLHeadingElement>>(
    ({ initial, animate, transition, className, children, style, ...props }, ref) => {
      const [isAnimated, setIsAnimated] = React.useState(false);
      
      React.useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 10);
        return () => clearTimeout(timer);
      }, []);

      const initialStyles = initial ? {
        opacity: initial.opacity,
        transform: createTransform(initial),
      } : {};

      const animateStyles = animate ? {
        opacity: animate.opacity,
        transform: createTransform(animate),
      } : {};

      const transitionStyle = {
        transition: createTransition(transition),
      };

      const combinedStyles = {
        ...style,
        ...initialStyles,
        ...(isAnimated ? animateStyles : {}),
        ...transitionStyle,
      };

      return (
        <h1 ref={ref} className={className} style={combinedStyles} {...props}>
          {children}
        </h1>
      );
    }
  ),
  p: React.forwardRef<HTMLParagraphElement, MotionProps & React.HTMLAttributes<HTMLParagraphElement>>(
    ({ initial, animate, transition, className, children, style, ...props }, ref) => {
      const [isAnimated, setIsAnimated] = React.useState(false);
      
      React.useEffect(() => {
        const timer = setTimeout(() => setIsAnimated(true), 10);
        return () => clearTimeout(timer);
      }, []);

      const initialStyles = initial ? {
        opacity: initial.opacity,
        transform: createTransform(initial),
      } : {};

      const animateStyles = animate ? {
        opacity: animate.opacity,
        transform: createTransform(animate),
      } : {};

      const transitionStyle = {
        transition: createTransition(transition),
      };

      const combinedStyles = {
        ...style,
        ...initialStyles,
        ...(isAnimated ? animateStyles : {}),
        ...transitionStyle,
      };

      return (
        <p ref={ref} className={className} style={combinedStyles} {...props}>
          {children}
        </p>
      );
    }
  ),
};


// for linting
motion.div.displayName = "MotionDiv";
motion.h1.displayName = "MotionH1";
motion.p.displayName = "MotionP";