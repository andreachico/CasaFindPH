import { useState } from "react";
import { Search, MapPin, Home, Building2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  priceRange: string;
  listingType: string;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    priceRange: "",
    listingType: "buy",
  });

  const handleSearch = () => {
    onSearch?.(filters);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Listing Type Tabs */}
      <div className="flex gap-1 mb-4">
        {["buy", "rent"].map((type) => (
          <button
            key={type}
            onClick={() => setFilters({ ...filters, listingType: type })}
            className={`px-6 py-2 rounded-t-lg font-semibold text-sm transition-all duration-300 ${
              filters.listingType === type
                ? "bg-card text-foreground shadow-card"
                : "bg-card/50 text-muted-foreground hover:bg-card/80"
            }`}
          >
            {type === "buy" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="bg-card rounded-2xl shadow-card-hover p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Location (e.g., Makati, BGC)"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="pl-10 h-12 border-border/50 focus:border-primary"
            />
          </div>

          {/* Property Type */}
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Select
              value={filters.propertyType}
              onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
            >
              <SelectTrigger className="pl-10 h-12 border-border/50">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="condo">Condominium</SelectItem>
                <SelectItem value="house">House & Lot</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Select
              value={filters.priceRange}
              onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
            >
              <SelectTrigger className="pl-10 h-12 border-border/50">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2m">Under ₱2M</SelectItem>
                <SelectItem value="2m-5m">₱2M - ₱5M</SelectItem>
                <SelectItem value="5m-10m">₱5M - ₱10M</SelectItem>
                <SelectItem value="10m-20m">₱10M - ₱20M</SelectItem>
                <SelectItem value="20m+">₱20M+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            size="lg"
            className="h-12 gap-2"
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
