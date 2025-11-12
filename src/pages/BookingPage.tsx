import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Vendor } from "@shared/types";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/stores/booking-store";
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
];
export function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const vendor = location.state?.vendor as Vendor | undefined;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [needsReview, setNeedsReview] = useState(false);
  const setBookingDetails = useBookingStore((state) => state.setBookingDetails);
  const handleProceedToPayment = () => {
    if (vendor && date && selectedTime) {
      setBookingDetails({
        vendor,
        date,
        time: selectedTime,
        needsReview,
      });
      navigate('/pay');
    }
  };
  if (!vendor) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold text-destructive">Booking Error</h2>
          <p className="text-muted-foreground">No vendor selected. Please go back and choose a vendor first.</p>
          <Button onClick={() => navigate('/vendors')} className="mt-4">Find a Vendor</Button>
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
                  <CardTitle>Your Appointment</CardTitle>
                  <CardDescription>You are booking a diagnostic appointment with:</CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-bold text-xl text-brand-navy dark:text-white">{vendor.name}</h3>
                  <p className="text-muted-foreground">{vendor.address}</p>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{date ? date.toLocaleDateString() : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{selectedTime || 'Not selected'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>1. Select a Date</CardTitle>
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
                  <CardTitle>2. Select a Time Slot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant="outline"
                        className={cn(
                          "h-12 text-base",
                          selectedTime === time && "bg-brand-orange text-white hover:bg-brand-orange/90 hover:text-white"
                        )}
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
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox id="human-review" checked={needsReview} onCheckedChange={(checked) => setNeedsReview(Boolean(checked))} />
                    <Label htmlFor="human-review" className="text-base">Text me an AutoNex Coordinator to review my booking</Label>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-brand-orange hover:bg-brand-orange/90"
                    disabled={!date || !selectedTime}
                    onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                  </Button>
                  {!date || !selectedTime && <p className="text-center text-sm text-muted-foreground mt-2">Please select a date and time to continue.</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}