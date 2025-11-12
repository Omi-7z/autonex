import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { ServiceHistory } from "@shared/types";
import { ShieldAlert } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
function DisputeModal({ service }: { service: ServiceHistory }) {
  const { t } = useI18n();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldAlert className="h-4 w-4 mr-2" />
          {t('garage.dispute')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('garage.disputeTitle')}</DialogTitle>
          <DialogDescription>
            {t('garage.disputeDescription', { service: service.service, vendorName: service.vendorName })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              {t('garage.message')}
            </Label>
            <Textarea id="message" placeholder={t('garage.messagePlaceholder')} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-brand-orange hover:bg-brand-orange/90">{t('garage.sendMessage')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function GaragePage() {
  const { t } = useI18n();
  const [history, setHistory] = useState<ServiceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const data = await api<ServiceHistory[]>("/api/garage/history");
        setHistory(data.map(item => ({...item, date: new Date(item.date), warrantyExpires: item.warrantyExpires ? new Date(item.warrantyExpires) : null })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch service history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <h1 className="text-4xl font-bold text-brand-navy dark:text-white mb-2">{t('garage.title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t('garage.subtitle')}</p>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('garage.date')}</TableHead>
                    <TableHead>{t('garage.vendor')}</TableHead>
                    <TableHead>{t('garage.service')}</TableHead>
                    <TableHead className="text-right">{t('garage.cost')}</TableHead>
                    <TableHead>{t('garage.warranty')}</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-destructive py-12">{error}</TableCell>
                    </TableRow>
                  ) : history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-12">{t('garage.noHistory')}</TableCell>
                    </TableRow>
                  ) : (
                    history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date.toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{item.vendorName}</TableCell>
                        <TableCell>{item.service}</TableCell>
                        <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          {item.warrantyExpires ? (
                            new Date() > item.warrantyExpires ? (
                              <Badge variant="destructive">{t('garage.warrantyExpired')}</Badge>
                            ) : (
                              <Badge variant="secondary">{t('garage.warrantyUntil', { date: item.warrantyExpires.toLocaleDateString() })}</Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DisputeModal service={item} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}