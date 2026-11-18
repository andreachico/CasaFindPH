import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  MapPin,
  BadgeCheck,
  Bed,
  Bath,
  Square,
  LandPlot,
  Car,
  Sofa,
  CalendarDays,
  Ruler,
  MessageCircle,
  CalendarCheck,
  User,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard, { Property } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  CmsProperty,
  PROPERTY_SELECT,
  fallbackImages,
  mapCmsProperty,
} from "@/lib/properties";

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `₱${(price / 1000000).toFixed(1)}M`;
  }
  return `₱${price.toLocaleString()}`;
};

const formatPricePerSqm = (price: number, size: number | null) => {
  if (!size || size <= 0) {
    return "—";
  }
  return `₱${Math.round(price / size).toLocaleString()}`;
};

const formatRelativeDate = (dateStr: string | null) => {
  if (!dateStr) {
    return "Recently listed";
  }
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return "Recently listed";
  }
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Listed today";
  }
  if (diffDays === 1) {
    return "Listed 1 day ago";
  }
  if (diffDays < 30) {
    return `Listed ${diffDays} days ago`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) {
    return "Listed 1 month ago";
  }
  if (diffMonths < 12) {
    return `Listed ${diffMonths} months ago`;
  }
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "Listed 1 year ago" : `Listed ${diffYears} years ago`;
};

const ComingSoon = () => (
  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
    Coming soon
  </span>
);

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<CmsProperty | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;
    window.scrollTo(0, 0);
    setLoading(true);
    setNotFound(false);

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(PROPERTY_SELECT)
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (!active) return;

        if (!data) {
          setNotFound(true);
          setProperty(null);
        } else {
          setProperty(data as CmsProperty);
        }
      } catch (error) {
        console.error("Failed to load property from Supabase", error);
        if (active) {
          setNotFound(true);
          setProperty(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const loadSimilar = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select(PROPERTY_SELECT)
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        if (!active) return;

        const rows = (data ?? []) as CmsProperty[];
        setSimilar(rows.map((item, index) => mapCmsProperty(item, index)));
      } catch (error) {
        console.error("Failed to load similar properties", error);
        if (active) {
          setSimilar([]);
        }
      }
    };

    load();
    loadSimilar();

    return () => {
      active = false;
    };
  }, [id]);

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    fallbackIndex: number
  ) => {
    const target = event.currentTarget;
    const fallback = fallbackImages[fallbackIndex % fallbackImages.length];
    if (target.src !== fallback) {
      target.src = fallback;
    }
  };

  const renderShell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-background flex flex-col">
      <Header session={null} onAuthenticated={() => {}} onSignOut={() => {}} />
      <main className="flex-1 pt-24 pb-16">{children}</main>
      <Footer />
    </div>
  );

  if (loading) {
    return renderShell(
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-10 text-center text-sm text-muted-foreground">
          Loading property...
        </div>
      </div>
    );
  }

  if (notFound || !property) {
    return renderShell(
      <div className="container mx-auto px-4">
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Property not found
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            The property you are looking for doesn&apos;t exist or may have been
            removed.
          </p>
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isRent = property.listing_type === "rent";
  const price = Number(property.price ?? 0);
  const mainImage = property.image_url || fallbackImages[0];
  const galleryImages = [
    property.detail_image_url || fallbackImages[1],
    fallbackImages[2],
    fallbackImages[3],
    fallbackImages[4],
  ];

  const stats = [
    {
      icon: Bed,
      label: "Bedrooms",
      value: String(Number(property.room_count ?? 0)),
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: String(Number(property.bathroom_count ?? 0)),
    },
    {
      icon: Square,
      label: "Floor area",
      value: property.property_size
        ? `${Number(property.property_size)} sqm`
        : "—",
    },
    {
      icon: LandPlot,
      label: "Lot area",
      value: property.lot_size ? `${Number(property.lot_size)} sqm` : "—",
    },
    {
      icon: Car,
      label: "Parking",
      value: String(Number(property.parking_count ?? 0)),
    },
    {
      icon: Ruler,
      label: "Price / sqm",
      value: formatPricePerSqm(price, property.property_size),
    },
    {
      icon: Sofa,
      label: "Furnishing",
      value: "—",
      comingSoon: true,
    },
    {
      icon: CalendarDays,
      label: "Year built",
      value: "—",
      comingSoon: true,
    },
  ];

  return renderShell(
    <div className="container mx-auto px-4">
      <Helmet>
        <title>
          {property
            ? `${property.title} | CasaFindPH`
            : "Property | CasaFindPH"}
        </title>
      </Helmet>
      {/* Breadcrumb / back row */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 self-start px-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Button>
        <p className="text-xs text-muted-foreground">
          {isRent ? "Rent" : "Buy"} / Properties /{" "}
          <span className="text-foreground">{property.title}</span>
        </p>
      </div>

      {/* Photo gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src={mainImage}
            alt={property.title}
            onError={(event) => handleImageError(event, 0)}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {galleryImages.map((src, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img
                src={src}
                alt={`${property.title} photo ${index + 2}`}
                onError={(event) => handleImageError(event, index + 1)}
                className="h-full w-full object-cover"
              />
              {index === galleryImages.length - 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-card/90 backdrop-blur-sm"
                    disabled
                  >
                    View all photos
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header block */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-primary text-primary-foreground border-0">
                {isRent ? "FOR RENT" : "FOR SALE"}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <BadgeCheck className="h-3 w-3 text-primary" />
                Verified
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeDate(property.created_at)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Philippines</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="rounded-2xl border-border bg-card p-4 flex flex-col gap-1"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  {stat.comingSoon && <ComingSoon />}
                </Card>
              );
            })}
          </div>

          {/* About this property */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              About this property
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {property.description || "No description provided."}
            </p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Amenities</h2>
            <div className="rounded-2xl border border-dashed border-border bg-card/30 p-6 text-center text-sm text-muted-foreground">
              Amenities coming soon
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Location</h2>
            <div className="rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center text-sm text-muted-foreground">
              Map coming soon
            </div>
          </section>

          {/* Nearby places */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">
              Nearby places
            </h2>
            <div className="rounded-2xl border border-dashed border-border bg-card/30 p-6 text-center text-sm text-muted-foreground">
              Coming soon
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="rounded-2xl border-border bg-card p-6 lg:sticky lg:top-24 space-y-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Asking price
              </p>
              <p className="text-3xl font-bold text-foreground">
                {formatPrice(price)}
                {isRent && (
                  <span className="text-base font-medium text-muted-foreground">
                    /mo
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPricePerSqm(price, property.property_size)} / sqm
              </p>
            </div>

            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    CasaFind Listings
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified listing
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Agent details coming soon
              </p>
            </div>

            <div className="space-y-3">
              <Button className="w-full gap-2" disabled>
                <CalendarCheck className="h-4 w-4" />
                Schedule a viewing
              </Button>
              <Button variant="outline" className="w-full gap-2" disabled>
                <MessageCircle className="h-4 w-4" />
                Message on WhatsApp
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Similar properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similar.map((item) => (
              <div key={item.id} className="h-full">
                <PropertyCard
                  property={item}
                  onViewDetails={(pid) => navigate(`/property/${pid}`)}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PropertyDetail;
