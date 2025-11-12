import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
export function ConfirmationPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 w-fit">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold mt-4">Booking Confirmed!</CardTitle>
              <CardDescription>Your appointment is set. We've sent a confirmation to your email.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You can view your booking details in "My Garage".</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}