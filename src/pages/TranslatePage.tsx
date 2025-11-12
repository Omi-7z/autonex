import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api-client";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/hooks/use-i18n";
type AnalysisResult = {
  totalCost: number;
  lineItems: { item: string; cost: number; notes: string }[];
  summary: string;
};
export function TranslatePage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setAnalysis(null);
      setError(null);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });
  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setError(null);
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(oldProgress + diff, 90);
      });
    }, 200);
    try {
      const formData = new FormData();
      formData.append("quote", file);
      const result = await api<AnalysisResult>("/api/translate-quote", {
        method: "POST",
        body: formData,
      });
      clearInterval(timer);
      setProgress(100);
      setAnalysis(result);
      setStatus('success');
    } catch (err) {
      clearInterval(timer);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setStatus('error');
    }
  };
  const handleRemoveFile = () => {
    setFile(null);
    setStatus('idle');
    setAnalysis(null);
    setProgress(0);
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-brand-navy dark:text-white">{t('translate.title')}</h1>
              <p className="text-lg text-muted-foreground mt-2">{t('translate.subtitle')}</p>
            </div>
            <Card>
              <CardContent className="p-6">
                {!file ? (
                  <div {...getRootProps()} className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/20' : 'border-border hover:border-brand-orange/50'}`}>
                    <input {...getInputProps()} />
                    <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-semibold">{t('translate.dropzonePrompt')}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('translate.dropzoneHint')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <File className="h-8 w-8 text-brand-navy dark:text-white" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    {status === 'uploading' && <Progress value={progress} className="w-full" />}
                    <Button onClick={handleUpload} disabled={status === 'uploading'} className="w-full bg-brand-orange hover:bg-brand-orange/90">
                      {status === 'uploading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('translate.analyzeButton')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            {status === 'success' && analysis && (
              <Card className="mt-8 animate-fade-in">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <h2 className="text-xl font-bold">{t('translate.analysisComplete')}</h2>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{t('translate.summary')}</h3>
                    <p className="text-muted-foreground">{analysis.summary}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg">{t('translate.lineItems')}</h3>
                    <ul className="space-y-2 mt-2">
                      {analysis.lineItems.map((item, index) => (
                        <li key={index} className="p-3 border rounded-md bg-muted/50">
                          <div className="flex justify-between font-medium">
                            <span>{item.item}</span>
                            <span>${item.cost.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right font-bold text-xl">
                    {t('translate.total')} ${analysis.totalCost.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            )}
            {status === 'error' && (
              <div className="mt-8 flex items-center gap-3 p-4 border rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  <h4 className="font-semibold">{t('translate.analysisFailed')}</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}