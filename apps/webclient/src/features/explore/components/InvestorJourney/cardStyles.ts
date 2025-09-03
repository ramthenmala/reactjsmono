/**
 * InvestorJourney Card Style Constants
 * Based on the style guide specifications
 */

export const cardStyles = {
  // Base card styles
  base: `
    flex flex-col items-center
    h-[290px] min-w-[240px] p-12
    gap-5 flex-1
    rounded-[20px] border border-[#EBEDEF]
    bg-white
    shadow-[0_12px_16px_-4px_rgba(16,24,40,0.04),0_4px_6px_-2px_rgba(16,24,40,0.02)]
    backdrop-blur-[7.5px]
  `,
  
  // Interactive states
  hover: `
    hover:shadow-[0_20px_24px_-4px_rgba(16,24,40,0.08),0_8px_8px_-2px_rgba(16,24,40,0.04)]
    hover:border-[#D5D9DD]
  `,
  
  // Icon container
  icon: `
    w-12 h-12 rounded-[10px] 
    border border-[#5547B5] 
    bg-white p-2 
    flex items-center justify-center
  `,
  
  // Mobile specific
  mobile: {
    base: `
      flex flex-col items-center
      min-h-[290px] p-12 gap-5
      rounded-[20px] border border-[#EBEDEF]
      bg-white
      shadow-[0_12px_16px_-4px_rgba(16,24,40,0.04),0_4px_6px_-2px_rgba(16,24,40,0.02)]
      backdrop-blur-[7.5px]
    `,
    active: 'opacity-100 scale-100',
    inactive: 'opacity-80 scale-95',
  }
};

// CSS variables that can be added to tailwind.config.js
export const cssVariables = {
  '--spacing-2xl': '20px',
  '--colors-border-secondary': '#EBEDEF',
  '--colors-bg-primary': '#FFFFFF',
  '--shadow-xs': '0 12px 16px -4px rgba(16, 24, 40, 0.04), 0 4px 6px -2px rgba(16, 24, 40, 0.02)',
  '--shadow-sm': '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -2px rgba(16, 24, 40, 0.04)',
  '--backdrop-blur': '7.5px',
};