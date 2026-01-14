import { useState, useEffect } from "react";
import PasswordGate from "@/components/PasswordGate";
import ImageUpload, { ImageData } from "@/components/ImageUpload";
import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import { LogOut, Database, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "vault_images";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);

  // Check authentication on mount
  useEffect(() => {
    const auth = sessionStorage.getItem("vault_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load images from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setImages(parsed);
        } catch (e) {
          console.error("Failed to parse stored images");
        }
      }
    }
  }, [isAuthenticated]);

  // Save images to localStorage
  useEffect(() => {
    if (isAuthenticated && images.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    }
  }, [images, isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem("vault_authenticated");
    setIsAuthenticated(false);
  };

  const handleUpload = (newImage: ImageData) => {
    setImages((prev) => [newImage, ...prev]);
  };

  const handleDelete = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-mono font-bold text-foreground">
              BASE D'EXERCICE
            </h1>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats & Actions Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Image className="w-5 h-5" />
              <span className="font-mono">
                <span className="text-primary font-bold">{images.length}</span> images
              </span>
            </div>
          </div>
          
          <ImageUpload onUpload={handleUpload} />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar keywords={searchKeywords} onKeywordsChange={setSearchKeywords} />
        </div>

        {/* Image Grid */}
        <ImageGrid
          images={images}
          onDelete={handleDelete}
          searchKeywords={searchKeywords}
        />
      </main>
    </div>
  );
};

export default Index;
