import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users, Globe } from "lucide-react";

const stats = [
  { value: "50,000+", label: "Properties Listed", icon: Building2 },
  { value: "10,000+", label: "Happy Clients", icon: Users },
  { value: "77+", label: "Provinces Covered", icon: Globe },
];

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full border border-primary-foreground/20 mb-8">
            <span className="text-sm font-medium text-primary-foreground">
              For Property Owners & Agents
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Sell or Rent Your Property?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            List your property on CasaFind.ph and reach thousands of verified buyers and renters across the Philippines and beyond.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="hero" size="xl" className="gap-2">
              List Your Property
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center p-6 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10"
              >
                <stat.icon className="h-8 w-8 text-primary-foreground/60 mb-3" />
                <span className="text-3xl font-bold text-primary-foreground mb-1">
                  {stat.value}
                </span>
                <span className="text-sm text-primary-foreground/70">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
