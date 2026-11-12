import type { ReactNode } from "react";
import Sidebar, { MobileSidebar } from "../../../components/docs/Sidebar";
import ScrollProgress from "../../../components/docs/ScrollProgress";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <div className="container-page docs-shell">
        <MobileSidebar />
        <div className="docs-grid mt-6 md:mt-0">
          <aside className="hidden md:sticky md:top-28 md:block md:self-start"><Sidebar /></aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </>
  );
}
