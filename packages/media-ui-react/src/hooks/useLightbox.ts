import {
  useRef,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from 'react';

export interface UseLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface UseLightboxReturn {
  /** Props for the backdrop/overlay element. */
  getBackdropProps: () => HTMLAttributes<HTMLElement>;
  /** Props for the dialog/container element. */
  getDialogProps: () => HTMLAttributes<HTMLElement> & { ref: (el: HTMLElement | null) => void };
  /** Props for the close button. */
  getCloseButtonProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  /** Props for the "next" navigation button. */
  getNextButtonProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  /** Props for the "prev" navigation button. */
  getPrevButtonProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * Headless lightbox/dialog hook.
 *
 * Responsibilities:
 * - Focus trap: when open, Tab/Shift+Tab cycle within the dialog
 * - Keyboard navigation: Esc closes, ArrowRight/ArrowLeft navigate
 * - ARIA: role="dialog", aria-modal, aria-label
 * - Body scroll lock: prevents background scroll when open
 * - Restore focus: returns focus to the trigger element when closed
 *
 * WHY no Portal: This hook doesn't render anything — it's the consumer's
 * responsibility to mount the lightbox where they need it (including in a
 * Portal if desired).
 *
 * @example
 * ```tsx
 * const { getDialogProps, getBackdropProps, getCloseButtonProps } = useLightbox({
 *   isOpen,
 *   onClose,
 *   onNext,
 *   onPrev,
 * });
 *
 * if (!isOpen) return null;
 * return (
 *   <div {...getBackdropProps()}>
 *     <div {...getDialogProps()}>
 *       <button {...getCloseButtonProps()}>✕</button>
 *       {children}
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useLightbox({
  isOpen,
  onClose,
  onNext,
  onPrev,
  hasNext = true,
  hasPrev = true,
}: UseLightboxProps): UseLightboxReturn {
  const dialogRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save the element that triggered the open, restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      // Defer focus to allow the dialog to mount
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          onNext?.();
          break;
        case 'ArrowLeft':
          onPrev?.();
          break;
        case 'Tab':
          trapFocus(e, dialogRef.current);
          break;
      }
    },
    [onClose, onNext, onPrev],
  );

  const getBackdropProps = useCallback(
    (): HTMLAttributes<HTMLElement> => ({
      role: 'presentation',
      onClick: (e) => {
        // Close only if clicking the backdrop itself, not its children
        if (e.target === e.currentTarget) onClose();
      },
    }),
    [onClose],
  );

  const getDialogProps = useCallback(
    (): HTMLAttributes<HTMLElement> & { ref: (el: HTMLElement | null) => void } => ({
      role: 'dialog',
      'aria-modal': true,
      'aria-label': 'Media viewer',
      tabIndex: -1,
      onKeyDown: handleKeyDown,
      ref: (el: HTMLElement | null) => {
        dialogRef.current = el;
      },
    }),
    [handleKeyDown],
  );

  const getCloseButtonProps = useCallback(
    (): ButtonHTMLAttributes<HTMLButtonElement> => ({
      type: 'button',
      'aria-label': 'Close viewer',
      onClick: onClose,
    }),
    [onClose],
  );

  const getNextButtonProps = useCallback(
    (): ButtonHTMLAttributes<HTMLButtonElement> => ({
      type: 'button',
      'aria-label': 'Next item',
      'aria-disabled': !hasNext,
      onClick: onNext,
      tabIndex: hasNext ? 0 : -1,
    }),
    [hasNext, onNext],
  );

  const getPrevButtonProps = useCallback(
    (): ButtonHTMLAttributes<HTMLButtonElement> => ({
      type: 'button',
      'aria-label': 'Previous item',
      'aria-disabled': !hasPrev,
      onClick: onPrev,
      tabIndex: hasPrev ? 0 : -1,
    }),
    [hasPrev, onPrev],
  );

  return {
    getBackdropProps,
    getDialogProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  };
}

/**
 * Traps focus within a container element.
 * Cycles through focusable children on Tab/Shift+Tab.
 */
function trapFocus(e: KeyboardEvent, container: HTMLElement | null): void {
  if (container === null) return;

  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
}
