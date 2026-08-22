import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'hazard' | 'elevated';
  hazardStatus?: 'danger' | 'caution' | 'secure';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default',
  hazardStatus,
  className = '',
  onClick
}) => {
  const classes = [
    'trinetra-card',
    `variant-${variant}`,
    hazardStatus ? `hazard-${hazardStatus}` : '',
    onClick ? 'clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {variant === 'hazard' && <div className="hazard-bar" />}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};
