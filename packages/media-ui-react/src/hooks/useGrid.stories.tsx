import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { useGrid } from '../hooks/useGrid.js';

interface DemoItem {
  id: number;
  label: string;
  color: string;
}

function generateItems(start: number, count: number): DemoItem[] {
  const colors = ['#6b7bff', '#ff6b6b', '#6bffb8', '#ffb86b', '#b86bff'];
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    label: `Item ${start + i + 1}`,
    color: colors[(start + i) % colors.length] ?? '#6b7bff',
  }));
}

function GridDemo() {
  const [items, setItems] = useState<DemoItem[]>(() => generateItems(0, 12));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { getContainerProps, getItemProps, getSentinelProps } = useGrid({
    items,
    hasMore,
    isLoading,
    onLoadMore: () => {
      if (isLoading) return;
      setIsLoading(true);
      setTimeout(() => {
        setItems((prev) => [...prev, ...generateItems(prev.length, 8)]);
        setHasMore(items.length < 40);
        setIsLoading(false);
      }, 800);
    },
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem', fontFamily: 'sans-serif' }}>
        useGrid — Infinite Scroll Demo
      </h2>
      <div
        {...getContainerProps()}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            {...getItemProps(item)}
            style={{
              height: 80,
              backgroundColor: item.color,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'sans-serif',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div
        {...getSentinelProps()}
        style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isLoading && (
          <span style={{ fontFamily: 'sans-serif', color: '#888' }}>Loading more...</span>
        )}
        {!hasMore && (
          <span style={{ fontFamily: 'sans-serif', color: '#888' }}>All items loaded</span>
        )}
      </div>
    </div>
  );
}

const meta: Meta<typeof GridDemo> = {
  title: 'Hooks/useGrid',
  component: GridDemo,
  parameters: {
    docs: {
      description: {
        component:
          '`useGrid` is a headless hook that provides prop-getters for an infinite-scroll grid. ' +
          'It uses IntersectionObserver to trigger `onLoadMore` when the sentinel enters the viewport. ' +
          'All styling is provided by the consumer.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridDemo>;

export const Default: Story = {};
