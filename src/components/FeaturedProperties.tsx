import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard, { Property } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CmsProperty,
  PROPERTY_SELECT,
  mapCmsProperty,
} from "@/lib/properties";

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProperties = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(PROPERTY_SELECT)
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
    navigate(`/property/${id}`);
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
                className="animate-fade-in-up h-full"
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
