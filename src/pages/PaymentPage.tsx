import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking-store";
import { Separator } from "@/components/ui/separator";
import { Apple, CreditCard } from "lucide-react";
export function PaymentPage() {
  const navigate = useNavigate();
  const booking = useBookingStore((state) => state.booking);
  useEffect(() => {
    if (!booking) {
      navigate('/vendors', { replace: true });
    }
  }, [booking, navigate]);
  const handlePayment = () => {
    // Here you would integrate a real payment provider.
    // For this mock, we'll just navigate to confirmation.
    navigate('/confirm');
  };
  if (!booking) {
    return null; // or a loading spinner
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Pay Trust-Fee</CardTitle>
                <CardDescription>A small, refundable fee to secure your diagnostic slot.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handlePayment} className="w-full bg-black hover:bg-black/90 text-white" size="lg">
                  <Apple className="h-5 w-5 mr-2" /> Apple Pay
                </Button>
                <Button onClick={handlePayment} className="w-full bg-gray-200 hover:bg-gray-300 text-black" size="lg">
                  Google Pay
                </Button>
                <Button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                  PayPal
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or pay with card
                    </span>
                  </div>
                </div>
                <Button onClick={handlePayment} variant="outline" className="w-full" size="lg">
                  <CreditCard className="h-5 w-5 mr-2" /> Credit or Debit Card
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-semibold">{booking.vendor.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.vendor.address}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">{booking.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {booking.time}</p>
                </div>
                {booking.needsReview && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Extra</p>
                      <p className="font-semibold">An AutoNex Coordinator will text you to review.</p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-baseline bg-muted/80 p-4 rounded-b-lg">
                <span className="font-semibold">Trust-Fee</span>
                <span className="text-2xl font-bold text-brand-navy dark:text-white">$5.00</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}