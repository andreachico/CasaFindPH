import type { Property } from "@/components/PropertyCard";

export interface CmsProperty {
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
  created_at: string | null;
}

export const fallbackImages: string[] = [
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

export const PROPERTY_SELECT =
  "id, title, description, listing_type, price, room_count, bathroom_count, parking_count, property_size, lot_size, image_url, detail_image_url, created_at";

export const mapCmsProperty = (item: CmsProperty, index: number): Property => {
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
