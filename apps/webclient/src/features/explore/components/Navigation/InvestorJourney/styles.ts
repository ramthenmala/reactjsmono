/**
 * InvestorJourney Component Styles
 * Consolidated styles for all InvestorJourney components
 */

export const investorJourneyStyles = {
  // Main section styles
  section: {
    base: 'relative overflow-visible flex flex-col items-start gap-20',
    style: {
      background:
        'radial-gradient(134.48% 100% at 50% 100%, rgba(216, 200, 255, 0.50) 0%, rgba(255, 255, 255, 0.00) 100%)',
    },
  },

  container: 'container relative z-10 py-5 md:pt-25 md:pb-50 flex flex-col items-center gap-12 md:gap-20',

  header: {
    wrapper: 'text-center flex flex-col gap-8',
    title:
      'font-semibold text-4xl tracking-[-0.02em] md:text-5xl bg-gradient-to-r from-brand-900 to-brand-600 bg-clip-text text-transparent',
    content:
      'font-medium text-base tracking-normal md:text-[23px] text-secondary',
  },

  // Mobile slider styles
  mobileSlider: {
    container:
      'md:hidden flex items-center justify-center overflow-hidden pb-4 pt-12',
    containerStyle: {
      touchAction: 'pan-x' as const,
      width: '100%',
      maxWidth: '100%',
    },
    track: 'flex transition-transform duration-300 ease-in-out',
    trackStyle: (isRTL: boolean, activeIndex: number) => ({
      transform: isRTL
        ? `translateX(${activeIndex * 100}%)` // RTL
        : `translateX(-${activeIndex * 100}%)`, // LTR
      width: '80%',
    }),
    slide: (isActive: boolean) => `
      flex flex-col items-center min-h-[290px] p-12 gap-5
      rounded-[20px] border border-[#EBEDEF] bg-white
      shadow-[0_12px_16px_-4px_rgba(16,24,40,0.04),0_4px_6px_-2px_rgba(16,24,40,0.02)]
      backdrop-blur-[7.5px] transition-all duration-300
      ${isActive ? 'opacity-100 scale-100' : 'opacity-80 scale-95'}
    `,
    slideStyle: {
      minWidth: '100%',
      maxWidth: '100%',
    },
  },

  // Navigation dots styles
  dots: {
    container: 'md:hidden flex justify-center mt-4 gap-2',
    button: (isActive: boolean) =>
      `w-2 h-2 rounded-full ${isActive ? 'bg-[#6C4EEA]' : 'bg-[#E0D7FF]'}`,
    buttonStyle: {
      outline: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
    },
  },

  // Desktop grid styles
  desktopGrid: {
    container: 'hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6',
    card: {
      wrapper: 'transition-all duration-200',
    },
  },

  // Shared card content styles
  cardContent: {
    icon: {
      container:
        'w-12 h-12 rounded-[10px] border border-[#5547B5] bg-white p-2 flex items-center justify-center',
      image: 'w-6 h-6',
    },
    text: {
      wrapper: 'flex flex-col items-center gap-2 text-center',
      wrapperMobile: 'flex flex-col items-center gap-2 text-center px-4',
      title: 'text-lg font-semibold text-[#171B23] leading-7',
      content: 'text-sm text-gray-500 leading-5',
    },
  },
};
