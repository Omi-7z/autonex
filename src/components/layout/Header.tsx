import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Wrench, User, LogOut, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useI18n } from "@/hooks/use-i18n";
import { LANGUAGES } from "@/lib/i18n";
import { useUserStore } from "@/stores/user-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { RoadsideAssistanceModal } from "@/components/roadside-assistance/RoadsideAssistanceModal";
export function Header() {
  const { t, language, setLanguage } = useI18n();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const [isRoadsideModalOpen, setIsRoadsideModalOpen] = useState(false);
  const navLinks = [
    { to: "/vendors", label: t('header.findVendor') },
    { to: "/translate", label: t('header.translateQuote') },
    { to: "/garage", label: t('header.myGarage') },
  ];
  const languageSwitcher = (
    <div className="flex items-center gap-1">
      {LANGUAGES.map(lang => (
        <Button
          key={lang.key}
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(lang.key)}
          className={language === lang.key ? 'text-foreground font-semibold' : 'text-muted-foreground'}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
  return (
    <>
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
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2" onClick={() => setIsRoadsideModalOpen(true)}>
                <ShieldAlert className="h-4 w-4" />
                {t('roadsideAssistance.button')}
              </Button>
              <div className="hidden md:flex items-center border-l pl-2 ml-2">
                {languageSwitcher}
              </div>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('user.signOut')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
                     <a href="#" onClick={(e) => { e.preventDefault(); setIsRoadsideModalOpen(true); }} className="text-muted-foreground hover:text-foreground/80 flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5" />
                      {t('roadsideAssistance.button')}
                    </a>
                  </nav>
                  <Separator className="my-6" />
                  <div className="flex justify-center">
                    {languageSwitcher}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <RoadsideAssistanceModal isOpen={isRoadsideModalOpen} onClose={() => setIsRoadsideModalOpen(false)} />
    </>
  );
}