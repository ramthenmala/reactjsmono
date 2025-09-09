import React from 'react';

export const SidebarNavigationSimple = ({
  activeUrl,
  items,
  showAccountCard,
}) => (
  <div data-qa-id="sidebar-navigation">
    <div data-qa-id="sidebar-active-url">{activeUrl}</div>
    <div data-qa-id="sidebar-show-account">{showAccountCard?.toString()}</div>
    <div data-qa-id="sidebar-items-count">{items?.length || 0}</div>
  </div>
);
