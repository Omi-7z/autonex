import { Link, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Wrench } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
const navLinks = [
  { to: "/vendors", label: "Find a Vendor" },
  { to: "/translate", label: "Translate a Quote" },
  { to: "/garage", label: "My Garage" },
];
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Wrench className="h-6 w-6 text-brand-orange" />
            <span className="text-brand-navy dark:text-white">AutoNex</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 border-r pr-2 mr-2">
                <Button variant="ghost" size="sm">EN</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">ES</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">中文</Button>
            </div>
            <ThemeToggle className="relative" />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                    <Wrench className="h-6 w-6 text-brand-orange" />
                    <span className="text-brand-navy dark:text-white">AutoNex</span>
                  </Link>
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `hover:text-foreground/80 ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}