import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import type { AuthSession } from "@/lib/auth";
import logo from "@/assets/CasaFindPH-Icon.png";
import fallbackLogo from "@/assets/property-1.jpg";

interface HeaderProps {
  session: AuthSession | null;
  onAuthenticated: (session: AuthSession) => void;
  onSignOut: () => void;
}

const Header = ({ session, onAuthenticated, onSignOut }: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(logo);

  const navLinks = [
    { label: "Buy", href: "/properties?type=buy" },
    { label: "Rent", href: "/properties?type=rent" },
    { label: "Agents", href: "/agents" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="CasaFindPH home">
            <img
              src={logoSrc}
              alt="CasaFindPH logo"
              onError={() => setLogoSrc(fallbackLogo)}
              className="h-12 w-auto md:h-14"
            />
            <span className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              CasaFind<span className="text-primary">PH</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" aria-label="Saved homes">
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={session ? "Profile" : "Sign in"}
              onClick={() => {
                if (!session) {
                  setAuthOpen(true);
                }
              }}
            >
              <User className="h-5 w-5" />
            </Button>
            {session ? (
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5">
                <span className="text-sm font-medium text-foreground">
                  {session.user.firstName}
                </span>
                <Button variant="outline" size="sm" onClick={onSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button className="gap-2" onClick={() => setAuthOpen(true)}>
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 px-4">
                {session ? (
                  <Button variant="outline" className="flex-1 gap-2" onClick={onSignOut}>
                    <User className="h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setAuthOpen(true)}>
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onAuthenticated={(nextSession) => {
          onAuthenticated(nextSession);
          setAuthOpen(false);
          navigate("/account");
        }}
      />
    </header>
  );
};

export default Header;
