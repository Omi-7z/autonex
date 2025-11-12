import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Car, Microscope, Bot, Loader2, Paintbrush } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api-client";
import type { AIIntakeResponse } from "@shared/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
const categoryIcons = {
  quickService: Wrench,
  mechanical: Car,
  bodyGlass: Paintbrush,
  diagnostics: Microscope,
};
export function HomePage() {
  const { t } = useI18n();
  const [aiQuery, setAiQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const navigate = useNavigate();
  const serviceCategories = [
    { key: "quickService", ...t('home.categories.quickService') },
    { key: "mechanical", ...t('home.categories.mechanical') },
    { key: "bodyGlass", ...t('home.categories.bodyGlass') },
    { key: "diagnostics", ...t('home.categories.diagnostics') },
  ];
  const handleAiSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await api<AIIntakeResponse>('/api/ai/intake', {
        method: 'POST',
        body: JSON.stringify({ query: aiQuery.trim() }),
      });
      navigate(`/vendors?q=${encodeURIComponent(result.searchTerm)}&category=${result.category}&source=ai`);
    } catch (err) {
      toast.error("AI analysis failed. Please try a manual search.");
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/vendors?q=${encodeURIComponent(categoryName)}`);
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 lg:py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy dark:text-white tracking-tight"
          >
            {t('home.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            {t('home.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mt-10 max-w-2xl mx-auto">
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
                <Button type="submit" className="mt-4 bg-brand-orange hover:bg-brand-orange/90" disabled={isAiLoading}>
                  {isAiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('home.aiButton')}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
        <div className="pb-16 md:pb-24 lg:pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => {
              const Icon = categoryIcons[category.key as keyof typeof categoryIcons];
              return (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card
                    onClick={() => handleCategoryClick(category.name)}
                    className="text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full"
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <Icon className="h-10 w-10 mx-auto text-brand-orange mb-4" />
                      <h3 className="font-semibold text-lg text-brand-navy dark:text-white">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 flex-grow">{category.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          <div className="py-16 md:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy dark:text-white">
                {t('home.howItWorksSection.title')}
              </h2>
            </motion.div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {t('home.howItWorksSection.steps').map((step: { title: string; description: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-orange text-white font-bold text-xl">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-navy dark:text-white">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}