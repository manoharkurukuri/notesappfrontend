// app/community/layout.tsx

import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen  flex flex-col">
      {/* Top navbar */}
      <Navbar  />

      {/* Below navbar: sidebar + main content */}
      <div className="flex flex-1">
        {/* left: side menu */}
        <aside className="">
          <SideMenu  />
        </aside>

        {/* right: main content – this is where children will come */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
