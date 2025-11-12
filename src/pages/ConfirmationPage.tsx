import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/booking-store";
import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react";
export function ConfirmationPage() {
  const navigate = useNavigate();
  const booking = useBookingStore((state) => state.booking);
  const clearBooking = useBookingStore((state) => state.clearBooking);
  useEffect(() => {
    if (!booking) {
      navigate('/', { replace: true });
    }
    // Clear booking details when the user navigates away from this page
    return () => {
      clearBooking();
    };
  }, [booking, navigate, clearBooking]);
  if (!booking) {
    return null; // or a loading spinner
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 w-fit">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold mt-4">Booking Confirmed!</CardTitle>
              <CardDescription>Your appointment is set. We've sent a confirmation to your email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-bold text-lg text-brand-navy dark:text-white mb-2">{booking.vendor.name}</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.vendor.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                </div>
              </div>
              {booking.needsReview && (
                <p className="text-center text-sm text-muted-foreground">An AutoNex Coordinator will be in touch shortly to review your booking.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/')} className="w-full" variant="outline">Back to Home</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}