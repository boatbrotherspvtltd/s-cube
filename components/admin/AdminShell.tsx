"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/admin-actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories & Products" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/brands", label: "Brands" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-paper">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-navy text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-sun">CMS</p>
          <p className="mt-1 font-semibold">S-Cube Admin</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 text-sm">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 ${
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction} className="px-4 pb-6">
          <button className="text-xs text-white/50 hover:text-white">Sign out</button>
        </form>
      </aside>
      <div className="p-6 md:p-10">{children}</div>
    </div>
  );
}
