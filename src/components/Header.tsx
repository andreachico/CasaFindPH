import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Heart, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import type { AuthSession } from "@/lib/auth";
import logo from "@/assets/CasaFindPH-Icon.png";
import fallbackLogo from "@/assets/property-1.jpg";

const getInitials = (user: AuthSession["user"]) => {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  return (first + last).toUpperCase() || "U";
};

const getRoleLabel = (role: string) => {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return "Admin";
    case "LISTER":
    case "AGENT":
    case "OWNER":
      return "Lister";
    case "SEEKER":
      return "Seeker";
    default:
      return "";
  }
};

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
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Saved homes" className="rounded-full">
              <Heart className="h-5 w-5" />
            </Button>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {getInitials(session.user)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-foreground">
                      {session.user.firstName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-foreground">
                        {session.user.firstName} {session.user.lastName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </p>
                      {getRoleLabel(session.user.role) && (
                        <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
                          {getRoleLabel(session.user.role)}
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")} className="gap-2">
                    <UserCircle className="h-4 w-4" /> My account
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Heart className="h-4 w-4" /> Saved homes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onSignOut}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              {session ? (
                <div className="mt-4 flex flex-col gap-2 px-4">
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {getInitials(session.user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {session.user.firstName} {session.user.lastName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/account"
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" /> My account
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 text-destructive hover:text-destructive"
                    onClick={onSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 mt-4 px-4">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setAuthOpen(true)}>
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              )}
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
