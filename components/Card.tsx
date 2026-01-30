
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A reusable card component that provides a consistent styled container.
 * It's used throughout the application to wrap sections of content.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the card.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the card.
 * @returns {JSX.Element} A styled div element.
 */
export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-800 rounded-xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
};
