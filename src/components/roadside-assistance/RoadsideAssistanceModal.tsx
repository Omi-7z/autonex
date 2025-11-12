import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { toast } from "sonner";
import { useState, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";
interface RoadsideAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function RoadsideAssistanceModal({ isOpen, onClose }: RoadsideAssistanceModalProps) {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formSchema = useMemo(() => z.object({
    vin: z.string().min(11, { message: t('roadsideAssistance.validation.vin') }).max(17),
    insuranceCompany: z.string().min(2, { message: t('roadsideAssistance.validation.insuranceCompany') }),
    insuranceNumber: z.string().min(5, { message: t('roadsideAssistance.validation.insuranceNumber') }),
    mileage: z.string().refine(val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
      message: t('roadsideAssistance.validation.mileage'),
    }),
  }), [t]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vin: "",
      insuranceCompany: "",
      insuranceNumber: "",
      mileage: "",
    },
  });
  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Roadside Assistance Request:", values);
      toast.success(t('roadsideAssistance.successToast'));
      setIsSubmitting(false);
      form.reset();
      onClose();
    }, 1500);
  }, [t, form, onClose]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('roadsideAssistance.modalTitle')}</DialogTitle>
          <DialogDescription>{t('roadsideAssistance.modalDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roadsideAssistance.vinLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('roadsideAssistance.vinPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roadsideAssistance.insuranceCompanyLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('roadsideAssistance.insuranceCompanyPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roadsideAssistance.insuranceNumberLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('roadsideAssistance.insuranceNumberPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('roadsideAssistance.mileageLabel')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('roadsideAssistance.mileagePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange/90" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('roadsideAssistance.submitButton')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}