import { Link } from "react-router-dom";
import { Wrench } from "lucide-react";
export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-brand-orange" />
            <span className="font-bold text-lg text-brand-navy dark:text-white">AutoNex</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-foreground">About Us</Link>
            <Link to="#" className="hover:text-foreground">Contact</Link>
            <Link to="#" className="hover:text-foreground">Terms of Service</Link>
            <Link to="#" className="hover:text-foreground">Privacy Policy</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ at Cloudflare
          </p>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AutoNex. All rights reserved.
        </div>
      </div>
    </footer>
  );
}