import { useEffect, useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import type { Booking } from "@shared/types";
import { Check, MessageSquare, MoreHorizontal, Loader2, ShieldAlert } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
type AdminTab = "review" | "action" | "disputed";
export function AdminPage() {
  const { t } = useI18n();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("review");
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api<Booking[]>("/api/admin/all-bookings");
      setAllBookings(data.map(item => ({ ...item, date: new Date(item.date) })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);
  const filteredBookings = useMemo(() => {
    switch (activeTab) {
      case "review":
        return allBookings.filter(b => b.needsHumanReview);
      case "action":
        return allBookings.filter(b => b.status === 'action_required' && !b.dispute);
      case "disputed":
        return allBookings.filter(b => b.dispute);
      default:
        return [];
    }
  }, [allBookings, activeTab]);
  const handleUpdateStatus = async (bookingId: string, status: Booking['status'], notes?: string) => {
    if (notes) {
      setIsSubmitting(true);
    } else {
      setUpdatingId(bookingId);
    }
    try {
      await api(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      toast.success("Booking updated successfully!");
      setAllBookings(prev => prev.filter(b => b.id !== bookingId));
      if (isModalOpen) {
        setIsModalOpen(false);
        setAdminNotes("");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update booking.");
    } finally {
      setIsSubmitting(false);
      setUpdatingId(null);
    }
  };
  const handleApprove = (bookingId: string) => {
    handleUpdateStatus(bookingId, 'confirmed');
  };
  const openContactModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };
  const handleContactSubmit = () => {
    if (selectedBooking) {
      handleUpdateStatus(selectedBooking.id, 'action_required', adminNotes);
    }
  };
  const renderTable = (bookings: Booking[]) => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.customer')}</TableHead>
              <TableHead>{t('admin.vendor')}</TableHead>
              <TableHead>{t('admin.appointment')}</TableHead>
              {activeTab === 'disputed' && <TableHead>Dispute Reason</TableHead>}
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
                  {activeTab === 'disputed' && <TableCell><Skeleton className="h-5 w-40" /></TableCell>}
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive py-12">{error}</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">{t('admin.emptyQueue')}</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">User {booking.userId.substring(0, 6)}</TableCell>
                  <TableCell>{booking.vendorName}</TableCell>
                  <TableCell>
                    {booking.date.toLocaleDateString()} at {booking.time}
                  </TableCell>
                  {activeTab === 'disputed' && <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{booking.dispute?.reason}</TableCell>}
                  <TableCell className="text-right">
                    {updatingId === booking.id ? (
                      <div className="flex justify-end items-center h-full pr-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {activeTab === 'review' && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(booking.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                {t('admin.approveBooking')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openContactModal(booking)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {t('admin.contactCustomer')}
                              </DropdownMenuItem>
                            </>
                          )}
                          {activeTab !== 'review' && (
                            <DropdownMenuItem>
                              <ShieldAlert className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <h1 className="text-4xl font-bold text-brand-navy dark:text-white mb-2">{t('admin.title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">{t('admin.subtitle')}</p>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AdminTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="review">Needs Review</TabsTrigger>
              <TabsTrigger value="action">Action Required</TabsTrigger>
              <TabsTrigger value="disputed">Disputed</TabsTrigger>
            </TabsList>
            <TabsContent value="review" className="mt-6">{renderTable(filteredBookings)}</TabsContent>
            <TabsContent value="action" className="mt-6">{renderTable(filteredBookings)}</TabsContent>
            <TabsContent value="disputed" className="mt-6">{renderTable(filteredBookings)}</TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.addNote')}</DialogTitle>
            <DialogDescription>
              {t('admin.addNoteDescription', { customerName: selectedBooking ? `User ${selectedBooking.userId.substring(0,6)}` : 'the customer' })}
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