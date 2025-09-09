/**
 * Formatting utility functions
 */

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return value.toLocaleString(undefined, options);
}

export function formatArea(value: number, unit = 'm²'): string {
  return `${formatNumber(value)} ${unit}`;
}

export function formatAreaRange(min: number, max: number, unit = 'm²'): string {
  return `${formatNumber(min)} - ${formatNumber(max)} ${unit}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
}

export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
