"use client";

import { Navigation } from "./_components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        {/* <SearchCommand /> */}
        {children}
      </main>
    </div>
  );
};
export default MainLayout;
