import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/entc-logo.jpeg"
            alt="E&TC Logo"
            width={40}
            height={40}
            className="rounded-2xl"
            priority
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-950">E&TC Fix</div>
            <div className="text-xs text-slate-600">Department Portal</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="/about">About</NavLink>
          <NavLink href="/department">Department</NavLink>
          <NavLink href="/announcements">Announcements</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 md:inline"
              >
                Dashboard
              </Link>
              {user.role === "admin" ? (
                <>
                  <Link
                    href="/admin"
                    className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 md:inline"
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/members"
                    className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 md:inline"
                  >
                    Members
                  </Link>
                </>
              ) : null}
              <form action={logoutAction}>
                <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
