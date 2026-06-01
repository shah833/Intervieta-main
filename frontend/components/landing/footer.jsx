export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">IntervieTA</p>
          <p className="mt-1">AI interview simulation platform</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a href="#features" className="transition hover:text-cyan-200">
            Product
          </a>
          <a href="#pricing" className="transition hover:text-cyan-200">
            Pricing
          </a>
          <a href="#contact" className="transition hover:text-cyan-200">
            Contact
          </a>
          <a href="#" className="transition hover:text-cyan-200">
            X
          </a>
          <a href="#" className="transition hover:text-cyan-200">
            LinkedIn
          </a>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-7xl text-xs text-slate-400">© IntervieTA – All rights reserved</p>
    </footer>
  );
}
