import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLightbox } from '../hooks/useLightbox.js';

const DEMO_IMAGES = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?w=800',
    alt: 'Mountain landscape',
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?w=800',
    alt: 'Forest path',
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?w=800',
    alt: 'Ocean waves',
  },
];

function LightboxDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    getBackdropProps,
    getDialogProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  } = useLightbox({
    isOpen,
    onClose: () => setIsOpen(false),
    onNext: () => setCurrentIndex((i) => Math.min(i + 1, DEMO_IMAGES.length - 1)),
    onPrev: () => setCurrentIndex((i) => Math.max(i - 1, 0)),
    hasNext: currentIndex < DEMO_IMAGES.length - 1,
    hasPrev: currentIndex > 0,
  });

  const current = DEMO_IMAGES[currentIndex];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>useLightbox — Accessible Dialog Demo</h2>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        Open the lightbox and try: Esc to close, ArrowLeft/Right to navigate, Tab to cycle focus.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {DEMO_IMAGES.map((img, i) => (
          <button
            key={img.id}
            onClick={() => {
              setCurrentIndex(i);
              setIsOpen(true);
            }}
            style={{
              border: 'none',
              cursor: 'pointer',
              borderRadius: 8,
              overflow: 'hidden',
              padding: 0,
            }}
            aria-label={`Open ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: 160, height: 120, objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
      </div>

      {isOpen &&
        current &&
        createPortal(
          <div
            {...getBackdropProps()}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div {...getDialogProps()} style={{ position: 'relative', outline: 'none' }}>
              <img
                src={current.src}
                alt={current.alt}
                style={{
                  maxWidth: '80vw',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: 8,
                }}
              />
            </div>
            <button
              {...getCloseButtonProps()}
              style={{
                position: 'fixed',
                top: 16,
                right: 16,
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
              }}
            >
              ✕
            </button>
            <button
              {...getPrevButtonProps()}
              style={{
                position: 'fixed',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </button>
            <button
              {...getNextButtonProps()}
              style={{
                position: 'fixed',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}

const meta: Meta<typeof LightboxDemo> = {
  title: 'Hooks/useLightbox',
  component: LightboxDemo,
};

export default meta;
type Story = StoryObj<typeof LightboxDemo>;

export const Default: Story = {};
