import { MapPin, Bed, Bath, Square, Heart, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export interface Property {
  id: string;
  title: string;
  price: number;
  priceType: "sale" | "rent";
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  propertyType: string;
  isVerified: boolean;
  isFeatured?: boolean;
  agent: {
    name: string;
    role: string;
  };
}

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (id: string) => void;
}

const PropertyCard = ({ property, onViewDetails }: PropertyCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₱${(price / 1000000).toFixed(1)}M`;
    }
    return `₱${price.toLocaleString()}`;
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isFeatured && (
            <Badge className="bg-accent text-accent-foreground border-0">
              Featured
            </Badge>
          )}
          {property.isVerified && (
            <Badge variant="secondary" className="gap-1 bg-card/90 backdrop-blur-sm">
              <BadgeCheck className="h-3 w-3 text-primary" />
              Verified
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/90 backdrop-blur-sm shadow-md hover:bg-card transition-all duration-300 hover:scale-110"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isLiked ? "fill-accent text-accent" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(property.price)}
            </span>
            {property.priceType === "rent" && (
              <span className="text-sm text-muted-foreground">/mo</span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Property Type */}
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
          {property.propertyType}
        </p>

        {/* Title */}
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Square className="h-4 w-4" />
            <span>{property.area} sqm</span>
          </div>
        </div>

        {/* Agent & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{property.agent.name}</p>
            <p className="text-xs text-muted-foreground">{property.agent.role}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(property.id)}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
