import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  /**
   * Size variant for the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Optional message to display below the spinner
   */
  message?: string;

  /**
   * Full screen mode - centers spinner in viewport
   * @default false
   */
  fullScreen?: boolean;
}

/**
 * LoadingSpinner displays a loading indicator with optional message.
 * Designed for use with React.lazy and Suspense for code-split routes.
 *
 * @example
 * <Suspense fallback={<LoadingSpinner />}>
 *   <LazyComponent />
 * </Suspense>
 *
 * @example
 * <Suspense fallback={<LoadingSpinner message="Loading projects..." />}>
 *   <ProjectsPage />
 * </Suspense>
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
}) => {
  return (
    <div className={`loading-spinner ${fullScreen ? 'loading-spinner--fullscreen' : ''}`}>
      <div className={`loading-spinner__spinner loading-spinner__spinner--${size}`}>
        <div className="loading-spinner__dot"></div>
        <div className="loading-spinner__dot"></div>
        <div className="loading-spinner__dot"></div>
      </div>
      {message && (
        <p className={`loading-spinner__message loading-spinner__message--${size}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
