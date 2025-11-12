import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api-client";
import type { Vendor } from "@shared/types";
import { Star, ShieldCheck, School, Users, ArrowLeft } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
function VendorDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full mt-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export function VendorDetailPage() {
  const { t } = useI18n();
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const query = location.state?.query || '';
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!vendorId) {
      setError("Vendor ID is missing.");
      setLoading(false);
      return;
    }
    async function fetchVendorData() {
      try {
        setLoading(true);
        const vendorData = await api<Vendor>(`/api/vendors/${vendorId}`);
        setVendor(vendorData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch vendor details");
      } finally {
        setLoading(false);
      }
    }
    fetchVendorData();
  }, [vendorId]);
  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <VendorDetailSkeleton />
        </div>
      </AppLayout>
    );
  }
  if (error || !vendor) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 text-center">
          <h2 className="text-2xl font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error || t('vendorDetail.error')}</p>
          <Button onClick={() => navigate('/vendors')} className="mt-4">{t('vendorDetail.back')}</Button>
        </div>
      </AppLayout>
    );
  }
  const averageRating = vendor.reviews.length > 0
    ? vendor.reviews.reduce((acc, r) => acc + r.rating, 0) / vendor.reviews.length
    : 0;
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('vendorDetail.back')}
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">{vendor.name}</CardTitle>
                  <CardDescription>{vendor.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{vendor.description}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{t('vendorDetail.reviews')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {vendor.reviews.map((review, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold">{review.author}</div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground italic">"{review.comment}"</p>
                        {index < vendor.reviews.length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1 sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>{t('vendorDetail.details')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('vendorDetail.scadRate')}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      {vendor.scadRate}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('vendorDetail.avgRating')}</span>
                    <div className="flex items-center gap-1 font-semibold">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {averageRating.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('vendorDetail.yearsInNetwork')}</span>
                    <span className="font-semibold">{vendor.yearsInNetwork}</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {vendor.isAlumniOwned && <Badge className="w-full justify-center"><School className="h-4 w-4 mr-2" />{t('vendors.alumniOwned')}</Badge>}
                    {vendor.isParentOwned && <Badge className="w-full justify-center"><Users className="h-4 w-4 mr-2" />{t('vendors.parentOwned')}</Badge>}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">{t('vendorDetail.services')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {vendor.services.map(service => <Badge key={service} variant="outline">{service}</Badge>)}
                    </div>
                  </div>
                  <Button onClick={() => navigate('/book', { state: { vendor, query } })} size="lg" className="w-full mt-4 bg-brand-orange hover:bg-brand-orange/90">{t('vendorDetail.bookAppointment')}</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}