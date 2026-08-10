import { j as i } from './jsx-runtime-CFY_2KVU.js';
import { r as t } from './index-Dq4ZvVuH.js';
import './_commonjsHelpers-CqkleIqs.js';
function y({ items: n, hasMore: l, isLoading: e, onLoadMore: o, loadMoreThreshold: s = '200px' }) {
  const [a, m] = t.useState(null),
    c = t.useRef(!1),
    f = t.useRef(o);
  (t.useEffect(() => {
    f.current = o;
  }, [o]),
    t.useEffect(() => {
      if (a === null) return;
      const u = new IntersectionObserver(
        (h) => {
          h[0]?.isIntersecting && l && !e && f.current();
        },
        { rootMargin: s },
      );
      return (
        u.observe(a),
        (c.current = !0),
        () => {
          (u.disconnect(), (c.current = !1));
        }
      );
    }, [a, l, e, s]));
  const r = t.useCallback(() => ({ role: 'list', 'aria-busy': e }), [e]),
    g = t.useCallback((u) => ({ role: 'listitem', 'data-item-id': u.id }), []),
    b = t.useCallback(() => ({ ref: m, 'aria-hidden': !0, role: 'presentation' }), []);
  return { getContainerProps: r, getItemProps: g, getSentinelProps: b, isObserving: c.current };
}
function p(n, l) {
  const e = ['#6b7bff', '#ff6b6b', '#6bffb8', '#ffb86b', '#b86bff'];
  return Array.from({ length: l }, (o, s) => ({
    id: n + s,
    label: `Item ${n + s + 1}`,
    color: e[(n + s) % e.length] ?? '#6b7bff',
  }));
}
function x() {
  const [n, l] = t.useState(() => p(0, 12)),
    [e, o] = t.useState(!1),
    [s, a] = t.useState(!0),
    {
      getContainerProps: m,
      getItemProps: c,
      getSentinelProps: f,
    } = y({
      items: n,
      hasMore: s,
      isLoading: e,
      onLoadMore: () => {
        e ||
          (o(!0),
          setTimeout(() => {
            (l((r) => [...r, ...p(r.length, 8)]), a(n.length < 40), o(!1));
          }, 800));
      },
    });
  return i.jsxs('div', {
    style: { maxWidth: 800, margin: '0 auto', padding: '1rem' },
    children: [
      i.jsx('h2', {
        style: { marginBottom: '1rem', fontFamily: 'sans-serif' },
        children: 'useGrid — Infinite Scroll Demo',
      }),
      i.jsx('div', {
        ...m(),
        style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' },
        children: n.map((r) =>
          i.jsx(
            'div',
            {
              ...c(r),
              style: {
                height: 80,
                backgroundColor: r.color,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'sans-serif',
                fontSize: 12,
                fontWeight: 600,
              },
              children: r.label,
            },
            r.id,
          ),
        ),
      }),
      i.jsxs('div', {
        ...f(),
        style: { height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' },
        children: [
          e &&
            i.jsx('span', {
              style: { fontFamily: 'sans-serif', color: '#888' },
              children: 'Loading more...',
            }),
          !s &&
            i.jsx('span', {
              style: { fontFamily: 'sans-serif', color: '#888' },
              children: 'All items loaded',
            }),
        ],
      }),
    ],
  });
}
const C = {
    title: 'Hooks/useGrid',
    component: x,
    parameters: {
      docs: {
        description: {
          component:
            '`useGrid` is a headless hook that provides prop-getters for an infinite-scroll grid. It uses IntersectionObserver to trigger `onLoadMore` when the sentinel enters the viewport. All styling is provided by the consumer.',
        },
      },
    },
  },
  d = {};
d.parameters = {
  ...d.parameters,
  docs: { ...d.parameters?.docs, source: { originalSource: '{}', ...d.parameters?.docs?.source } },
};
const k = ['Default'];
export { d as Default, k as __namedExportsOrder, C as default };
