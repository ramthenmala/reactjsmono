import { Link } from 'react-router-dom';
import { ChevronDown } from '@untitledui/icons';
import type {
  NavigationItem,
  NavigationMenuProps,
} from '../../types/navigationMenu';

export type { NavigationItem };

export function NavigationMenu({
  items,
  activeDropdown,
  onToggleDropdown,
}: NavigationMenuProps) {
  return (
    <nav className='header-nav max-xl:hidden' data-qa-id="desktop-navigation">
      <ul className='flex items-center gap-4' data-qa-id="navigation-list">
        {items.map(item => (
          <li key={item.label} className='relative' data-qa-id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
            {item.hasDropdown ? (
              <button
                data-qa-id={`nav-dropdown-toggle-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onToggleDropdown(item.dropdownId || '')}
                data-dropdown-toggle={item.dropdownId || ''}
              >
                <span data-qa-id={`nav-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>{item.label}</span>
                <ChevronDown
                  data-qa-id={`nav-chevron-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`size-4 transition-transform ${
                    activeDropdown === item.dropdownId ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ) : (
              <Link to={item.href} data-qa-id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <span data-qa-id={`nav-label-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
