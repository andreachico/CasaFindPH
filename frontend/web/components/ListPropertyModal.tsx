"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ListPropertyModalProps {
  open: boolean;
  onClose: () => void;
}

const ListPropertyModal = ({ open, onClose }: ListPropertyModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let photoUrl = "";
    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const uploadRes = await fetch("http://127.0.0.1:8000/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        photoUrl = uploadData.url;
      }
      const token = localStorage.getItem("token") || "";
      const graphqlRes = await fetch("http://127.0.0.1:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation { createProperty(title: "${title}", description: "${description}", price: ${parseFloat(price)}, location: "${location}", photoUrl: "${photoUrl}", token: "${token}") { id title price photoUrl } }`,
        }),
      });
      const graphqlData = await graphqlRes.json();
      if (graphqlData.errors) {
        setError(graphqlData.errors[0].message);
      } else {
        onClose();
      }
    } catch {
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
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded p-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border rounded p-2"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Listing..." : "List Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListPropertyModal;
