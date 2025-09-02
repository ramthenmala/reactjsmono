'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cx } from '../../../utils/cx';
import type { NavItemDividerType, NavItemType } from '../config';
import { NavItemBase } from './nav-item';

interface NavListProps {
  /** URL of the currently active item. */
  activeUrl?: string;
  /** Additional CSS classes to apply to the list. */
  className?: string;
  /** List of items to display. */
  items: (NavItemType | NavItemDividerType)[];
}

export const NavList = ({ activeUrl, items, className }: NavListProps) => {
  // Keep track of which items are open
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  
  // Initialize all collapsible items as open
  useEffect(() => {
    const collapsibleItems = items
      .filter(item => !item.divider && item.items?.length)
      .map(item => item.label);
    setOpenItems(new Set(collapsibleItems));
  }, [items]);

  const handleToggle = (label: string, isOpen: boolean) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(label);
      } else {
        newSet.delete(label);
      }
      return newSet;
    });
  };

  return (
    <nav className={cx('mt-4 flex flex-col px-2 lg:px-4', className)}>
      <ul className="space-y-1">
        {items.map((item, index) => {
          if (item.divider) {
            return (
              <li key={index} className="w-full px-0.5 py-2">
                <hr className="h-px w-full border-none bg-gray-200 dark:bg-gray-700" />
              </li>
            );
          }

          const isCurrentSection = item.href === activeUrl || 
            item.items?.some((subItem) => subItem.href === activeUrl);

          if (item.items?.length) {
            const MainElement = item.href ? (
              item.href.startsWith('http') ? 'a' : Link
            ) : 'div';

            const mainProps = item.href ? (
              item.href.startsWith('http') ? {
                href: item.href,
                target: "_blank",
                rel: "noopener noreferrer"
              } : {
                to: item.href
              }
            ) : {};

            return (
              <li key={item.label} className="py-0.5">
                <div className="group">
                  {/* Custom collapsible item with separate main and toggle areas */}
                  <div className={cx(
                    "relative flex w-full items-center rounded-lg transition-all duration-200 ease-in-out",
                    isCurrentSection 
                      ? "bg-indigo-100 dark:bg-indigo-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}>
                    {/* Main clickable area - navigates to href */}
                    <MainElement
                      {...mainProps}
                      className="flex flex-1 items-center px-3 py-2.5 transition-all duration-200 ease-in-out select-none"
                    >
                      {item.icon && (
                        <item.icon 
                          aria-hidden="true" 
                          className={cx(
                            "mr-3 h-5 w-5 shrink-0 transition-colors duration-200",
                            isCurrentSection 
                              ? "text-indigo-600 dark:text-indigo-400" 
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                      )}
                      <span
                        className={cx(
                          "flex-1 text-base transition-colors duration-200 truncate font-medium-500",
                          isCurrentSection
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white",
                        )}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto">
                          {item.badge}
                        </span>
                      )}
                    </MainElement>
                    
                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => handleToggle(item.label, !openItems.has(item.label))}
                      className="p-3 transition-colors"
                    >
                      <svg
                        className={cx(
                          "h-4 w-4 transition-transform duration-300 ease-in-out",
                          isCurrentSection
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-400",
                          openItems.has(item.label) && "rotate-180"
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Collapsible content */}
                  {openItems.has(item.label) && (
                    <div className="overflow-hidden transition-all duration-300 ease-in-out">
                      <ul className="mt-1 space-y-1 px-2">
                        {item.items.map((childItem) => (
                          <li key={childItem.label}>
                            <NavItemBase
                              href={childItem.href}
                              badge={childItem.badge}
                              icon={childItem.icon}
                              type="collapsible-child"
                              current={activeUrl === childItem.href}
                            >
                              {childItem.label}
                            </NavItemBase>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            );
          }

          return (
            <li key={item.label} className="py-0.5">
              <NavItemBase
                type="link"
                badge={item.badge}
                icon={item.icon}
                href={item.href}
                current={item.href === activeUrl}
              >
                {item.label}
              </NavItemBase>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};