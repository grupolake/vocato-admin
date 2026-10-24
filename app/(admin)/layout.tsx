import { UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";
import { requireAdmin } from "@/lib/auth";

async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return children;
}

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<aside className="hidden w-[248px] shrink-0 md:block" />}>
        <Sidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-end border-b border-line-subtle bg-card px-8">
          <Suspense>
            <UserButton />
          </Suspense>
        </header>
        <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-8">
          <Suspense fallback={<p className="lf-eyebrow">Carregando…</p>}>
            <Gate>{children}</Gate>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
