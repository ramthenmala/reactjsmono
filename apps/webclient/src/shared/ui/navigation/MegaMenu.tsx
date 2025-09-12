import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import type { MegaMenuConfig } from '../../types/megaMenu';

interface MegaMenuProps {
  submenu: MegaMenuConfig | null;
  isVisible: boolean;
}

export const MegaMenu = forwardRef<HTMLDivElement, MegaMenuProps>(
  ({ submenu, isVisible }, ref) => {
    if (!isVisible || !submenu) return null;

    return (
      <div
        ref={ref}
        data-qa-id="mega-menu"
        className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-auto max-w-[90vw] rounded-3xl border border-white/30 bg-gradient-to-r from-[rgba(12,17,29,0.40)] from-[-49.18%] to-[rgba(12,17,29,0.20)] to-[151.82%] shadow-[0_4px_8px_-2px_rgba(16,24,40,0.10),0_2px_4px_-2px_rgba(16,24,40,0.06)] backdrop-blur-[15px] z-50 max-xl:hidden'
      >
        <div className='p-8 flex flex-col gap-8' data-qa-id="mega-menu-content">
          {/* Header */}
          <div data-qa-id="mega-menu-header">
            <h3 className='text-lg font-semibold' data-qa-id="mega-menu-title">{submenu.title}</h3>
            <p className='text-gray-300 text-sm' data-qa-id="mega-menu-subtitle">{submenu.subtitle}</p>
          </div>

          {/* Content Layout */}
          <div className='flex gap-12' data-qa-id="mega-menu-sections">
            {submenu.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className='flex flex-col gap-3' data-qa-id={`mega-menu-section-${sectionIndex}`}>
                <h4 className='text-sm font-semibold text-gray-500' data-qa-id={`mega-menu-section-title-${sectionIndex}`}>
                  {section.title}
                </h4>
                <div className='flex gap-12' data-qa-id={`mega-menu-section-columns-${sectionIndex}`}>
                  {section.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className='space-y-1' data-qa-id={`mega-menu-column-${sectionIndex}-${columnIndex}`}>
                      {column.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.href}
                          data-qa-id={`mega-menu-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className='flex items-center gap-3 w-fit text-left hover:text-purple-300 transition-colors py-2'
                        >
                          {item.icon && (
                            <item.icon className='w-4 h-4 text-purple-400' data-qa-id={`mega-menu-item-icon-${item.name.toLowerCase().replace(/\s+/g, '-')}`} />
                          )}
                          <span className='text-lg font-semibold whitespace-nowrap' data-qa-id={`mega-menu-item-text-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

MegaMenu.displayName = 'MegaMenu';
