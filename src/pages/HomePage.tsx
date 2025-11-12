import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Onboarding } from "@/components/Onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Wrench, Car, Microscope } from "lucide-react";
const serviceCategories = [
  { name: "Quick Service", icon: Wrench, description: "Oil changes, tire rotation, etc." },
  { name: "Mechanical", icon: Car, description: "Engine, brakes, transmission." },
  { name: "Body/Glass", icon: Wrench, description: "Dents, cracks, and paint." },
  { name: "Not Sure/Diagnostics", icon: Microscope, description: "Let us help you figure it out." },
];
export function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const hasOnboarded = localStorage.getItem("anx_onboarded");
      if (hasOnboarded !== "true") {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);
  const handleOnboardingClose = () => {
    try {
      localStorage.setItem("anx_onboarded", "true");
    } catch (error) {
      console.error("Could not write to localStorage:", error);
    }
    setShowOnboarding(false);
  };
  const handleCategoryClick = () => {
    navigate('/vendors');
  };
  return (
    <AppLayout>
      <Onboarding open={showOnboarding} onClose={handleOnboardingClose} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 lg:py-32 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy dark:text-white tracking-tight">
            Honest Auto Repair, Simplified.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Find trusted, high-quality local mechanics in the AutoNex network.
          </p>
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by service or issue (e.g., 'Brake noise')"
                className="w-full pl-12 pr-4 py-3 h-12 text-base"
              />
            </div>
          </div>
        </div>
        <div className="pb-16 md:pb-24 lg:pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category) => (
              <Card
                key={category.name}
                onClick={handleCategoryClick}
                className="text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <category.icon className="h-10 w-10 mx-auto text-brand-orange mb-4" />
                  <h3 className="font-semibold text-lg text-brand-navy dark:text-white">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Or, let our AI help you get started.</p>
            <Button variant="link" className="text-brand-orange">
              Describe your issue...
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}