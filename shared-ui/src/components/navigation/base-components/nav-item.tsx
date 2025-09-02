'use client';

import type { FC, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { ChevronDown, Share04 } from '@untitledui/icons';
import { Link } from 'react-router-dom';
import { cx } from '../../../utils/cx';

interface NavItemBaseProps {
  iconOnly?: boolean;
  open?: boolean;
  href?: string;
  type: 'link' | 'collapsible' | 'collapsible-child';
  icon?: FC<HTMLAttributes<HTMLOrSVGElement>>;
  badge?: ReactNode;
  current?: boolean;
  truncate?: boolean;
  onClick?: MouseEventHandler;
  children?: ReactNode;
}

export const NavItemBase = ({ 
  current, 
  type, 
  badge, 
  href, 
  icon: Icon, 
  children, 
  truncate = true, 
  onClick 
}: NavItemBaseProps) => {
  
  const iconElement = Icon && (
    <Icon 
      aria-hidden="true" 
      className={cx(
        "mr-3 h-5 w-5 shrink-0 transition-colors duration-200",
        current 
          ? "text-indigo-600 dark:text-indigo-400" 
          : "text-gray-500 dark:text-gray-400"
      )}
    />
  );

  const badgeElement = badge && (
    <span className="ml-auto">
      {badge}
    </span>
  );

  const labelElement = (
    <span
      className={cx(
        "flex-1 transition-colors duration-200 font-medium-500",
        truncate && "truncate",
        type === 'collapsible-child' 
          ? cx(
              "text-sm",
              current 
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
            )
          : cx(
              "text-base",
              current
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
            ),
      )}
    >
      {children}
    </span>
  );

  const baseClasses = cx(
    "group relative flex w-full cursor-pointer items-center rounded-lg transition-all duration-200 ease-in-out select-none",
    current 
      ? type === 'collapsible-child'
        ? "bg-indigo-50 dark:bg-indigo-900/20"
        : "bg-indigo-100 dark:bg-indigo-900/30"
      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
  );

  const isExternal = href && href.startsWith('http');
  const externalIcon = isExternal && <Share04 className="ml-2 h-4 w-4 text-gray-400" />;

  if (type === 'collapsible') {
    return (
      <summary 
        className={cx("px-3 py-2.5 list-none", baseClasses)} 
        onClick={onClick}
      >
        {iconElement}
        {labelElement}
        {badgeElement}
        <ChevronDown 
          aria-hidden="true" 
          className="ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ease-in-out group-open:rotate-180" 
        />
      </summary>
    );
  }

  if (type === 'collapsible-child') {
    if (isExternal) {
      return (
        <a
          href={href!}
          target="_blank"
          rel="noopener noreferrer"
          className={cx("py-2 pr-3 pl-8", baseClasses)}
          onClick={onClick}
          aria-current={current ? 'page' : undefined}
        >
          {iconElement}
          {labelElement}
          {externalIcon}
          {badgeElement}
        </a>
      );
    }
    
    return (
      <Link
        to={href!}
        className={cx("py-2 pr-3 pl-8", baseClasses)}
        onClick={onClick}
        aria-current={current ? 'page' : undefined}
      >
        {iconElement}
        {labelElement}
        {badgeElement}
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href!}
        target="_blank"
        rel="noopener noreferrer"
        className={cx("px-3 py-2.5", baseClasses)}
        onClick={onClick}
        aria-current={current ? 'page' : undefined}
      >
        {iconElement}
        {labelElement}
        {externalIcon}
        {badgeElement}
      </a>
    );
  }

  return (
    <Link
      to={href!}
      className={cx("px-3 py-2.5", baseClasses)}
      onClick={onClick}
      aria-current={current ? 'page' : undefined}
    >
      {iconElement}
      {labelElement}
      {badgeElement}
    </Link>
  );
};