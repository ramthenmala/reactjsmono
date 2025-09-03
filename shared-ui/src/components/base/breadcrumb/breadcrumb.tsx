'use client';

import { memo, Fragment } from 'react';
import { Link as AriaLink } from 'react-aria-components';
import { Home03, ChevronRight } from '@untitledui/icons';
import { cx } from '../../../utils/cx';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  maxVisible?: number;
  className?: string;
}

const BreadcrumbSeparator = memo(() => (
  <div className="shrink-0 text-white">
    <ChevronRight className="size-4" aria-hidden="true" />
  </div>
));
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbLink = memo(({ 
  item, 
  isHome = false 
}: { 
  item: BreadcrumbItem; 
  isHome?: boolean; 
}) => {
  const baseClasses = "group inline-flex cursor-pointer items-center justify-center gap-1 rounded-md outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 in-current:max-w-full";
  
  const textClasses = item.current 
    ? "text-white group-hover:text-white" 
    : "text-white group-hover:text-white";

  if (item.current) {
    return (
      <span
        className={baseClasses}
        role="link"
        aria-disabled="true"
        aria-current="page"
        data-current="true"
        data-disabled="true"
      >
        {isHome ? (
          <Home03 
            className="size-5 transition-inherit-all text-gray-300" 
            aria-hidden="true" 
          />
        ) : (
          <span className={cx("text-sm font-semibold whitespace-nowrap transition-inherit-all in-current:truncate", textClasses)}>
            {item.label}
          </span>
        )}
      </span>
    );
  }

  if (!item.href) {
    return (
      <button
        aria-label={isHome ? "Go to home" : `Go to ${item.label}`}
        className={baseClasses}
      >
        {isHome ? (
          <Home03 
            className="size-5 transition-inherit-all text-gray-300 group-hover:text-gray-300" 
            aria-hidden="true" 
          />
        ) : (
          <span className={cx("text-sm font-semibold whitespace-nowrap transition-inherit-all in-current:truncate", textClasses)}>
            {item.label}
          </span>
        )}
      </button>
    );
  }

  return (
    <AriaLink 
      href={item.href}
      className={baseClasses}
    >
      {isHome ? (
        <Home03 
          className="size-5 transition-inherit-all text-gray-300 group-hover:text-gray-300" 
          aria-hidden="true" 
        />
      ) : (
        <span className={cx("text-sm font-semibold whitespace-nowrap transition-inherit-all in-current:truncate", textClasses)}>
          {item.label}
        </span>
      )}
    </AriaLink>
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbEllipsis = memo(({ onExpand }: { onExpand?: () => void }) => (
  <button
    aria-label="See all breadcrumb items"
    className="group inline-flex cursor-pointer items-center justify-center gap-1 rounded-md outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2 in-current:max-w-full"
    onClick={onExpand}
  >
    <span className="text-sm font-semibold whitespace-nowrap transition-inherit-all in-current:truncate text-white group-hover:text-white">
      ...
    </span>
  </button>
));
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export const Breadcrumb = memo(({
  items,
  showHome = true,
  maxVisible = 4,
  className,
}: BreadcrumbProps) => {
  // Process items to handle truncation
  const processedItems = [...items];
  const shouldTruncate = processedItems.length > maxVisible;
  
  let visibleItems = processedItems;
  let hiddenItems: BreadcrumbItem[] = [];
  
  if (shouldTruncate) {
    // Always show first item (after home), last item, and current item
    const firstItem = processedItems[0];
    const lastItems = processedItems.slice(-2); // Last 2 items
    
    hiddenItems = processedItems.slice(1, -2);
    visibleItems = [firstItem, ...lastItems];
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol 
        aria-label="Breadcrumbs" 
        className="relative flex gap-[12px]"
      >
        {/* Home item */}
        {showHome && (
          <li className="flex items-center current:overflow-hidden gap-[12px]">
            <BreadcrumbLink 
              item={{ label: 'Home', href: '/', current: false }} 
              isHome={true} 
            />
            {(processedItems.length > 0) && <BreadcrumbSeparator />}
          </li>
        )}

        {/* Regular items with optional truncation */}
        {visibleItems.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <li 
              className={cx(
                "flex items-center current:overflow-hidden gap-[12px]",
                item.current && "data-[current=true]:overflow-hidden"
              )}
              data-current={item.current}
              data-disabled={item.current}
            >
              <BreadcrumbLink item={item} />
              
              {/* Show separator if not the last item */}
              {index < visibleItems.length - 1 && <BreadcrumbSeparator />}
              
              {/* Show ellipsis after first item if truncated */}
              {shouldTruncate && index === 0 && hiddenItems.length > 0 && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbEllipsis />
                </>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';