export const exploreActionsStyles = {
  container: (className: string) => `flex items-center gap-3 ${className}`,
  button: {
    common:
      "relative overflow-hidden rounded-xl backdrop-blur-xl px-3 py-2 text-white shadow-md before:absolute before:inset-0 before:rounded-xl before:border before:border-white/80 before:opacity-50 before:content-[''] before:pointer-events-none before:z-0",
    variants: {
      dark: 'bg-black/50',
      light: 'bg-white/50',
    },
    getClasses(variant: 'light' | 'dark') {
      return `${this.common} ${this.variants[variant]}`;
    },
  },
  icon: {
    compare: 'me-2 inline-block size-5 relative z-10',
    share: 'me-2 inline-block size-5 relative z-10',
  },
  text: 'relative z-10',
};
