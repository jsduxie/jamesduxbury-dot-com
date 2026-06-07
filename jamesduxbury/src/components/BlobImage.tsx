'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

// a deleted blob 404s; hide the image and its wrapper frame rather than break layout
export function BlobImage({
  wrapperClassName,
  ...props
}: ImageProps & { wrapperClassName?: string }) {
  // track the failed src so a later valid src is not left hidden
  const [failedSrc, setFailedSrc] = useState<ImageProps['src'] | null>(null);
  if (failedSrc === props.src) return null;
  const image = <Image {...props} onError={() => setFailedSrc(props.src)} />;
  return wrapperClassName ? <div className={wrapperClassName}>{image}</div> : image;
}
