import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Onboarding } from "@/components/Onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Wrench, Car, Microscope, Bot } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";
const categoryIcons = {
  quickService: Wrench,
  mechanical: Car,
  bodyGlass: Wrench,
  diagnostics: Microscope,
};
export function HomePage() {
  const { t } = useI18n();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const navigate = useNavigate();
  const serviceCategories = [
    { key: "quickService", ...t('home.categories.quickService') },
    { key: "mechanical", ...t('home.categories.mechanical') },
    { key: "bodyGlass", ...t('home.categories.bodyGlass') },
    { key: "diagnostics", ...t('home.categories.diagnostics') },
  ];
  useEffect(() => {
    try {
      const hasOnboarded = localStorage.getItem("anx_onboarded");
      if (hasOnboarded !== "true") {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);
  const handleOnboardingClose = () => {
    try {
      localStorage.setItem("anx_onboarded", "true");
    } catch (error) {
      console.error("Could not write to localStorage:", error);
    }
    setShowOnboarding(false);
  };
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/vendors?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  const handleAiSearch = (e: FormEvent) => {
    e.preventDefault();
    if (aiQuery.trim()) {
      navigate(`/vendors?q=${encodeURIComponent(aiQuery.trim())}`);
    }
  };
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/vendors?q=${encodeURIComponent(categoryName)}`);
  };
  return (
    <AppLayout>
      <Onboarding open={showOnboarding} onClose={handleOnboardingClose} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 lg:py-32 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy dark:text-white tracking-tight">
            {t('home.title')}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('home.subtitle')}
          </p>
          <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('home.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="pb-16 md:pb-24 lg:pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => {
              const Icon = categoryIcons[category.key as keyof typeof categoryIcons];
              return (
                <Card
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <Icon className="h-10 w-10 mx-auto text-brand-orange mb-4" />
                    <h3 className="font-semibold text-lg text-brand-navy dark:text-white">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-12 max-w-2xl mx-auto">
            <form onSubmit={handleAiSearch} className="text-center">
              <p className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <Bot className="h-5 w-5" />
                {t('home.aiPrompt')}
              </p>
              <Textarea
                placeholder={t('home.aiPlaceholder')}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="min-h-[80px]"
              />
              <Button type="submit" className="mt-4 bg-brand-orange hover:bg-brand-orange/90">
                {t('home.aiButton')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}