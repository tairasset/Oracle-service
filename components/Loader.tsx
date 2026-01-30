
import React from 'react';

interface LoaderProps {
  size?: number;
}

/**
 * A simple, reusable SVG spinner component to indicate loading states.
 * @param {object} props - The component props.
 * @param {number} [props.size=24] - The width and height of the loader SVG.
 * @returns {JSX.Element} An animated SVG spinner.
 */
export const Loader: React.FC<LoaderProps> = ({ size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
