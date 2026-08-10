import { j as o } from './jsx-runtime-CFY_2KVU.js';
import { r } from './index-Dq4ZvVuH.js';
import { r as y } from './index-DIj25HPu.js';
import './_commonjsHelpers-CqkleIqs.js';
import './index-COLzDPgv.js';
function k({ isOpen: s, onClose: e, onNext: t, onPrev: n, hasNext: l = !0, hasPrev: c = !0 }) {
  const d = r.useRef(null),
    p = r.useRef(null);
  (r.useEffect(() => {
    s
      ? ((p.current = document.activeElement),
        requestAnimationFrame(() => {
          d.current?.focus();
        }))
      : p.current?.focus();
  }, [s]),
    r.useEffect(() => {
      if (!s) return;
      const i = document.body.style.overflow;
      return (
        (document.body.style.overflow = 'hidden'),
        () => {
          document.body.style.overflow = i;
        }
      );
    }, [s]));
  const b = r.useCallback(
      (i) => {
        switch (i.key) {
          case 'Escape':
            e();
            break;
          case 'ArrowRight':
            t?.();
            break;
          case 'ArrowLeft':
            n?.();
            break;
          case 'Tab':
            w(i, d.current);
            break;
        }
      },
      [e, t, n],
    ),
    u = r.useCallback(
      () => ({
        role: 'presentation',
        onClick: (i) => {
          i.target === i.currentTarget && e();
        },
      }),
      [e],
    ),
    a = r.useCallback(
      () => ({
        role: 'dialog',
        'aria-modal': !0,
        'aria-label': 'Media viewer',
        tabIndex: -1,
        onKeyDown: b,
        ref: (i) => {
          d.current = i;
        },
      }),
      [b],
    ),
    m = r.useCallback(() => ({ type: 'button', 'aria-label': 'Close viewer', onClick: e }), [e]),
    h = r.useCallback(
      () => ({
        type: 'button',
        'aria-label': 'Next item',
        'aria-disabled': !l,
        onClick: t,
        tabIndex: l ? 0 : -1,
      }),
      [l, t],
    ),
    x = r.useCallback(
      () => ({
        type: 'button',
        'aria-label': 'Previous item',
        'aria-disabled': !c,
        onClick: n,
        tabIndex: c ? 0 : -1,
      }),
      [c, n],
    );
  return {
    getBackdropProps: u,
    getDialogProps: a,
    getCloseButtonProps: m,
    getNextButtonProps: h,
    getPrevButtonProps: x,
  };
}
function w(s, e) {
  if (e === null) return;
  const t = e.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
    n = t[0],
    l = t[t.length - 1];
  s.shiftKey
    ? document.activeElement === n && (s.preventDefault(), l?.focus())
    : document.activeElement === l && (s.preventDefault(), n?.focus());
}
const f = [
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
function j() {
  const [s, e] = r.useState(!1),
    [t, n] = r.useState(0),
    {
      getBackdropProps: l,
      getDialogProps: c,
      getCloseButtonProps: d,
      getNextButtonProps: p,
      getPrevButtonProps: b,
    } = k({
      isOpen: s,
      onClose: () => e(!1),
      onNext: () => n((a) => Math.min(a + 1, f.length - 1)),
      onPrev: () => n((a) => Math.max(a - 1, 0)),
      hasNext: t < f.length - 1,
      hasPrev: t > 0,
    }),
    u = f[t];
  return o.jsxs('div', {
    style: { fontFamily: 'sans-serif', padding: '2rem' },
    children: [
      o.jsx('h2', {
        style: { marginBottom: '1rem' },
        children: 'useLightbox — Accessible Dialog Demo',
      }),
      o.jsx('p', {
        style: { marginBottom: '1.5rem', color: '#666' },
        children:
          'Open the lightbox and try: Esc to close, ArrowLeft/Right to navigate, Tab to cycle focus.',
      }),
      o.jsx('div', {
        style: { display: 'flex', gap: '1rem' },
        children: f.map((a, m) =>
          o.jsx(
            'button',
            {
              onClick: () => {
                (n(m), e(!0));
              },
              style: {
                border: 'none',
                cursor: 'pointer',
                borderRadius: 8,
                overflow: 'hidden',
                padding: 0,
              },
              'aria-label': `Open ${a.alt}`,
              children: o.jsx('img', {
                src: a.src,
                alt: a.alt,
                style: { width: 160, height: 120, objectFit: 'cover', display: 'block' },
              }),
            },
            a.id,
          ),
        ),
      }),
      s &&
        u &&
        y.createPortal(
          o.jsxs('div', {
            ...l(),
            style: {
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1e3,
            },
            children: [
              o.jsx('div', {
                ...c(),
                style: { position: 'relative', outline: 'none' },
                children: o.jsx('img', {
                  src: u.src,
                  alt: u.alt,
                  style: {
                    maxWidth: '80vw',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    borderRadius: 8,
                  },
                }),
              }),
              o.jsx('button', {
                ...d(),
                style: {
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
                },
                children: '✕',
              }),
              o.jsx('button', {
                ...b(),
                style: {
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
                },
                children: '‹',
              }),
              o.jsx('button', {
                ...p(),
                style: {
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
                },
                children: '›',
              }),
            ],
          }),
          document.body,
        ),
    ],
  });
}
const R = { title: 'Hooks/useLightbox', component: j },
  g = {};
g.parameters = {
  ...g.parameters,
  docs: { ...g.parameters?.docs, source: { originalSource: '{}', ...g.parameters?.docs?.source } },
};
const P = ['Default'];
export { g as Default, P as __namedExportsOrder, R as default };
