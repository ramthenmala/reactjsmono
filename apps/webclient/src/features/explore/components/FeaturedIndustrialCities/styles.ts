export const featuredCitiesStyles = {
  section: {
    base: 'w-full flex flex-col justify-center items-center gap-[80px] relative px-4 py-12 md:px-20 md:py-40',
    style: {
      overflow: 'visible',
      maxWidth: '1440px',
      margin: '0 auto',
      background:
        'radial-gradient(73.04% 54.31% at 50% 0%, rgba(237, 230, 255, 0.60) 0%, rgba(255, 255, 255, 0.00) 100%)',
    },
  },

  backgroundPattern: {
    container: 'hidden md:block absolute',
    style: {
      left: '50%',
      top: '-60px',
      transform: 'translateX(-50%)',
      zIndex: 0,
      width: '1400px',
      height: '800px',
      pointerEvents: 'none' as const,
      userSelect: 'none' as const,
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
    },
  },

  content: {
    wrapper: 'relative z-10 w-full flex flex-col items-center gap-[80px]',
    header: {
      container: 'text-center',
      title:
        'font-semibold text-[36px] leading-[42px] tracking-[-0.02em] md:text-[48px] md:leading-[60px] text-[#5547B5] mb-4',
      subtitle:
        'font-medium text-base leading-[22px] tracking-normal md:text-[23px] md:leading-[30px] text-gray-600',
    },
  },

  mobileSlider: {
    container:
      'md:hidden flex items-center justify-center overflow-hidden pb-4',
    containerStyle: {
      touchAction: 'pan-x' as const,
      width: '100%',
      maxWidth: '100%',
    },
    track: (isRTL: boolean) =>
      `flex transition-transform duration-300 ease-in-out ${
        isRTL ? 'flex-row-reverse' : ''
      }`,
    trackStyle: (activeIndex: number) => ({
      transform: `translateX(-${activeIndex * 100}%)`,
      width: '100%',
    }),
    slide: (isActive: boolean) => ({
      minWidth: '100%',
      maxWidth: '100%',
      margin: 0,
      opacity: isActive ? 1 : 0.7,
      transition: 'opacity 0.3s',
    }),
  },

  dots: {
    container: 'md:hidden flex justify-center mt-4 gap-2',
    button: (isActive: boolean) =>
      `w-2 h-2 rounded-full transition-colors ${
        isActive ? 'bg-[#6C4EEA]' : 'bg-[#E0D7FF]'
      }`,
    buttonStyle: {
      outline: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
    },
  },

  desktopGrid:
    'hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 items-start',
};
