import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
const onboardingSlides = [
  {
    icon: Search,
    title: "What is AutoNex?",
    description: "A trusted network of local, high-quality auto repair shops. We help you find the right mechanic without the hassle.",
  },
  {
    icon: Calendar,
    title: "How does it work?",
    description: "Describe your issue, choose a vetted vendor, and book a diagnostic appointment for a small, refundable Trust-Fee.",
  },
  {
    icon: MessageSquareHeart,
    title: "Real Human Support",
    description: "Need help? An AutoNex Coordinator can review your booking to ensure you get the best care. We're here for you.",
  },
];
interface OnboardingProps {
  open: boolean;
  onClose: () => void;
}
export function Onboarding({ open, onClose }: OnboardingProps) {
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
            {onboardingSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="p-6">
                  <Card className="border-none shadow-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center aspect-square">
                      <slide.icon className="w-16 h-16 text-brand-orange mb-6" />
                      <DialogTitle className="text-2xl font-bold mb-2 text-brand-navy dark:text-white">{slide.title}</DialogTitle>
                      <DialogDescription className="text-muted-foreground">{slide.description}</DialogDescription>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="flex justify-center p-4 pt-0">
            {current === onboardingSlides.length - 1 ? (
                <Button onClick={onClose} className="w-full bg-brand-orange hover:bg-brand-orange/90">Get Started</Button>
            ) : (
                <div className="flex items-center gap-2">
                    {onboardingSlides.map((_, i) => (
                        <div key={i} className={`h-2 w-2 rounded-full transition-all ${current === i ? 'p-1 bg-brand-orange' : 'bg-muted'}`} />
                    ))}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}