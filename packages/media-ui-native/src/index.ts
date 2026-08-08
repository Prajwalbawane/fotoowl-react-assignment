/**
 * @headless-media/ui-native
 *
 * Headless React Native UI hooks for media display.
 *
 * STATUS: Scaffold — hook signatures are defined and exported.
 * Implementation would use React Native's ScrollView, FlatList, and
 * Animated APIs instead of web IntersectionObserver/scroll APIs.
 *
 * Same headless contract as @headless-media/ui-react:
 * - No styles shipped
 * - No SDK imports
 * - Data comes via props
 * - Prop-getter pattern
 */

export { useList } from './hooks/useList.js';
export { useModal } from './hooks/useModal.js';
export { useSnapScroller } from './hooks/useSnapScroller.js';

export type { UseListProps, UseListReturn } from './hooks/useList.js';
export type { UseModalProps, UseModalReturn } from './hooks/useModal.js';
export type { UseSnapScrollerProps, UseSnapScrollerReturn } from './hooks/useSnapScroller.js';
