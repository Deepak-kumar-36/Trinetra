import React from 'react';
import './Chip.css';

interface ChipProps {
  label: string;
  variant?: 'danger' | 'secure' | 'caution' | 'neutral';
  className?: string;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({ 
  label, 
  variant = 'neutral',
  className = '',
  icon
}) => {
  const classes = [
    'trinetra-chip',
    `variant-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
    </div>
  );
};
