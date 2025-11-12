import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export function PaymentPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Pay Trust-Fee</CardTitle>
              <CardDescription>A small, refundable fee to secure your diagnostic slot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-black hover:bg-black/90 text-white" size="lg">Apple Pay</Button>
              <Button className="w-full bg-gray-200 hover:bg-gray-300 text-black" size="lg">Google Pay</Button>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">PayPal</Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or pay with card
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="lg">Credit or Debit Card</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}