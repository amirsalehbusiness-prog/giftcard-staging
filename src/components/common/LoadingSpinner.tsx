import React from 'react';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
};

export function LoadingSpinner({ 
  size = 'md', 
  color = 'text-[#0095da]',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-transparent border-t-current ${sizeClasses[size]} ${color} ${className}`} />
  );
}