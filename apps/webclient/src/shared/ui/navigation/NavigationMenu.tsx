import { Link } from "react-router-dom";
import { ChevronDown } from "@untitledui/icons";

export interface NavigationItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownId?: string;
  submenu?: any;
}

interface NavigationMenuProps {
  items: NavigationItem[];
  activeDropdown: string | null;
  onToggleDropdown: (dropdownId: string) => void;
}

export function NavigationMenu({ items, activeDropdown, onToggleDropdown }: NavigationMenuProps) {
  return (
    <nav className="header-nav max-xl:hidden">
      <ul className="flex items-center gap-4">
        {items.map((item) => (
          <li key={item.label} className="relative">
            {item.hasDropdown ? (
              <button
                onClick={() => onToggleDropdown(item.dropdownId || "")}
                data-dropdown-toggle={item.dropdownId || ""}
              >
                <span>{item.label}</span>
                <ChevronDown className={`size-4 transition-transform ${activeDropdown === item.dropdownId ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link to={item.href}>
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}