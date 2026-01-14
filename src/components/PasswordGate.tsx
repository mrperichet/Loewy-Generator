import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordGateProps {
  onAuthenticate: () => void;
}

const SITE_PASSWORD = "Loewy";

const PasswordGate = ({ onAuthenticate }: PasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem("vault_authenticated", "true");
      onAuthenticate();
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-grid relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      
      <div 
        className={`relative z-10 w-full max-w-md p-8 gradient-border rounded-2xl bg-card/80 backdrop-blur-xl animate-fade-in ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
        style={{
          animation: isShaking ? 'shake 0.5s ease-in-out' : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}</style>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 glow-primary animate-pulse-glow">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-mono font-bold text-foreground text-glow">
            BASE D'EXERCICE
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter password to access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password..."
              className={`h-14 pl-4 pr-12 bg-secondary/50 border-2 text-lg font-mono tracking-wider transition-all duration-300 ${
                error 
                  ? 'border-destructive focus:ring-destructive' 
                  : 'border-border focus:border-primary focus:ring-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">
              Access denied. Invalid password.
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-14 text-lg font-mono font-semibold bg-primary hover:bg-primary/90 text-primary-foreground glow-primary hover:glow-intense transition-all duration-300"
          >
            <ShieldCheck className="w-5 h-5 mr-2" />
            UNLOCK VAULT
          </Button>
        </form>

      </div>
    </div>
  );
};

export default PasswordGate;
