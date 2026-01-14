import { useState, useRef } from "react";
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export interface ImageData {
  id: string;
  src: string;
  keywords: string[];
  name: string;
  uploadedAt: Date;
}

interface ImageUploadProps {
  onUpload: (image: ImageData) => void;
}

const ImageUpload = ({ onUpload }: ImageUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const addKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleUpload = () => {
    if (preview && keywords.length > 0) {
      const newImage: ImageData = {
        id: crypto.randomUUID(),
        src: preview,
        keywords,
        name: fileName,
        uploadedAt: new Date(),
      };
      onUpload(newImage);
      resetForm();
      setIsOpen(false);
    }
  };

  const resetForm = () => {
    setPreview(null);
    setFileName("");
    setKeywords([]);
    setKeywordInput("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold glow-primary hover:glow-intense transition-all duration-300">
          <Upload className="w-5 h-5 mr-2" />
          UPLOAD IMAGE
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-foreground">
            Upload New Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/10"
                : preview
                ? "border-primary/50"
                : "border-border hover:border-primary/50 hover:bg-secondary/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              className="hidden"
            />
            
            {preview ? (
              <div className="relative w-full h-full p-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    setFileName("");
                  }}
                  className="absolute top-4 right-4 p-1 bg-destructive rounded-full hover:bg-destructive/80 transition-colors"
                >
                  <X className="w-4 h-4 text-destructive-foreground" />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">
                  Drop an image or click to browse
                </p>
              </>
            )}
          </div>

          {/* Keywords Input */}
          <div className="space-y-3">
            <label className="text-sm font-mono text-muted-foreground">
              Keywords (for search)
            </label>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add keyword..."
                className="flex-1 bg-secondary/50 border-border"
              />
              <Button
                type="button"
                onClick={addKeyword}
                variant="outline"
                size="icon"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 font-mono"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!preview || keywords.length === 0}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-mono font-semibold disabled:opacity-50 disabled:cursor-not-allowed glow-primary hover:glow-intense transition-all duration-300"
          >
            <Upload className="w-5 h-5 mr-2" />
            ADD TO VAULT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUpload;
