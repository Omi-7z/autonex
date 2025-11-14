import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { motion } from "framer-motion";
import { CheckCircle, Engine, Droplets, Wind, Wrench, Car, Battery } from "lucide-react";
import React from "react";
const HealthMetricCard = ({ icon: Icon, title, value, statusColor }: { icon: React.ElementType, title: string, value: string, statusColor?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${statusColor || ''}`}>{value}</div>
    </CardContent>
  </Card>
);
export function CarHealthPage() {
  const { t } = useI18n();
  const metrics = [
    {
      icon: Engine,
      title: t('carHealth.engineStatus.title'),
      value: t('carHealth.engineStatus.value'),
      statusColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Droplets,
      title: t('carHealth.oilLevel.title'),
      value: t('carHealth.oilLevel.value'),
    },
    {
      icon: Wind,
      title: t('carHealth.airQuality.title'),
      value: t('carHealth.airQuality.value'),
    },
    {
      icon: Wrench,
      title: t('carHealth.nextService.title'),
      value: t('carHealth.nextService.value'),
    },
    {
      icon: Car,
      title: t('carHealth.tirePressure.title'),
      value: t('carHealth.tirePressure.value'),
      statusColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Battery,
      title: t('carHealth.batteryHealth.title'),
      value: t('carHealth.batteryHealth.value'),
    },
  ];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-brand-navy dark:text-white mb-2">{t('carHealth.title')}</h1>
            <p className="text-lg text-muted-foreground mb-8">{t('carHealth.subtitle')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('carHealth.obdStatus.title')}</CardTitle>
                <CardDescription>{t('carHealth.obdStatus.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-lg">{t('carHealth.obdStatus.value')}</p>
                    <p className="text-sm text-muted-foreground">{t('carHealth.obdStatus.lastSync')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
              >
                <HealthMetricCard {...metric} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}