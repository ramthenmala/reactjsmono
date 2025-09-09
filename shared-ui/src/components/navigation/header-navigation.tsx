'use client';

import type { FC, ReactNode } from 'react';
import {
  Bell01,
  SearchLg,
  Settings01,
  LogOut01,
  User01,
} from '@untitledui/icons';
import { Button as AriaButton } from 'react-aria-components';
import { Avatar } from '../base/avatar/avatar';
import { Input } from '../base/input/input';
import { Dropdown } from '../base/dropdown/dropdown';
import { cx } from '../../utils/cx';
import { NavItemBase } from './base-components/nav-item';
import { useTranslation } from 'react-i18next';

type NavItem = {
  /** Label text for the nav item. */
  label: string;
  /** URL to navigate to when the nav item is clicked. */
  href: string;
  /** Whether the nav item is currently active. */
  current?: boolean;
  /** Icon component to display. */
  icon?: FC<{ className?: string }>;
  /** Badge to display. */
  badge?: ReactNode;
  /** List of sub-items to display. */
  items?: NavItem[];
};

interface HeaderNavigationBaseProps {
  /** URL of the currently active item. */
  activeUrl?: string;
  /** List of items to display. */
  items: NavItem[];
  /** List of sub-items to display. */
  subItems?: NavItem[];
  /** Content to display in the trailing position. */
  trailingContent?: ReactNode;
  /** Whether to show the avatar dropdown. */
  showAvatarDropdown?: boolean;
  /** Whether to hide the bottom border. */
  hideBorder?: boolean;
  /** Page title */
  title?: string;
  /** Page subtitle */
  subtitle?: string;
  /** User name */
  userName?: string;
  /** User role */
  userRole?: string;
  /** User avatar URL */
  userAvatar?: string;
}

export const HeaderNavigationBase = ({
  activeUrl,
  items,
  subItems,
  trailingContent,
  showAvatarDropdown = true,
  hideBorder = false,
  title,
  subtitle,
  userName = 'Faisal',
  userRole = 'Govt. Admin',
  userAvatar,
}: HeaderNavigationBaseProps) => {
  const { t } = useTranslation();
  const activeSubNavItems =
    subItems ||
    items.find(item => item.current && item.items && item.items.length > 0)
      ?.items;

  const showSecondaryNav = activeSubNavItems && activeSubNavItems.length > 0;

  return (
    <header>
      <section
        className={cx(
          'flex h-16 w-full items-center justify-between bg-white px-6 md:h-18 md:px-8 dark:bg-gray-900',
          !hideBorder && 'border-b border-gray-200 dark:border-gray-700'
        )}
      >
        <div className='flex flex-1 items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {title || t('welcome.title')}
            </h1>
            {(subtitle || t('welcome.subtitle')) && (
              <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                {subtitle || t('welcome.subtitle')}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {trailingContent}

          {/* Search Button */}
          <button
            type='button'
            className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
          >
            <SearchLg className='h-5 w-5' />
          </button>

          {/* Notification Bell */}
          <button
            type='button'
            className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
          >
            <Bell01 className='h-5 w-5' />
          </button>

          {/* User Info */}
          {showAvatarDropdown && (
            <Dropdown.Root>
              <AriaButton className='flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors outline-none focus:outline-none'>
                <Avatar
                  alt={userName}
                  src={userAvatar}
                  size='md'
                  name={userName}
                />
                <div className='text-left'>
                  <div className='text-sm font-medium text-gray-900 dark:text-white'>
                    {userName}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {userRole}
                  </div>
                </div>
              </AriaButton>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item
                    icon={User01}
                    label={t('userMenu.viewProfile')}
                    onAction={() => console.log('View profile')}
                  />
                  <Dropdown.Item
                    icon={Settings01}
                    label={t('userMenu.settings')}
                    onAction={() => console.log('Settings')}
                  />
                  <Dropdown.Separator />
                  <Dropdown.Item
                    icon={LogOut01}
                    label={t('userMenu.logOut')}
                    onAction={() => console.log('Log out')}
                  />
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.Root>
          )}
        </div>
      </section>

      {showSecondaryNav && (
        <section
          className={cx(
            'flex h-16 w-full items-center justify-center bg-white dark:bg-gray-900',
            !hideBorder && 'border-b border-gray-200 dark:border-gray-700'
          )}
        >
          <div className='flex w-full max-w-7xl items-center justify-between gap-8 px-8'>
            <nav>
              <ul className='flex items-center gap-0.5'>
                {activeSubNavItems.map(item => (
                  <li key={item.label} className='py-0.5'>
                    <NavItemBase
                      icon={item.icon}
                      href={item.href}
                      current={item.current}
                      badge={item.badge}
                      type='link'
                    >
                      {item.label}
                    </NavItemBase>
                  </li>
                ))}
              </ul>
            </nav>

            <Input
              aria-label='Search'
              placeholder='Search'
              icon={SearchLg}
              size='sm'
              className='max-w-xs'
            />
          </div>
        </section>
      )}
    </header>
  );
};
