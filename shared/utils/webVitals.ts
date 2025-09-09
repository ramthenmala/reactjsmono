import { onCLS, onFCP, onFID, onLCP, onTTFB, type Metric } from 'web-vitals';

// Web Vitals thresholds (Google's recommendations)
const THRESHOLDS = {
  // Core Web Vitals
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 }, // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift

  // Other important metrics
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
};

type MetricName = keyof typeof THRESHOLDS;

interface WebVitalsConfig {
  analyticsId?: string;
  debug?: boolean;
  onMetric?: (
    metric: Metric & { rating: 'good' | 'needs-improvement' | 'poor' }
  ) => void;
}

function getMetricRating(
  name: MetricName,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics({
  name,
  value,
  rating,
}: {
  name: string;
  value: number;
  rating: string;
}) {
  // Send to your analytics service
  if (typeof window !== 'undefined') {
    // Example for Google Analytics 4
    if ('gtag' in window) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        custom_parameter_1: rating,
        non_interaction: true,
      });
    }

    // Example for custom analytics
    if (navigator.sendBeacon) {
      const body = JSON.stringify({
        name,
        value,
        rating,
        timestamp: Date.now(),
      });
      navigator.sendBeacon('/api/analytics/web-vitals', body);
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`📊 Web Vital: ${name}`);
      console.log(`Value: ${value}${name === 'CLS' ? '' : 'ms'}`);
      console.log(`Rating: ${rating.toUpperCase()}`);
      console.log(
        `Threshold: Good ≤ ${
          THRESHOLDS[name as MetricName]?.good
        }, Needs Improvement ≤ ${
          THRESHOLDS[name as MetricName]?.needsImprovement
        }`
      );
      console.groupEnd();
    }
  }
}

export function initWebVitals(config: WebVitalsConfig = {}) {
  const { debug = false, onMetric } = config;

  function handleMetric(metric: Metric) {
    const rating = getMetricRating(metric.name as MetricName, metric.value);
    const enhancedMetric = { ...metric, rating };

    // Custom callback
    if (onMetric) {
      onMetric(enhancedMetric);
    }

    // Send to analytics
    sendToAnalytics({
      name: metric.name,
      value: metric.value,
      rating,
    });

    if (debug) {
      console.log(`Web Vital ${metric.name}:`, enhancedMetric);
    }
  }

  // Measure Core Web Vitals
  onCLS(handleMetric);
  onFCP(handleMetric);
  onFID(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
}

// Helper function to get performance metrics summary
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation timing
    domContentLoaded: Math.round(
      navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart
    ),
    loadComplete: Math.round(
      navigation.loadEventEnd - navigation.loadEventStart
    ),

    // Paint timing
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint:
      paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

    // Resource timing summary
    resources: {
      total: performance.getEntriesByType('resource').length,
      images: performance
        .getEntriesByType('resource')
        .filter(r => r.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)).length,
      scripts: performance
        .getEntriesByType('resource')
        .filter(r => r.name.includes('.js')).length,
      stylesheets: performance
        .getEntriesByType('resource')
        .filter(r => r.name.includes('.css')).length,
    },

    // Memory usage (if available)
    memory: (performance as any).memory
      ? {
          used: Math.round(
            (performance as any).memory.usedJSHeapSize / 1048576
          ), // MB
          total: Math.round(
            (performance as any).memory.totalJSHeapSize / 1048576
          ), // MB
          limit: Math.round(
            (performance as any).memory.jsHeapSizeLimit / 1048576
          ), // MB
        }
      : null,
  };
}

// Performance observer for monitoring ongoing metrics
export class PerformanceMonitor {
  private observers: PerformanceObserver[] = [];

  constructor(private config: WebVitalsConfig = {}) {
    this.initObservers();
  }

  private initObservers() {
    // Long tasks observer (detect blocking operations)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver(list => {
          list.getEntries().forEach(entry => {
            if (this.config.debug) {
              console.warn(
                `Long task detected: ${Math.round(entry.duration)}ms`,
                entry
              );
            }

            // Send to analytics
            sendToAnalytics({
              name: 'long-task',
              value: entry.duration,
              rating: entry.duration > 50 ? 'poor' : 'good',
            });
          });
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        console.warn('Long task observer not supported');
      }

      // Layout shift observer
      try {
        const layoutShiftObserver = new PerformanceObserver(list => {
          let clsValue = 0;
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          if (clsValue > 0 && this.config.debug) {
            console.log(`Layout shift detected: ${clsValue.toFixed(4)}`);
          }
        });

        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        console.warn('Layout shift observer not supported');
      }
    }
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}
