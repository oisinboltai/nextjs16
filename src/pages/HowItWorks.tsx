"use client";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { LogisticsSection } from "@/components/sections/LogisticsSection";
import { HVACChecklist } from "@/components/sections/HVACChecklist";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinancingSection } from "@/components/sections/FinancingSection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  const navigate = useNavigate();

  const scrollToQuote = () => {
    navigate("/#quote");
  };

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
        <LogisticsSection />
        <section id="hvac-checklist" className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
                HVAC Sizing Checklist
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Answer a few questions to get a recommended system type and sizing guidance. Not a
                substitute for a proper load calculation—we&apos;ll confirm on site.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <HVACChecklist onGetQuote={scrollToQuote} />
            </div>
          </div>
        </section>
        <FAQSection />
        <FinancingSection />
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

export default HowItWorks;

