import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, MessageSquare, Star, TrendingUp, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const stats = [
    { icon: Users, label: "Active Users", value: "2,500+" },
    { icon: MessageSquare, label: "Successful Swaps", value: "15,000+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
    { icon: TrendingUp, label: "Skills Available", value: "500+" },
  ];

  const features = [
    {
      icon: Search,
      title: "Find Skills",
      description: "Browse and search for the skills you need from our community of learners and teachers."
    },
    {
      icon: MessageSquare,
      title: "Request Swaps",
      description: "Connect with others and propose skill exchanges that benefit both parties."
    },
    {
      icon: Heart,
      title: "Build Community",
      description: "Create lasting connections while learning and sharing your expertise."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Share Skills,
                <br />
                <span className="text-primary-glow">Build Community</span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Connect with passionate learners and experts. Trade your skills for new ones and grow together in our vibrant community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="lg">
                  <Link to="/browse">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Skills
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link to="/profile">
                    Create Profile
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img 
                src={heroImage} 
                alt="People sharing skills" 
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community and start exchanging skills in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center bg-gradient-card border-0 hover:shadow-hover transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Swapping Skills?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of learners and share your expertise while gaining new skills
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/profile">
                Get Started Today
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;