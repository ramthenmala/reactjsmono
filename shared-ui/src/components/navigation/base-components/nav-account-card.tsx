'use client';

import { ChevronDown } from '@untitledui/icons';
import { cx } from '../../../utils/cx';

interface NavAccountCardProps {
  name?: string;
  email?: string;
  avatar?: string;
  className?: string;
  onClick?: () => void;
}

export const NavAccountCard = ({
  name = 'John Doe',
  email = 'john@example.com',
  avatar,
  className,
  onClick,
}: NavAccountCardProps) => {
  return (
    <div className={cx('px-2', className)}>
      <button
        type='button'
        className='group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-medium leading-6 text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors duration-200'
        onClick={onClick}
      >
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600'>
          {avatar ? (
            <img src={avatar} alt={name} className='h-8 w-8 rounded-full' />
          ) : (
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-900 dark:text-white'>
            {name}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
            {email}
          </p>
        </div>
        <ChevronDown className='h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300' />
      </button>
    </div>
  );
};
