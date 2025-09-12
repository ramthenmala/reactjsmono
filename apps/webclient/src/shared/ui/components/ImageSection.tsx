import type { ImageSectionProps } from '../../types/imageSection';

export function ImageSection({
  backgroundImage,
  alt = 'Background image',
  className = '',
  imageClassName = '',
  children,
  hasOverlay = false,
  overlayClassName = 'bg-[linear-gradient(180deg,rgba(10,9,18,0.55),rgba(16,12,26,0.85))]',
}: ImageSectionProps) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`} data-qa-id="image-section">
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${imageClassName}`}
          data-qa-id="image-section-background"
        />
      ) : (
        <div
          className={`absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 ${imageClassName}`}
          data-qa-id="image-section-placeholder"
        >
          <div className='flex items-center justify-center h-full text-gray-400' data-qa-id="image-section-placeholder-content">
            <div className='text-center' data-qa-id="image-section-placeholder-inner">
              <svg
                className='mx-auto h-16 w-16 mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 48 48'
                data-qa-id="image-section-placeholder-icon"
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2 2l1.586-1.586a2 2 0 012.828 0L32 30m-10-2l-8-8m0 0L6 14m8 6l8-8m8 8v10a2 2 0 01-2 2H6a2 2 0 01-2-2V16z'
                />
              </svg>
              <p className='text-sm font-medium' data-qa-id="image-section-placeholder-text">Image not available</p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {hasOverlay && <div className={`absolute inset-0 ${overlayClassName}`} data-qa-id="image-section-overlay" />}

      {/* Content */}
      {children && <div className='relative z-10' data-qa-id="image-section-content">{children}</div>}
    </section>
  );
}
