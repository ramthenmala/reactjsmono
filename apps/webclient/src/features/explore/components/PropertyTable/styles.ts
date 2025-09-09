/**
 * PropertyTable Component Styles
 */

export const propertyTableStyles = {
  container: {
    overflow: "overflow-x-auto"
  },
  
  table: {
    header: {
      slNo: "w-20",
      title: "w-full max-w-1/4",
      actions: "px-4"
    }
  },
  
  cells: {
    serialNumber: "text-sm font-medium text-primary",
    title: "text-sm font-medium text-primary hover:text-brand-600 transition-colors text-left",
    standard: "whitespace-nowrap",
    actions: {
      container: "flex justify-end"
    }
  },
  
  pagination: {
    container: "px-6 py-4 bg-white border-t border-gray-200",
    wrapper: "flex items-center justify-between",
    
    navButton: {
      base: "flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
      icon: "w-5 h-5"
    },
    
    numbers: {
      container: "flex items-center gap-2",
      button: {
        base: "px-3 py-1 text-sm font-medium rounded-md transition-colors cursor-pointer",
        active: "bg-blue-600 text-white",
        inactive: "text-gray-700 hover:bg-gray-100"
      },
      ellipsis: "text-gray-500"
    }
  }
} as const;