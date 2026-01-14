import { useState } from "react";
import { Trash2, Eye, X, Calendar, Tag, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageData } from "./ImageUpload";

interface ImageCardProps {
  image: ImageData;
  onDelete: (id: string) => void;
  index: number;
}

const ImageCard = ({ image, onDelete, index }: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const link = document.createElement("a");
    link.href = image.src;
    link.download = image.name || `image-${image.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div
        className="group relative rounded-xl overflow-hidden bg-card gradient-border animate-fade-in cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={image.src}
            alt={image.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              className="p-2 bg-secondary/80 backdrop-blur-sm rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-secondary/80 backdrop-blur-sm rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
              className="p-2 bg-secondary/80 backdrop-blur-sm rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-mono text-foreground truncate mb-2">
              {image.name}
            </p>
            <div className="flex flex-wrap gap-1">
              {image.keywords.slice(0, 3).map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="text-xs bg-primary/20 text-primary border border-primary/30"
                >
                  {keyword}
                </Badge>
              ))}
              {image.keywords.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  +{image.keywords.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl bg-card border-border p-0 overflow-hidden">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-secondary/80 backdrop-blur-sm rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 bg-secondary/30 flex items-center justify-center p-4 min-h-[300px] md:min-h-[500px]">
              <img
                src={image.src}
                alt={image.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            
            <div className="w-full md:w-72 p-6 space-y-4">
              <h3 className="font-mono font-semibold text-lg text-foreground break-all">
                {image.name}
              </h3>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Tag className="w-4 h-4" />
                  <span>Keywords</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {image.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      className="bg-primary/20 text-primary border border-primary/30"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleDownload}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-mono glow-primary hover:glow-intense transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCard;
