"use client";

import { OrganizationSwitcher } from "./organization-switcher";

export const NavbarRoutes = () => {
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <OrganizationSwitcher />
    </div>
  );
};
