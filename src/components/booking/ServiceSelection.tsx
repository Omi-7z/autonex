import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { ServiceBundle, ServiceItem } from '@shared/types';
import { useI18n } from '@/hooks/use-i18n';
interface ServiceSelectionProps {
  vendorId: string;
  selectedServices: ServiceItem[];
  onSelectionChange: (services: ServiceItem[]) => void;
}
export function ServiceSelection({ vendorId, selectedServices, onSelectionChange }: ServiceSelectionProps) {
  const { t } = useI18n();
  const [services, setServices] = useState<{ bundles: ServiceBundle[], items: ServiceItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
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
    fetchServices();
  }, [vendorId]);
  const handleServiceToggle = (service: ServiceItem, checked: boolean) => {
    const newSelection = checked
      ? [...selectedServices, service]
      : selectedServices.filter(s => s.id !== service.id);
    onSelectionChange(newSelection);
  };
  const isSelected = (serviceId: string) => selectedServices.some(s => s.id === serviceId);
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
  );
}