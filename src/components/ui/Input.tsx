import React, { forwardRef } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
    const wrapperClasses = [
      'trinetra-input-wrapper',
      fullWidth ? 'full-width' : '',
      error ? 'has-error' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapperClasses}>
        <label className="trinetra-input-label">{label}</label>
        <input 
          ref={ref}
          className="trinetra-input"
          {...props} 
        />
        {error && <span className="trinetra-input-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
