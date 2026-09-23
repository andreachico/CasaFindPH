import { Shield, Clock, Users, Globe, TrendingUp, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is verified by our team to ensure authenticity and accuracy.",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Get instant notifications on new listings matching your preferences.",
  },
  {
    icon: Users,
    title: "Trusted Agents",
    description: "Connect with licensed real estate professionals across the Philippines.",
  },
  {
    icon: Globe,
    title: "OFW Friendly",
    description: "Designed for overseas Filipinos looking to invest back home.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Access property valuations and market trends to make informed decisions.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is available around the clock to assist you.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Why Choose CasaFind
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Smarter Way to Find Your{" "}
            <span className="text-gradient">Dream Property</span>
          </h2>
          <p className="text-muted-foreground">
            We're building the most trusted real estate platform in the Philippines, with features designed for both local and overseas Filipino property seekers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
