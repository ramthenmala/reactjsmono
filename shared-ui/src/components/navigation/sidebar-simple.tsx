"use client";

import type { ReactNode } from "react";
// import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { cx } from "../../utils/cx";
import { MobileNavigationHeader } from "./base-components/mobile-header";
import { NavAccountCard } from "./base-components/nav-account-card";
import { NavItemBase } from "./base-components/nav-item";
import { NavList } from "./base-components/nav-list";
import type { NavItemType } from "./config";

interface SidebarNavigationProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of items to display. */
    items: NavItemType[];
    /** List of footer items to display. */
    footerItems?: NavItemType[];
    /** Feature card to display. */
    featureCard?: ReactNode;
    /** Whether to show the account card. */
    showAccountCard?: boolean;
    /** Whether to hide the right side border. */
    hideBorder?: boolean;
    /** Additional CSS classes to apply to the sidebar. */
    className?: string;
}

export const SidebarNavigationSimple = ({
    activeUrl,
    items,
    footerItems = [],
    featureCard,
    showAccountCard = true,
    hideBorder = false,
    className,
}: SidebarNavigationProps) => {
    const MAIN_SIDEBAR_WIDTH = 296;

    const content = (
        <aside
            style={
                {
                    "--width": `${MAIN_SIDEBAR_WIDTH}px`,
                } as React.CSSProperties
            }
            className={cx(
                "flex h-full w-full max-w-full flex-col justify-between overflow-auto bg-gray-50 pt-4 lg:w-[var(--width)] lg:pt-6 dark:bg-gray-900",
                !hideBorder && "border-gray-200 md:border-r dark:border-gray-700",
                className,
            )}
        >
            <div className="px-4 lg:px-5 pb-4">
                <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366F1" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="#6366F1" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="#6366F1" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">Compass</span>
                </div>
            </div>

            <NavList activeUrl={activeUrl} items={items} />

            <div className="mt-auto flex flex-col gap-4 px-2 py-4 lg:px-4 lg:py-6">
                {footerItems.length > 0 && (
                    <ul className="flex flex-col">
                        {footerItems.map((item) => (
                            <li key={item.label} className="py-0.5">
                                <NavItemBase badge={item.badge} icon={item.icon} href={item.href} type="link" current={item.href === activeUrl}>
                                    {item.label}
                                </NavItemBase>
                            </li>
                        ))}
                    </ul>
                )}

                {featureCard}

                {showAccountCard && <NavAccountCard />}
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{content}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex">{content}</div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <div
                style={{
                    paddingLeft: MAIN_SIDEBAR_WIDTH,
                }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
