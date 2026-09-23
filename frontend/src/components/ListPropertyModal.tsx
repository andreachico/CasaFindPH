import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";

interface ListPropertyModalProps {
  open: boolean;
  onClose: () => void;
}

const ListPropertyModal = ({ open, onClose }: ListPropertyModalProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [roomCount, setRoomCount] = useState("0");
  const [bathroomCount, setBathroomCount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const graphqlRes = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation CreateProperty($title: String!, $description: String, $listingType: String!, $price: Float!, $roomCount: Int!, $bathroomCount: Int!) {
            createProperty(title: $title, description: $description, listingType: $listingType, price: $price, roomCount: $roomCount, bathroomCount: $bathroomCount) {
              id
              title
              price
            }
          }`,
          variables: {
            title,
            description,
            listingType,
            price: parseFloat(price) || 0,
            roomCount: parseInt(roomCount, 10) || 0,
            bathroomCount: parseInt(bathroomCount, 10) || 0,
          },
        }),
      });
      const graphqlData = await graphqlRes.json();
      if (graphqlData.errors) {
        setError(graphqlData.errors[0].message);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["properties"] });
        onClose();
      }
    } catch (err) {
      setError("Failed to list property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 min-h-screen overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto flex flex-col max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">List Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
          <select
            value={listingType}
            onChange={e => setListingType(e.target.value as "sale" | "rent")}
            className="w-full border rounded p-2"
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Rooms"
              value={roomCount}
              onChange={e => setRoomCount(e.target.value)}
              className="w-full border rounded p-2"
            />
            <input
              type="number"
              placeholder="Bathrooms"
              value={bathroomCount}
              onChange={e => setBathroomCount(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Listing..." : "List Property"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListPropertyModal;
