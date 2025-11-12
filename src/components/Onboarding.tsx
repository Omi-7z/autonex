import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, MessageSquareHeart } from "lucide-react";
import { useI18n } from '@/hooks/use-i18n';
const icons = [Search, Calendar, MessageSquareHeart];
interface OnboardingProps {
  open: boolean;
  onClose: () => void;
}
export function Onboarding({ open, onClose }: OnboardingProps) {
  const { t } = useI18n();
  const onboardingSlides = t('onboarding.slides');
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {onboardingSlides.map((slide: { title: string, description: string }, index: number) => {
              const Icon = icons[index];
              return (
                <CarouselItem key={index}>
                  <div className="p-6">
                    <Card className="border-none shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square">
                        <Icon className="w-16 h-16 text-brand-orange mb-6" />
                        <h2 className="text-2xl font-bold mb-2 text-brand-navy dark:text-white">{slide.title}</h2>
                        <p className="text-muted-foreground">{slide.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="flex justify-center p-4 pt-0">
            {current === onboardingSlides.length - 1 ? (
                <Button onClick={onClose} className="w-full bg-brand-orange hover:bg-brand-orange/90">{t('onboarding.getStarted')}</Button>
            ) : (
                <div className="flex items-center gap-2">
                    {onboardingSlides.map((_: any, i: number) => (
                        <div key={i} className={`h-2 w-2 rounded-full transition-all ${current === i ? 'p-1 bg-brand-orange' : 'bg-muted'}`} />
                    ))}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}