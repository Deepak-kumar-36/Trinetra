import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  size?: 'default' | 'large' | 'tactical';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  size = 'default',
  className = '',
  ...props 
}) => {
  const classes = [
    'trinetra-button',
    `variant-${variant}`,
    `size-${size}`,
    fullWidth ? 'full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      <span className="button-content">{children}</span>
    </button>
  );
};
