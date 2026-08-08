export interface VideoFile {
  readonly id: number;
  readonly quality: 'sd' | 'hd' | 'uhd';
  readonly fileType: string;
  readonly width: number | null;
  readonly height: number | null;
  readonly fps: number | null;
  readonly link: string;
  readonly size: number | null;
}

export interface VideoPicture {
  readonly id: number;
  readonly nr: number;
  readonly picture: string;
}

export interface VideoUser {
  readonly id: number;
  readonly name: string;
  readonly url: string;
}

export interface Video {
  readonly id: number;
  readonly width: number;
  readonly height: number;
  readonly url: string;
  readonly image: string;
  readonly duration: number;
  readonly user: VideoUser;
  readonly videoFiles: VideoFile[];
  readonly videoPictures: VideoPicture[];
}

/**
 * Returns the best video file for the given preferred quality.
 * Falls back to `hd` then any available file.
 */
export function getBestVideoFile(
  video: Video,
  preferredQuality: 'sd' | 'hd' | 'uhd' = 'hd',
): VideoFile | undefined {
  const byQuality = video.videoFiles.find((f) => f.quality === preferredQuality);
  if (byQuality !== undefined) return byQuality;

  const fallback = video.videoFiles.find((f) => f.quality === 'hd');
  return fallback ?? video.videoFiles[0];
}
