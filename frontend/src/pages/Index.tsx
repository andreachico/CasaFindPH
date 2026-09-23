import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FeaturedProperties from "@/components/FeaturedProperties";
import WhyChooseUs from "@/components/WhyChooseUs";
import PopularLocations from "@/components/PopularLocations";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>CasaFind.ph - Find Your Dream Home in the Philippines</title>
        <meta
          name="description"
          content="Discover verified properties for sale and rent across the Philippines. CasaFind.ph connects property seekers with trusted sellers and agents. Find condos, houses, and commercial spaces today."
        />
        <meta name="keywords" content="Philippines real estate, property for sale Philippines, condo Manila, house and lot, rent apartment, OFW property investment" />
        <link rel="canonical" href="https://casafind.ph" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroBg}
              alt="Modern Philippine cityscape with condominiums"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/10 backdrop-blur-sm rounded-full border border-card/20 mb-8 animate-fade-in">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-card">
                  The Philippines' Trusted Property Marketplace
                </span>
              </div>

              {/* Heading */}
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-card mb-6 animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                Find Your Perfect
                <br />
                <span className="text-gradient-accent">Home in Paradise</span>
              </h1>

              {/* Subheading */}
              <p 
                className="text-lg md:text-xl text-card/80 max-w-2xl mx-auto mb-12 animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                Explore thousands of verified properties across the Philippines. 
                Whether you're buying, renting, or investing — we make finding your dream home simple and trustworthy.
              </p>
            </div>

            {/* Search Bar */}
            <div 
              className="animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <SearchBar />
            </div>

            {/* Quick Stats */}
            <div 
              className="flex flex-wrap justify-center gap-8 mt-12 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              {[
                { value: "50K+", label: "Properties" },
                { value: "5K+", label: "Verified Agents" },
                { value: "77", label: "Provinces" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-card">
                    {stat.value}
                  </p>
                  <p className="text-sm text-card/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 border-2 border-card/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-card/50 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <FeaturedProperties />

        {/* Popular Locations */}
        <PopularLocations />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Index;
