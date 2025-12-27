import PropertyCard, { Property } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Modern Condo with Ocean View",
    price: 8500000,
    priceType: "sale",
    location: "Makati City, Metro Manila",
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    image: property1,
    propertyType: "Condominium",
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "Maria Santos",
      role: "Licensed Agent",
    },
  },
  {
    id: "2",
    title: "Spacious Family Home with Garden",
    price: 25000000,
    priceType: "sale",
    location: "Alabang, Muntinlupa",
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    image: property2,
    propertyType: "House & Lot",
    isVerified: true,
    isFeatured: false,
    agent: {
      name: "Juan dela Cruz",
      role: "Property Owner",
    },
  },
  {
    id: "3",
    title: "Luxury Penthouse in BGC",
    price: 45000000,
    priceType: "sale",
    location: "Bonifacio Global City, Taguig",
    bedrooms: 3,
    bathrooms: 3,
    area: 200,
    image: property3,
    propertyType: "Penthouse",
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "Angela Reyes",
      role: "Broker",
    },
  },
  {
    id: "4",
    title: "Cozy Studio near MRT",
    price: 25000,
    priceType: "rent",
    location: "Ortigas Center, Pasig",
    bedrooms: 1,
    bathrooms: 1,
    area: 32,
    image: property4,
    propertyType: "Studio",
    isVerified: true,
    isFeatured: false,
    agent: {
      name: "Paolo Garcia",
      role: "Licensed Agent",
    },
  },
  {
    id: "5",
    title: "Modern Townhouse in Gated Village",
    price: 15000000,
    priceType: "sale",
    location: "Las Piñas City",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: property5,
    propertyType: "Townhouse",
    isVerified: true,
    isFeatured: false,
    agent: {
      name: "Rica Fernandez",
      role: "Property Owner",
    },
  },
  {
    id: "6",
    title: "Prime Office Space in Makati CBD",
    price: 150000,
    priceType: "rent",
    location: "Ayala Avenue, Makati City",
    bedrooms: 0,
    bathrooms: 2,
    area: 500,
    image: property6,
    propertyType: "Commercial",
    isVerified: true,
    isFeatured: true,
    agent: {
      name: "David Lim",
      role: "Commercial Broker",
    },
  },
];

const FeaturedProperties = () => {
  const handleViewDetails = (id: string) => {
    console.log("Viewing property:", id);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Featured Properties
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Discover Your Next{" "}
              <span className="text-gradient">Dream Home</span>
            </h2>
          </div>
          <Button variant="outline" className="gap-2 self-start md:self-auto">
            View All Properties
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PropertyCard
                property={property}
                onViewDetails={handleViewDetails}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
