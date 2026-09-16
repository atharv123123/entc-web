import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/entc-logo.png"
                alt="E&TC Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div className="text-sm font-semibold text-slate-950">E&TC Fix</div>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              A simple department portal for complaints, feedback, announcements, events, permissions and placement
              updates.
            </p>
          </div>
          <div className="text-sm text-slate-600">
            <div className="font-semibold text-slate-950">Quick Links</div>
            <ul className="mt-2 space-y-1">
              <li>
                <a className="hover:text-slate-900" href="/complaints">
                  Complaint Box
                </a>
              </li>
              <li>
                <a className="hover:text-slate-900" href="/feedback">
                  Feedback
                </a>
              </li>
              <li>
                <a className="hover:text-slate-900" href="/permissions">
                  Permissions
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm text-slate-600">
            <div className="font-semibold text-slate-950">Support</div>
            <p className="mt-2">For any urgent issue, contact department office.</p>
          </div>
        </div>
        <div className="mt-10 text-xs text-slate-500">© {new Date().getFullYear()} E&TC Department</div>
      </div>
    </footer>
  );
}
