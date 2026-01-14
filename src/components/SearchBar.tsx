import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

const SearchBar = ({ keywords, onKeywordsChange }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");

  const addKeyword = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      onKeywordsChange([...keywords, trimmed]);
      setInputValue("");
    }
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(keywords.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const clearAll = () => {
    onKeywordsChange([]);
    setInputValue("");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a keyword and press Enter..."
            className="h-12 pl-12 pr-4 bg-secondary/50 border-2 border-border focus:border-primary text-foreground font-mono placeholder:text-muted-foreground transition-all duration-300"
          />
        </div>
        <Button
          type="button"
          onClick={addKeyword}
          disabled={!inputValue.trim()}
          className="h-12 px-4 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </Button>
        {keywords.length > 0 && (
          <Button
            type="button"
            onClick={clearAll}
            variant="outline"
            className="h-12 px-4 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Clear
          </Button>
        )}
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground font-mono">
            Searching for ALL:
          </span>
          {keywords.map((keyword) => (
            <Badge
              key={keyword}
              className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 font-mono text-sm"
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
  );
};

export default SearchBar;
