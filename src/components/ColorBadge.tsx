import React from 'react';

interface ColorBadgeProps {
  color?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ColorBadge({ color = '#CCCCCC', className = '', size = 'md' }: ColorBadgeProps) {
  // Tamaños predefinidos para el badge
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} rounded-full ${className}`} style={{ backgroundColor: color }} title="Color del vehículo" />
  );
}
