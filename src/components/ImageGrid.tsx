import ImageCard from "./ImageCard";
import { ImageData } from "./ImageUpload";
import { ImageOff } from "lucide-react";

interface ImageGridProps {
  images: ImageData[];
  onDelete: (id: string) => void;
  searchKeywords: string[];
}

const ImageGrid = ({ images, onDelete, searchKeywords }: ImageGridProps) => {
  // Filter images based on search keywords - must match ALL keywords
  const filteredImages = images.filter((image) => {
    if (searchKeywords.length === 0) return true;
    
    // Check if ALL search keywords match at least one image keyword
    return searchKeywords.every((searchTerm) =>
      image.keywords.some((keyword) => keyword.includes(searchTerm))
    );
  });

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ImageOff className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-mono text-foreground mb-2">
          No images yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Upload your first image to start building your vault
        </p>
      </div>
    );
  }

  if (filteredImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ImageOff className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-mono text-foreground mb-2">
          No matches found
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Try different keywords or clear the search
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredImages.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
