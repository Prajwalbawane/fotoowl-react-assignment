import { useEffect, useRef } from 'react';
import { BackHandler, type BackHandlerStatic } from 'react-native';

export interface UseModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export interface UseModalReturn {
  /** Whether Android hardware back button should close the modal. Always true. */
  handleBackButton: () => boolean;
}

/**
 * Native equivalent of useLightbox.
 * Manages Android hardware back button dismissal.
 *
 * On iOS, swipe-down dismissal is handled by Modal's onRequestClose.
 * On Android, the hardware back button must be intercepted.
 *
 * SCAFFOLD: Focus trap is handled by React Native's Modal component itself.
 */
export function useModal({ isVisible, onClose }: UseModalProps): UseModalReturn {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isVisible) return;

    const handler = (BackHandler as BackHandlerStatic).addEventListener('hardwareBackPress', () => {
      onCloseRef.current();
      return true; // Prevent default back behavior
    });

    return () => handler.remove();
  }, [isVisible]);

  return {
    handleBackButton: () => {
      onCloseRef.current();
      return true;
    },
  };
}
