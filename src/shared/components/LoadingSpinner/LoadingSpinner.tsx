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

type SizeVariant = NonNullable<LoadingSpinnerProps['size']>;

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
export const LoadingSpinner = ({
  size = 'medium',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  // Size variant configurations
  const sizeClasses: Record<SizeVariant, { dot: string; message: string }> = {
    small: {
      dot: 'w-2 h-2',
      message: 'text-sm',
    },
    medium: {
      dot: 'w-3 h-3',
      message: 'text-base',
    },
    large: {
      dot: 'w-4 h-4',
      message: 'text-lg',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center p-8 w-full h-full ${
      fullScreen ? 'fixed inset-0 bg-white/95 backdrop-blur-sm z-[1000]' : ''
    }`}>
      <div className="flex gap-2 items-center">
        <div className={`loading-dot ${currentSize.dot}`} />
        <div className={`loading-dot ${currentSize.dot}`} />
        <div className={`loading-dot ${currentSize.dot}`} />
      </div>
      {message && (
        <p className={`mt-4 text-text-secondary font-medium text-center ${currentSize.message}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
