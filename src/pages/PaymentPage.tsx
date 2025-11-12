import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking-store";
import { Separator } from "@/components/ui/separator";
import { Apple, CreditCard, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import type { CreateBookingPayload } from "@shared/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
export function PaymentPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const booking = useBookingStore((state) => state.booking);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!booking) {
      navigate('/vendors', { replace: true });
    }
  }, [booking, navigate]);
  const handlePayment = async () => {
    if (!booking) return;
    setIsProcessing(true);
    setError(null);
    try {
      const payload: CreateBookingPayload = {
        vendorId: booking.vendor.id,
        vendorName: booking.vendor.name,
        date: booking.date.toISOString(),
        time: booking.time,
        needsReview: booking.needsReview,
        services: booking.services,
      };
      await api('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      navigate('/confirm');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during booking.");
    } finally {
      setIsProcessing(false);
    }
  };
  if (!booking) {
    return null;
  }
  const estimatedTotal = booking.services.reduce((acc, service) => acc + service.price, 0);
  const PaymentButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
    <Button onClick={handlePayment} size="lg" disabled={isProcessing} {...props}>
      {isProcessing ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : children}
    </Button>
  );
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{t('payment.title')}</CardTitle>
                <CardDescription>{t('payment.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>{t('payment.bookingFailed')}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <PaymentButton className="w-full bg-black hover:bg-black/90 text-white">
                  <Apple className="h-5 w-5 mr-2" /> Apple Pay
                </PaymentButton>
                <PaymentButton className="w-full bg-gray-200 hover:bg-gray-300 text-black">
                  Google Pay
                </PaymentButton>
                <PaymentButton className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  PayPal
                </PaymentButton>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {t('payment.orPayWithCard')}
                    </span>
                  </div>
                </div>
                <PaymentButton variant="outline" className="w-full">
                  <CreditCard className="h-5 w-5 mr-2" /> {t('payment.creditOrDebit')}
                </PaymentButton>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>{t('payment.summaryTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('payment.vendorLabel')}</p>
                  <p className="font-semibold">{booking.vendor.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.vendor.address}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">{t('payment.dateTimeLabel')}</p>
                  <p className="font-semibold">{booking.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {booking.time}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">{t('payment.selectedServices')}</p>
                  <ul className="font-semibold list-disc list-inside">
                    {booking.services.map(s => <li key={s.id}>{s.name}</li>)}
                  </ul>
                </div>
                {booking.needsReview && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('payment.extraLabel')}</p>
                      <p className="font-semibold">{t('payment.extraDescription')}</p>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold">{t('payment.estimatedTotal')}</span>
                  <span className="text-lg font-bold text-brand-navy dark:text-white">${estimatedTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-baseline bg-muted/80 p-4 rounded-b-lg">
                <span className="font-semibold">{t('payment.feeLabel')}</span>
                <span className="text-2xl font-bold text-brand-navy dark:text-white">$5.00</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}