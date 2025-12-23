import Link from "next/link";
import { MessageSquare, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 bg-black/80 p-4 backdrop-blur-lg md:top-0 md:bottom-auto md:justify-center md:gap-8 md:border-b md:border-t-0 p-4">
      <Link
        href="/"
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="text-xs">Chat</span>
      </Link>
      <Link
        href="/transactions"
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
      >
        <LayoutDashboard className="h-6 w-6" />
        <span className="text-xs">Transactions</span>
      </Link>
    </nav>
  );
}
