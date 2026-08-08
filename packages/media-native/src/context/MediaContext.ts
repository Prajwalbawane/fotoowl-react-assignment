// media-native: MediaContext is identical to media-react since React context
// works the same in React Native. Platform divergence happens in hooks that
// use platform APIs (e.g. AppState, Share, CameraRoll).
export { MediaContext, useSDK } from '@headless-media/react';
