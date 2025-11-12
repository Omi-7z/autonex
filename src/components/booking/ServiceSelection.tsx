import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { ServiceBundle, ServiceItem, AISuggestionResponse } from '@shared/types';
import { useI18n } from '@/hooks/use-i18n';
import { Bot } from 'lucide-react';
interface ServiceSelectionProps {
  vendorId: string;
  selectedServices: ServiceItem[];
  onSelectionChange: (services: ServiceItem[]) => void;
  query?: string;
}
export function ServiceSelection({ vendorId, selectedServices, onSelectionChange, query }: ServiceSelectionProps) {
  const { t } = useI18n();
  const [services, setServices] = useState<{ bundles: ServiceBundle[], items: ServiceItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestionResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const data = await api<{ bundles: ServiceBundle[], items: ServiceItem[] }>(`/api/vendors/${vendorId}/services`);
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchAiSuggestion() {
      if (query) {
        setAiLoading(true);
        try {
          const suggestion = await api<AISuggestionResponse>('/api/ai/suggest-service', {
            method: 'POST',
            body: JSON.stringify({ vendorId, query }),
          });
          setAiSuggestion(suggestion);
        } catch (error) {
          console.error("Failed to fetch AI suggestion:", error);
        } finally {
          setAiLoading(false);
        }
      }
    }
    fetchServices();
    fetchAiSuggestion();
  }, [vendorId, query]);
  const handleServiceToggle = (service: ServiceItem, checked: boolean) => {
    const newSelection = checked
      ? [...selectedServices, service]
      : selectedServices.filter(s => s.id !== service.id);
    onSelectionChange(newSelection);
  };
  const isSelected = (serviceId: string) => selectedServices.some(s => s.id === serviceId);
  const allServices = services ? [...services.items, ...services.bundles.flatMap(b => b.items)] : [];
  const suggestedService = aiSuggestion ? allServices.find(s => s.id === aiSuggestion.serviceId) : null;
  if (loading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {aiLoading && <Skeleton className="h-24 w-full" />}
      {suggestedService && aiSuggestion && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              {t('vendorDetail.aiSuggestion')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic mb-2">"{aiSuggestion.reason}"</p>
            <div className="p-3 border rounded-md bg-background flex items-center space-x-2">
              <Checkbox
                id={`suggested-${suggestedService.id}`}
                checked={isSelected(suggestedService.id)}
                onCheckedChange={(checked) => handleServiceToggle(suggestedService, Boolean(checked))}
              />
              <Label htmlFor={`suggested-${suggestedService.id}`} className="flex justify-between w-full cursor-pointer">
                <div>
                  <p className="font-semibold">{suggestedService.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">{suggestedService.description}</p>
                </div>
                <span className="font-mono text-right">${suggestedService.price.toFixed(2)}</span>
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{t('booking.selectServices')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['bundles', 'items']} className="w-full">
            {services?.bundles && services.bundles.length > 0 && (
              <AccordionItem value="bundles">
                <AccordionTrigger className="text-lg font-semibold">{t('booking.serviceBundles')}</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {services.bundles.map(bundle => (
                    <div key={bundle.id} className="p-4 border rounded-md bg-muted/50">
                      <h4 className="font-semibold">{bundle.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{bundle.description}</p>
                      {bundle.items.map(item => (
                        <div key={item.id} className="flex items-center space-x-2 py-2">
                          <Checkbox
                            id={item.id}
                            checked={isSelected(item.id)}
                            onCheckedChange={(checked) => handleServiceToggle(item, Boolean(checked))}
                          />
                          <Label htmlFor={item.id} className="flex justify-between w-full cursor-pointer">
                            <span>{item.name}</span>
                            <span className="font-mono text-right">${item.price.toFixed(2)}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}
            {services?.items && services.items.length > 0 && (
              <AccordionItem value="items">
                <AccordionTrigger className="text-lg font-semibold">{t('booking.individualServices')}</AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  {services.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                      <Checkbox
                        id={item.id}
                        checked={isSelected(item.id)}
                        onCheckedChange={(checked) => handleServiceToggle(item, Boolean(checked))}
                      />
                      <Label htmlFor={item.id} className="flex justify-between w-full cursor-pointer">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-xs text-muted-foreground font-normal">{item.description}</p>
                        </div>
                        <span className="font-mono text-right">${item.price.toFixed(2)}</span>
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}