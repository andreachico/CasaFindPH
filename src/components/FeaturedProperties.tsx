import { useEffect, useState } from "react";
import PropertyCard, { Property } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555617117-08d6f4b4d9f4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
];

const mapCmsProperty = (item: CmsProperty, index: number): Property => {
  const imageUrl =
    item.image_url || fallbackImages[index % fallbackImages.length];

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(
            "id, title, description, listing_type, price, room_count, bathroom_count, parking_count, property_size, lot_size, image_url, detail_image_url"
          )
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (!active) return;

        const rows = (data ?? []) as CmsProperty[];
        const formatted = rows.map((item, index) =>
          mapCmsProperty(item, index)
        );

        setProperties(formatted);
      } catch (error) {
        console.error("Failed to load properties from Supabase", error);
        if (active) {
          setProperties([]);
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
