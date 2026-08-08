import { useState, useCallback } from 'react';
import { useSDK } from '../context/MediaContext.js';

interface UseDownloadState {
  isDownloading: boolean;
  error: Error | null;
}

interface UseDownloadActions {
  download: (
    url: string,
    mediaId: number,
    mediaType: 'photo' | 'video',
    filename?: string,
  ) => Promise<void>;
}

type UseDownloadReturn = UseDownloadState & UseDownloadActions;

/**
 * Handles media download with SDK event emission.
 *
 * WHY this hook emits the event: The assignment requires the SDK to emit a
 * `download` event. Since `media-ui-react` cannot import the SDK, the
 * download action must be initiated from this hook and passed as a callback
 * to UI components.
 *
 * @example
 * ```tsx
 * const { download, isDownloading } = useDownload();
 * <button onClick={() => download(photo.src.original, photo.id, 'photo')}>
 *   Download
 * </button>
 * ```
 */
export function useDownload(): UseDownloadReturn {
  const sdk = useSDK();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const download = useCallback(
    async (
      url: string,
      mediaId: number,
      mediaType: 'photo' | 'video',
      filename?: string,
    ): Promise<void> => {
      setIsDownloading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = filename ?? `media-${mediaId}`;
        anchor.click();
        URL.revokeObjectURL(objectUrl);

        sdk.events.emit('download', { mediaId, mediaType, url });
      } catch (err) {
        const downloadError = err instanceof Error ? err : new Error('Download failed');
        setError(downloadError);
        sdk.events.emit('error', {
          code: 'DOWNLOAD_FAILED',
          message: downloadError.message,
          cause: err,
        });
      } finally {
        setIsDownloading(false);
      }
    },
    [sdk],
  );

  return { isDownloading, error, download };
}
