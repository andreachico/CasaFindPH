import { Link } from "react-router-dom";
import { Menu, X, User, Heart, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "@/assets/CasaFind_official_logo.png";
import ListPropertyModal from "./ListPropertyModal";
import AuthModal, { AuthUser } from "./AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    return token && userData ? JSON.parse(userData) : null;
  });

  // Update user state and localStorage after login/register
  const handleAuth = (userObj: AuthUser, token: string) => {
    setUser(userObj);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Navigation links
  const navLinks = [
    { label: "Buy", href: "/properties?type=buy" },
    { label: "Rent", href: "/properties?type=rent" },
    { label: "Agents", href: "/agents" },
    { label: "About", href: "/about" },
  ];

  // Show List Property button only for AGENT or OWNER
  const canListProperty = user && ["AGENT", "OWNER"].includes(user.role);

  return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img
                  src={logo}
                  alt="CasaFind"
                  className="h-12 md:h-14 lg:h-16 w-auto"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-foreground">Casa</span>
                <span className="text-xl font-bold text-primary">Find</span>
                <span className="text-sm text-muted-foreground">.ph</span>
              </div>
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
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              {user ? (
                  <>
                    <span className="text-sm font-medium text-foreground">
                      Hi, {user.firstName}
                    </span>
                    <Button variant="outline" className="gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
              ) : (
                  <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setShowAuthModal(true)}
                  >
                    <User className="h-5 w-5" />
                    Sign In
                  </Button>
              )}

              {/* List Property button for AGENT/OWNER */}
              {canListProperty && (
                  <Button className="gap-2" onClick={() => setShowListModal(true)}>
                    <Plus className="h-4 w-4" />
                    List Property
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
                  <div className="flex flex-col gap-2 mt-4 px-4">
                    {user ? (
                        <>
                          <span className="text-sm font-medium text-foreground mb-1">
                            Hi, {user.firstName}
                          </span>
                          <Button
                              variant="outline"
                              className="flex-1 gap-2"
                              onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                              }}
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => {
                              setShowAuthModal(true);
                              setIsMenuOpen(false);
                            }}
                        >
                          <User className="h-4 w-4" />
                          Sign In
                        </Button>
                    )}
                    {canListProperty && (
                        <Button
                            className="flex-1 gap-2"
                            onClick={() => {
                              setShowListModal(true);
                              setIsMenuOpen(false);
                            }}
                        >
                          <Plus className="h-4 w-4" />
                          List Property
                        </Button>
                    )}
                  </div>
                </nav>
              </div>
          )}

          {/* Modals */}
          {showListModal && (
              <ListPropertyModal
                  open={showListModal}
                  onClose={() => setShowListModal(false)}
              />
          )}
          {showAuthModal && (
              <AuthModal
                  open={showAuthModal}
                  onClose={() => setShowAuthModal(false)}
                  onAuth={handleAuth}
              />
          )}
        </div>
      </header>
  );
};

export default Header;