import {
  Bell01,
  SearchLg,
  Settings01,
  LogOut01,
  User01,
} from '@untitledui/icons';
import { Button as AriaButton } from 'react-aria-components';
import { Avatar, Dropdown } from '@compass/shared-ui';
import { useTranslation } from 'react-i18next';
import type { IAdminHeaderProps } from '../../types/components';

export const AdminHeader = ({
  trailingContent,
  showAvatarDropdown = true,
  hideBorder = false,
  title,
  subtitle,
  userName = '',
  userRole = '',
  userAvatar,
}: IAdminHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header data-qa-id='admin-header'>
      <section
        data-qa-id='admin-header-section'
        className={`flex h-16 w-full items-center justify-between px-6 md:h-18 md:px-8 ${
          !hideBorder ? 'border-b border-gray-200 dark:border-gray-700' : ''
        }`}
      >
        <div
          data-qa-id='admin-header-content'
          className='flex flex-1 items-center'
        >
          <div>
            <h1
              data-qa-id='admin-header-title'
              className='text-[32px] font-medium text-gray-900 dark:text-white'
            >
              {title || t('welcome.title')}
            </h1>
            {(subtitle || t('welcome.subtitle')) && (
              <p
                data-qa-id='admin-header-subtitle'
                className='mt-1 text-[16px] font-normal text-gray-600 dark:text-gray-400'
              >
                {subtitle || t('welcome.subtitle')}
              </p>
            )}
          </div>
        </div>

        <div
          data-qa-id='admin-header-actions'
          className='flex items-center gap-4'
        >
          {trailingContent}

          <button
            data-qa-id='admin-header-search-button'
            type='button'
            className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
          >
            <SearchLg className='h-5 w-5' />
          </button>

          <button
            data-qa-id='admin-header-notifications-button'
            type='button'
            className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
          >
            <Bell01 className='h-5 w-5' />
          </button>

          {showAvatarDropdown && (
            <Dropdown.Root>
              <AriaButton
                data-qa-id='admin-header-user-menu'
                className='flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors outline-none focus:outline-none'
              >
                <Avatar alt={userName} src={userAvatar} size='md' />
                <div className='text-left'>
                  <div
                    data-qa-id='admin-header-user-name'
                    className='text-sm font-medium text-gray-900 dark:text-white'
                  >
                    {userName}
                  </div>
                  <div
                    data-qa-id='admin-header-user-role'
                    className='text-xs text-gray-500 dark:text-gray-400'
                  >
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
    </header>
  );
};
