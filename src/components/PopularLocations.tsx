import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const locations = [
  {
    name: "Makati City",
    properties: 1234,
    trend: "+12%",
    image: "https://images.unsplash.com/photo-1555883006-0f5a0915a80f?w=400&h=300&fit=crop",
  },
  {
    name: "Bonifacio Global City",
    properties: 856,
    trend: "+18%",
    image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=400&h=300&fit=crop",
  },
  {
    name: "Cebu City",
    properties: 645,
    trend: "+8%",
    image: "https://images.unsplash.com/photo-1590867858776-cc6f500a86e0?w=400&h=300&fit=crop",
  },
  {
    name: "Quezon City",
    properties: 1567,
    trend: "+5%",
    image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?w=400&h=300&fit=crop",
  },
];

const PopularLocations = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Popular Locations
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Properties by{" "}
            <span className="text-gradient">Location</span>
          </h2>
          <p className="text-muted-foreground">
            Browse properties in the most sought-after areas across the Philippines.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <div
              key={location.name}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div className="aspect-[4/3] relative">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Location Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-bold text-background">
                      {location.name}
                    </h3>
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-background/80">
                      {location.properties.toLocaleString()} properties
                    </span>
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <TrendingUp className="h-3 w-3" />
                      <span>{location.trend}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="gap-2">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularLocations;
