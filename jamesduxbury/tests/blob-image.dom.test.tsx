// @vitest-environment jsdom
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BlobImage } from '../src/components/BlobImage';

describe('BlobImage', () => {
  it('renders the image until it fails, then hides it', () => {
    const { container } = render(
      <BlobImage src="https://x.public.blob.vercel-storage.com/dev/a.png" alt="a" width={10} height={10} />,
    );
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    fireEvent.error(img!);
    expect(container.querySelector('img')).toBeNull();
  });

  it('removes its wrapper frame on error', () => {
    const { container } = render(
      <BlobImage
        wrapperClassName="frame"
        src="https://x.public.blob.vercel-storage.com/dev/b.png"
        alt="b"
        width={10}
        height={10}
      />,
    );
    expect(container.querySelector('.frame')).not.toBeNull();
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('.frame')).toBeNull();
  });
});
