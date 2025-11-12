import { Link } from "react-router-dom";
import { useI18n } from "@/hooks/use-i18n";
export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/autonex.svg" alt="AutoNex Logo" className="h-6 w-6 dark:invert" />
            <span className="font-bold text-lg text-brand-navy dark:text-white">AutoNex</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-foreground">{t('footer.about')}</Link>
            <Link to="#" className="hover:text-foreground">{t('footer.contact')}</Link>
            <Link to="#" className="hover:text-foreground">{t('footer.terms')}</Link>
            <Link to="#" className="hover:text-foreground">{t('footer.privacy')}</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            {t('footer.builtWithLove')}
          </p>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          {t('footer.copyright', { year })}
        </div>
      </div>
    </footer>
  );
}