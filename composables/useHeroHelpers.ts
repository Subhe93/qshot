/**
 * Pure helper functions for hero layouts. SSR-safe (no window/document).
 */
export function numberToHexText(num: number): string {
  const red = (num >> 16) & 0xff;
  const green = (num >> 8) & 0xff;
  const blue = num & 0xff;
  return `rgb(${red}, ${green}, ${blue})`;
}

export function getCoverPhotoAspectRatio(coverPhoto: { shape?: string; size?: string } | null): string {
  if (!coverPhoto) return 'aspect-ratio: 16 / 9;';
  const shape = coverPhoto.shape;
  const size = coverPhoto.size;
  if (shape === 'horizontal' || (!shape && size === 'horizontal')) {
    return 'aspect-ratio: 16 / 9;';
  }
  if (shape === 'square' || (!shape && size === 'square')) {
    return 'aspect-ratio: 1 / 1;';
  }
  if (shape === 'poster' || (!shape && size === 'poster')) {
    return 'aspect-ratio: 4 / 5;';
  }
  if (shape === 'vertical' || (!shape && size === 'vertical')) {
    return 'aspect-ratio: 9 / 16;';
  }
  return 'aspect-ratio: 16 / 9;';
}

export function getProfilePicturePosition(
  coverPhoto: { image_url?: string; hide?: boolean; shape?: string; size?: string } | null,
  alignment?: string
): Record<string, string> {
  const basePosition: Record<string, string> = {
    position: 'absolute',
    'z-index': '10',
  };
  if (alignment === 'center' || !alignment) {
    basePosition.left = '50%';
    basePosition.transform = 'translateX(-50%)';
  } else if (alignment === 'start' || alignment === 'left') {
    basePosition.left = '1.25rem';
    basePosition.transform = 'none';
  } else if (alignment === 'end' || alignment === 'right') {
    basePosition.right = '1.25rem';
    basePosition.left = 'auto';
    basePosition.transform = 'none';
  }
  if (!coverPhoto || !coverPhoto.image_url || coverPhoto.hide === true) {
    return {
      ...basePosition,
      bottom: 'calc(-1 * clamp(52px, 5vw, 80px))',
    };
  }
  const shape = coverPhoto.shape;
  const size = coverPhoto.size;
  if (shape === 'horizontal' || (!shape && size === 'horizontal')) {
    return {
      ...basePosition,
      bottom: 'calc(-1 * clamp(52px, 5vw, 80px))',
    };
  }
  if (
    shape === 'square' ||
    (!shape && size === 'square') ||
    shape === 'poster' ||
    (!shape && size === 'poster') ||
    shape === 'vertical' ||
    (!shape && size === 'vertical')
  ) {
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      'z-index': '10',
    };
  }
  return {
    ...basePosition,
    bottom: '2rem',
  };
}
