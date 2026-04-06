export default function Footer() {
  return (
    <footer className="border-t border-noir/5 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-noir/40">
        <span>Institut Jubël — Dakar, Sénégal</span>
        <span>{new Date().getFullYear()}</span>
        <a
          href="mailto:contact@jubel.sn"
          className="hover:text-or transition-colors"
        >
          contact@jubel.sn
        </a>
      </div>
    </footer>
  );
}
