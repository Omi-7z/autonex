import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api-client";
import type { Vendor } from "@shared/types";
import { Star, ShieldCheck, School, Users, Search } from "lucide-react";
function VendorCard({ vendor }: { vendor: Vendor }) {
  const navigate = useNavigate();
  const averageRating = vendor.reviews.length > 0
    ? vendor.reviews.reduce((acc, r) => acc + r.rating, 0) / vendor.reviews.length
    : 0;
  const handleViewDetails = () => {
    navigate(`/vendors/${vendor.id}`);
  };
  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle>{vendor.name}</CardTitle>
        <CardDescription>{vendor.address}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <ShieldCheck className="h-4 w-4 mr-1" />
            SCAD Rate: {vendor.scadRate}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{averageRating.toFixed(1)} ({vendor.reviews.length} reviews)</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {vendor.isAlumniOwned && <Badge><School className="h-4 w-4 mr-1" />Alumni Owned</Badge>}
          {vendor.isParentOwned && <Badge><Users className="h-4 w-4 mr-1" />Parent Owned</Badge>}
          {vendor.yearsInNetwork >= 5 && <Badge variant="outline">5+ Yrs in Network</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleViewDetails} className="w-full bg-brand-orange hover:bg-brand-orange/90">View Details</Button>
      </CardFooter>
    </Card>
  );
}
function VendorSkeleton() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}
export function VendorsPage() {
  const [searchParams] = useSearchParams();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [isAlumniOwned, setIsAlumniOwned] = useState(false);
  const [isParentOwned, setIsParentOwned] = useState(false);
  useEffect(() => {
    async function fetchVendors() {
      try {
        setLoading(true);
        const data = await api<Vendor[]>("/api/vendors");
        setVendors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = vendor.name.toLowerCase().includes(lowerSearchTerm) ||
                            vendor.description?.toLowerCase().includes(lowerSearchTerm) ||
                            vendor.services.some(s => s.toLowerCase().includes(lowerSearchTerm));
      const matchesService = serviceFilter === 'all' || vendor.services.includes(serviceFilter);
      const matchesAlumni = !isAlumniOwned || vendor.isAlumniOwned;
      const matchesParent = !isParentOwned || vendor.isParentOwned;
      return matchesSearch && matchesService && matchesAlumni && matchesParent;
    });
  }, [vendors, searchTerm, serviceFilter, isAlumniOwned, isParentOwned]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <h1 className="text-4xl font-bold text-brand-navy dark:text-white mb-2">Find a Vendor</h1>
          <p className="text-lg text-muted-foreground mb-8">Browse our network of trusted local repair shops.</p>
          <Card className="mb-8 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Search by Name or Service</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="search" placeholder="e.g., 'Precision Auto' or 'Brakes'" className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="service-type">Service Type</Label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger id="service-type">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Quick Service">Quick Service</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Body/Glass">Body/Glass</SelectItem>
                    <SelectItem value="Diagnostics">Diagnostics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="alumni-owned" checked={isAlumniOwned} onCheckedChange={(checked) => setIsAlumniOwned(Boolean(checked))} />
                  <Label htmlFor="alumni-owned">Alumni Owned</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parent-owned" checked={isParentOwned} onCheckedChange={(checked) => setIsParentOwned(Boolean(checked))} />
                  <Label htmlFor="parent-owned">Parent Owned</Label>
                </div>
              </div>
            </div>
          </Card>
          {error && <div className="text-center py-12 text-red-500">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <VendorSkeleton key={i} />)
            ) : filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No vendors match your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}