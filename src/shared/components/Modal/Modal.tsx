import React, { useEffect, useCallback, MouseEvent, KeyboardEvent } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  /**
   * Whether the modal is currently open
   */
  isOpen: boolean;

  /**
   * Callback when modal should close
   */
  onClose: () => void;

  /**
   * Modal title displayed in header
   */
  title?: string;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Size variant for the modal
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether clicking backdrop closes the modal
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing Escape closes the modal
   * @default true
   */
  closeOnEscape?: boolean;
}

type SizeVariant = NonNullable<ModalProps['size']>;

/**
 * Modal component for displaying content in an overlay dialog.
 * Renders into a portal to avoid z-index and overflow issues.
 *
 * @example
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Project">
 *   <ProjectForm project={project} onSave={handleSave} onCancel={handleCancel} />
 * </Modal>
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) => {
  // Size variant configurations
  const sizeClasses: Record<SizeVariant, string> = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
  };

  // Handle Escape key press
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [closeOnEscape, isOpen, onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose]
  );

  // Add/remove event listener for Escape key
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape as unknown as EventListener);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape as unknown as EventListener);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  // Don't render anything if modal is closed
  if (!isOpen) {
    return null;
  }

  // Render into portal to avoid z-index and overflow issues
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`bg-bg-primary rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            <button
              type="button"
              className="p-1 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded transition-colors duration-fast"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
