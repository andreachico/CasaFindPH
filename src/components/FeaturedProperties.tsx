import { useEffect, useState } from "react";
import PropertyCard, { Property } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

interface CmsProperty {
  id: string;
  title: string;
  description: string | null;
  listing_type: "sale" | "rent";
  price: number;
  room_count: number;
  bathroom_count: number;
  parking_count: number;
  property_size: number | null;
  lot_size: number | null;
  image_url: string | null;
  detail_image_url: string | null;
}

const fallbackImages = [
  property1,
  property2,
  property3,
  property4,
  property5,
  property6,
];

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

const API_URL =
  import.meta.env?.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

const mapCmsProperty = (item: CmsProperty, index: number): Property => {
  const imageUrl = item.image_url?.startsWith("http")
    ? item.image_url
    : item.image_url
      ? `${API_URL}${item.image_url.startsWith("/") ? "" : "/"}${item.image_url}`
      : fallbackImages[index % fallbackImages.length];

  return {
    id: String(item.id),
    title: item.title,
    price: Number(item.price ?? 0),
    priceType: item.listing_type,
    location: "Philippines",
    bedrooms: Number(item.room_count ?? 0),
    bathrooms: Number(item.bathroom_count ?? 0),
    area: Number(item.property_size ?? item.lot_size ?? 0),
    image: imageUrl,
    propertyType: item.listing_type === "rent" ? "For Rent" : "For Sale",
    isVerified: true,
    isFeatured: false,
    agent: {
      name: "CasaFind",
      role: "Listing",
    },
  };
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                properties {
                  id
                  title
                  description
                  listingType
                  price
                  roomCount
                  bathroomCount
                  parkingCount
                  propertySize
                  lotSize
                  imageUrl
                  detailImageUrl
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to load properties");
        }

        const json = await response.json();
        const rawProperties = (json?.data?.properties ?? []) as Array<Record<string, unknown>>;

        if (!active) return;

        const formatted = rawProperties.map((item, index) => {
          const mapped: CmsProperty = {
            id: String(item.id ?? ""),
            title: String(item.title ?? "Untitled property"),
            description: (item.description as string | null) ?? null,
            listing_type: (item.listingType as "sale" | "rent") ?? "sale",
            price: Number(item.price ?? 0),
            room_count: Number(item.roomCount ?? 0),
            bathroom_count: Number(item.bathroomCount ?? 0),
            parking_count: Number(item.parkingCount ?? 0),
            property_size:
              item.propertySize === null || item.propertySize === undefined
                ? null
                : Number(item.propertySize),
            lot_size:
              item.lotSize === null || item.lotSize === undefined
                ? null
                : Number(item.lotSize),
            image_url:
              item.imageUrl === null || item.imageUrl === undefined
                ? null
                : String(item.imageUrl),
            detail_image_url:
              item.detailImageUrl === null || item.detailImageUrl === undefined
                ? null
                : String(item.detailImageUrl),
          };

          return mapCmsProperty(mapped, index);
        });

        setProperties(formatted.length > 0 ? formatted : sampleProperties);
      } catch (error) {
        console.error("Failed to load CMS properties", error);
        if (active) {
          setProperties(sampleProperties);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      active = false;
    };
  }, []);

  const handleViewDetails = (id: string) => {
    console.log("Viewing property:", id);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
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

        {loading && (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center text-sm text-muted-foreground">
            Loading properties...
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center text-sm text-muted-foreground">
            No properties are available yet. Add listings in the CMS to populate this section.
          </div>
        )}

        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
