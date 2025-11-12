import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { AdminBooking, Booking } from "@shared/types";
import { Check, MessageSquare, MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
export function AdminPage() {
  const { t } = useI18n();
  const [queue, setQueue] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await api<AdminBooking[]>("/api/admin/review-queue");
      setQueue(data.map(item => ({ ...item, date: new Date(item.date) })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch review queue");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQueue();
  }, []);
  const handleUpdateStatus = async (bookingId: string, status: Booking['status'], notes?: string) => {
    setIsSubmitting(true);
    try {
      await api(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      toast.success("Booking updated successfully!");
      setQueue(prev => prev.filter(b => b.id !== bookingId));
      setIsModalOpen(false);
      setAdminNotes("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update booking.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleApprove = (bookingId: string) => {
    handleUpdateStatus(bookingId, 'confirmed');
  };
  const openContactModal = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };
  const handleContactSubmit = () => {
    if (selectedBooking) {
      handleUpdateStatus(selectedBooking.id, 'action_required', adminNotes);
    }
  };
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
                              <DropdownMenuItem onClick={() => handleApprove(booking.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                {t('admin.approveBooking')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openContactModal(booking)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {t('admin.contactCustomer')}
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.addNote')}</DialogTitle>
            <DialogDescription>
              {t('admin.addNoteDescription', { customerName: selectedBooking?.customerName || 'the customer' })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="admin-notes">{t('admin.notes')}</Label>
              <Textarea
                id="admin-notes"
                placeholder={t('admin.notesPlaceholder')}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleContactSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('admin.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}