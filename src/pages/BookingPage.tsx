import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Vendor, ServiceItem } from "@shared/types";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/stores/booking-store";
import { useI18n } from "@/hooks/use-i18n";
import { ServiceSelection } from "@/components/booking/ServiceSelection";
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
];
export function BookingPage() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const vendor = location.state?.vendor as Vendor | undefined;
  const [step, setStep] = useState<'services' | 'datetime'>('services');
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [needsReview, setNeedsReview] = useState(false);
  const setBookingDetails = useBookingStore((state) => state.setBookingDetails);
  const handleProceed = () => {
    if (step === 'services') {
      if (selectedServices.length > 0) {
        setStep('datetime');
      }
    } else if (step === 'datetime') {
      if (vendor && date && selectedTime) {
        setBookingDetails({
          vendor,
          date,
          time: selectedTime,
          needsReview,
          services: selectedServices,
        });
        navigate('/pay');
      }
    }
  };
  if (!vendor) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold text-destructive">{t('booking.errorTitle')}</h2>
          <p className="text-muted-foreground">{t('booking.errorDescription')}</p>
          <Button onClick={() => navigate('/vendors')} className="mt-4">{t('booking.findVendorButton')}</Button>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t('booking.title')}</CardTitle>
                  <CardDescription>{t('booking.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold text-xl text-brand-navy dark:text-white">{vendor.name}</h3>
                  <p className="text-muted-foreground">{vendor.address}</p>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('booking.dateLabel')}</span>
                      <span className="font-medium">{date ? date.toLocaleDateString() : t('booking.notSelected')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('booking.timeLabel')}</span>
                      <span className="font-medium">{selectedTime || t('booking.notSelected')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
              {step === 'services' && (
                <ServiceSelection vendorId={vendor.id} selectedServices={selectedServices} onSelectionChange={setSelectedServices} />
              )}
              {step === 'datetime' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('booking.selectDateTime')}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('booking.timeLabel')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {timeSlots.map(time => (
                          <Button
                            key={time}
                            variant="outline"
                            className={cn("h-12 text-base", selectedTime === time && "bg-brand-orange text-white hover:bg-brand-orange/90 hover:text-white")}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="human-review" checked={needsReview} onCheckedChange={(checked) => setNeedsReview(Boolean(checked))} />
                        <Label htmlFor="human-review" className="text-base">{t('booking.humanReview')}</Label>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    size="lg"
                    className="w-full bg-brand-orange hover:bg-brand-orange/90"
                    disabled={(step === 'services' && selectedServices.length === 0) || (step === 'datetime' && (!date || !selectedTime))}
                    onClick={handleProceed}
                  >
                    {step === 'services' ? t('booking.proceedToDateTime') : t('booking.proceedToPayment')}
                  </Button>
                  {step === 'services' && selectedServices.length === 0 && <p className="text-center text-sm text-muted-foreground mt-2">{t('booking.serviceSelectionWarning')}</p>}
                  {step === 'datetime' && (!date || !selectedTime) && <p className="text-center text-sm text-muted-foreground mt-2">{t('booking.selectionWarning')}</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}