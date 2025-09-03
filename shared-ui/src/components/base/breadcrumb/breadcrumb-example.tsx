import { Breadcrumb } from './breadcrumb';

// Example usage of the Breadcrumb component
export function BreadcrumbExample() {
  const breadcrumbItems = [
    { label: 'Settings', href: '/settings' },
    { label: 'User Management', href: '/settings/users' },
    { label: 'Permissions', href: '/settings/users/permissions' },
    { label: 'Team', current: true }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Basic breadcrumb with home */}
      <Breadcrumb 
        items={breadcrumbItems}
        showHome={true}
      />

      {/* Breadcrumb without home */}
      <Breadcrumb 
        items={breadcrumbItems}
        showHome={false}
      />

      {/* Long breadcrumb that will truncate */}
      <Breadcrumb 
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
          { label: 'Web Development', href: '/projects/web' },
          { label: 'React Applications', href: '/projects/web/react' },
          { label: 'Component Library', href: '/projects/web/react/components' },
          { label: 'Breadcrumb', current: true }
        ]}
        maxVisible={4}
      />

      {/* Simple breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Explore', current: true }
        ]}
      />
    </div>
  );
}