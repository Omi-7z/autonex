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
import type { Booking } from "@shared/types";
import { ShieldAlert, User, Loader2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";
function DisputeModal({ booking }: { booking: Booking }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmitDispute = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      await api(`/api/bookings/${booking.id}/dispute`, {
        method: 'POST',
        body: JSON.stringify({ reason: message }),
      });
      toast.success(t('garage.disputeSuccess'));
      setIsOpen(false);
      setMessage("");
      // Optionally, you could trigger a refetch of the history data here
    } catch (err) {
      toast.error(t('garage.disputeFailed'), {
        description: err instanceof Error ? err.message : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!!booking.dispute}>
          <ShieldAlert className="h-4 w-4 mr-2" />
          {booking.dispute ? t('garage.disputed') : t('garage.dispute')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('garage.disputeTitle')}</DialogTitle>
          <DialogDescription>
            {t('garage.disputeDescription', { service: booking.services.map(s => s.name).join(', '), vendorName: booking.vendorName })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">{t('garage.message')}</Label>
            <Textarea
              id="message"
              placeholder={t('garage.messagePlaceholder')}
              className="col-span-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmitDispute} disabled={isSubmitting || !message.trim()} className="bg-brand-orange hover:bg-brand-orange/90">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('garage.sendMessage')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function GaragePage() {
  const { t } = useI18n();
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const [history, setHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      async function fetchHistory() {
        try {
          setLoading(true);
          const data = await api<Booking[]>("/api/garage/history");
          setHistory(data.map(item => ({...item, date: new Date(item.date) })));
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch service history");
        } finally {
          setLoading(false);
        }
      }
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <h1 className="text-4xl font-bold text-brand-navy dark:text-white mb-2">{t('garage.title')}</h1>
          {user ? (
            <p className="text-lg text-muted-foreground mb-8">{t('user.welcome', { name: user.name })}</p>
          ) : (
            <p className="text-lg text-muted-foreground mb-8">{t('garage.subtitle')}</p>
          )}
          {!user ? (
            <Card className="text-center py-16">
              <CardContent>
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">{t('garage.signInPromptTitle')}</h3>
                <p className="text-muted-foreground mt-2 mb-4">{t('garage.signInPromptDescription')}</p>
                <Button onClick={login}>{t('garage.signIn')}</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('garage.date')}</TableHead>
                      <TableHead>{t('garage.vendor')}</TableHead>
                      <TableHead>{t('garage.service')}</TableHead>
                      <TableHead className="text-right">{t('garage.cost')}</TableHead>
                      <TableHead>{t('garage.status')}</TableHead>
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
                          <TableCell>{item.services.map(s => s.name).join(', ')}</TableCell>
                          <TableCell className="text-right">${item.services.reduce((acc, s) => acc + s.price, 0).toFixed(2)}</TableCell>
                          <TableCell>
                            {item.dispute ? (
                                <Badge variant="destructive">{t('garage.disputed')}</Badge>
                            ) : (
                                <Badge variant="secondary">{t('garage.completed')}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DisputeModal booking={item} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}