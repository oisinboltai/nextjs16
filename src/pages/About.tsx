"use client";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { TrustSection } from "@/components/sections/TrustSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <TrustSection />
        <TestimonialsSection />
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready for a quote?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Tell us about your home and we&apos;ll provide a tailored estimate.
            </p>
            <Button asChild size="lg">
              <Link to="/#quote">Get a Quote</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

