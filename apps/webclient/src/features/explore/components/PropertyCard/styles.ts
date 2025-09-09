/**
 * PropertyCard Component Styles
 */

export const propertyCardStyles = {
  container: "overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 flex flex-col h-full group",
  imageContainer: "relative h-40 overflow-hidden rounded-t-2xl",
  image: "object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110",
  imageOverlay: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-2xl",
  featuredBadge: "absolute top-3 left-3 z-10",
  featuredButton: "rounded-[12px] bg-[rgba(0,0,0,0.60)] px-3 py-1.5 text-white shadow-md relative overflow-hidden min-h-0 pointer-events-none border-0",
  
  content: "p-5 flex flex-col items-start gap-5 flex-1 self-stretch",
  titleContainer: "flex-shrink-0",
  title: "font-semibold text-2xl leading-8 tracking-normal text-[#171B23]",
  bottomSection: "mt-auto w-full flex flex-col gap-4",
  
  areaLocationRow: "flex items-center justify-between w-full",
  areaText: "font-medium text-sm leading-5 tracking-normal text-[#171B23]",
  locationText: "font-medium text-sm leading-5 tracking-normal flex items-center gap-1 text-[#171B23]",
  
  metricsContainer: "text-sm w-full",
  metricRow: "flex items-center justify-between py-2",
  metricLabel: "flex items-center gap-2 font-medium text-sm leading-5 tracking-normal",
  metricValue: "font-medium text-sm leading-5 tracking-normal text-[#171B23]",
  separator: "border-t border-[#EBEDEF] my-0",
  
  distanceGrid: "grid grid-cols-3 gap-3",
  distanceCard: "flex items-center justify-center gap-2 bg-[#F3F4F6] rounded-xl h-[52px] px-4 font-medium text-sm leading-5 tracking-normal text-[#171B23]",
  
  buttonGrid: "grid grid-cols-2 gap-2 w-full",
  
  icons: {
    primary: "w-5 h-5 text-[#5547B5]",
    small: "w-4 h-4 text-[#5547B5] flex-shrink-0",
    shrink: "w-5 h-5 text-[#5547B5] shrink-0",
    fire: "w-5 h-5 flex items-center justify-center"
  }
} as const;