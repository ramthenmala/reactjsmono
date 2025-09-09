'use client';

import type { FC, RefAttributes } from 'react';
import { DotsVertical } from '@untitledui/icons';
import type {
  ButtonProps as AriaButtonProps,
  MenuItemProps as AriaMenuItemProps,
  MenuProps as AriaMenuProps,
  PopoverProps as AriaPopoverProps,
  SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import {
  Button as AriaButton,
  Header as AriaHeader,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Separator as AriaSeparator,
} from 'react-aria-components';
import { cx } from '../../../utils/cx';

interface DropdownItemProps extends AriaMenuItemProps {
  /** The label of the item to be displayed. */
  label?: string;
  /** An addon to be displayed on the right side of the item. */
  addon?: string;
  /** If true, the item will not have any styles. */
  unstyled?: boolean;
  /** An icon to be displayed on the left side of the item. */
  icon?: FC<{ className?: string }>;
}

const DropdownItem = ({
  label,
  children,
  addon,
  icon: Icon,
  unstyled,
  ...props
}: DropdownItemProps) => {
  if (unstyled) {
    return <AriaMenuItem id={label} textValue={label} {...props} />;
  }

  return (
    <AriaMenuItem
      {...props}
      className={state =>
        cx(
          'group block cursor-pointer px-1.5 py-px outline-hidden',
          state.isDisabled && 'cursor-not-allowed',
          typeof props.className === 'function'
            ? props.className(state)
            : props.className
        )
      }
    >
      {state => (
        <div
          className={cx(
            'relative flex items-center rounded-md px-2.5 py-2 transition-all duration-200 ease-out',
            !state.isDisabled &&
              'group-hover:bg-gray-100 dark:group-hover:bg-gray-700',
            state.isFocused && 'bg-gray-100 dark:bg-gray-700',
            state.isFocusVisible &&
              'outline-2 outline-blue-500 -outline-offset-2'
          )}
        >
          {Icon && (
            <Icon
              aria-hidden='true'
              className={cx(
                'mr-2 h-4 w-4 shrink-0',
                state.isDisabled
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            />
          )}

          <span
            className={cx(
              'flex-1 truncate text-sm font-medium',
              state.isDisabled
                ? 'text-gray-400 dark:text-gray-600'
                : 'text-gray-900 dark:text-gray-100',
              state.isFocused && 'text-gray-900 dark:text-white'
            )}
          >
            {label ||
              (typeof children === 'function' ? children(state) : children)}
          </span>

          {addon && (
            <span
              className={cx(
                'ml-3 shrink-0 rounded px-1 py-px text-xs font-medium ring-1 ring-gray-300 dark:ring-gray-600 ring-inset',
                state.isDisabled
                  ? 'text-gray-400 dark:text-gray-600'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              {addon}
            </span>
          )}
        </div>
      )}
    </AriaMenuItem>
  );
};

interface DropdownMenuProps<T extends object> extends AriaMenuProps<T> {}

const DropdownMenu = <T extends object>(props: DropdownMenuProps<T>) => {
  return (
    <AriaMenu
      disallowEmptySelection
      selectionMode='single'
      {...props}
      className={state =>
        cx(
          'h-min overflow-y-auto py-2 outline-hidden select-none',
          typeof props.className === 'function'
            ? props.className(state)
            : props.className
        )
      }
    />
  );
};

interface DropdownPopoverProps extends AriaPopoverProps {}

const DropdownPopover = (props: DropdownPopoverProps) => {
  return (
    <AriaPopover
      placement='bottom right'
      {...props}
      className={state =>
        cx(
          'min-w-48 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 z-50 transform origin-top transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          state.isEntering && 'opacity-0 scale-y-0 -translate-y-2',
          state.isExiting && 'opacity-0 scale-y-0 -translate-y-2',
          !state.isEntering &&
            !state.isExiting &&
            'opacity-100 scale-y-100 translate-y-0',
          typeof props.className === 'function'
            ? props.className(state)
            : props.className
        )
      }
    >
      {props.children}
    </AriaPopover>
  );
};

const DropdownSeparator = (props: AriaSeparatorProps) => {
  return (
    <AriaSeparator
      {...props}
      className={cx(
        'my-1 h-px w-full bg-gray-200 dark:bg-gray-700',
        props.className
      )}
    />
  );
};

const DropdownDotsButton = (
  props: AriaButtonProps & RefAttributes<HTMLButtonElement>
) => {
  return (
    <AriaButton
      {...props}
      aria-label='Open menu'
      className={state =>
        cx(
          'cursor-pointer rounded-md text-fg-quaternary outline-focus-ring transition duration-100 ease-linear',
          (state.isPressed || state.isHovered) && 'text-fg-quaternary_hover',
          (state.isPressed || state.isFocusVisible) &&
            'outline-2 outline-offset-2',
          typeof props.className === 'function'
            ? props.className(state)
            : props.className
        )
      }
    >
      <DotsVertical className='size-5 transition-inherit-all' />
    </AriaButton>
  );
};

export const Dropdown = {
  Root: AriaMenuTrigger,
  Popover: DropdownPopover,
  Menu: DropdownMenu,
  Section: AriaMenuSection,
  SectionHeader: AriaHeader,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  DotsButton: DropdownDotsButton,
};
