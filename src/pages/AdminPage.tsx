import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { AdminBooking } from "@shared/types";
import { Check, MessageSquare, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";
export function AdminPage() {
  const { t } = useI18n();
  const [queue, setQueue] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchQueue() {
      try {
        setLoading(true);
        const data = await api<AdminBooking[]>("/api/admin/review-queue");
        setQueue(data.map(item => ({ ...item, date: new Date(item.date) })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch review queue");
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, []);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <h1 className="text-4xl font-bold text-brand-navy dark:text-white mb-2">{t('admin.title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t('admin.subtitle')}</p>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.customer')}</TableHead>
                    <TableHead>{t('admin.vendor')}</TableHead>
                    <TableHead>{t('admin.appointment')}</TableHead>
                    <TableHead>{t('admin.status')}</TableHead>
                    <TableHead className="text-right">{t('admin.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-destructive py-12">{error}</TableCell>
                    </TableRow>
                  ) : queue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-12">{t('admin.emptyQueue')}</TableCell>
                    </TableRow>
                  ) : (
                    queue.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.customerName}</TableCell>
                        <TableCell>{booking.vendorName}</TableCell>
                        <TableCell>
                          {booking.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {booking.time}
                        </TableCell>
                        <TableCell>
                          <Badge variant={booking.status === 'Needs Review' ? 'default' : 'secondary'} className={booking.status === 'Needs Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Check className="mr-2 h-4 w-4" />
                                {t('admin.approve')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {t('admin.contact')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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