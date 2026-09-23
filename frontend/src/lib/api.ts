import type { Property } from "@/components/PropertyCard";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

// Base URL of the CasaFind FastAPI/GraphQL backend, which serves the property
// data published from CasaFindCMS. Configurable via VITE_API_URL.
export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

// Shape returned by the backend `properties` query (mirrors the CasaFindCMS
// Supabase `properties` table).
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
}

const fallbackImages = [
  property1,
  property2,
  property3,
  property4,
  property5,
  property6,
];

// The CMS does not manage media, location or agents yet (planned follow-up).
// Until then we fill those card fields with sensible placeholders so the
// public site keeps rendering while showing real CMS listing data.
function mapCmsProperty(p: CmsProperty, index: number): Property {
  const area = p.property_size ?? p.lot_size ?? 0;
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    priceType: p.listing_type,
    location: "Philippines",
    bedrooms: p.room_count,
    bathrooms: p.bathroom_count,
    area,
    image: fallbackImages[index % fallbackImages.length],
    propertyType: p.listing_type === "rent" ? "For Rent" : "For Sale",
    isVerified: true,
    isFeatured: false,
    agent: {
      name: "CasaFind",
      role: "Listing",
    },
  };
}

const PROPERTIES_QUERY = `
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
    }
  }
`;

export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: PROPERTIES_QUERY }),
  });

  if (!res.ok) {
    throw new Error(`Failed to load properties (${res.status})`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  // GraphQL returns camelCase keys; normalize back to the snake_case CmsProperty.
  const raw = (json.data?.properties ?? []) as Array<Record<string, unknown>>;
  const properties: CmsProperty[] = raw.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    description: (r.description as string | null) ?? null,
    listing_type: (r.listingType as "sale" | "rent") ?? "sale",
    price: Number(r.price ?? 0),
    room_count: Number(r.roomCount ?? 0),
    bathroom_count: Number(r.bathroomCount ?? 0),
    parking_count: Number(r.parkingCount ?? 0),
    property_size:
      r.propertySize === null || r.propertySize === undefined
        ? null
        : Number(r.propertySize),
    lot_size:
      r.lotSize === null || r.lotSize === undefined ? null : Number(r.lotSize),
  }));

  return properties.map(mapCmsProperty);
}
