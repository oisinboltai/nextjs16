"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LogisticsSection } from "@/components/sections/LogisticsSection";
import { QuoteFormSection } from "@/components/sections/QuoteFormSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const Index = () => {
  const [showMobileCTA, setShowMobileCTA] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Show mobile CTA after scrolling past hero section
      setShowMobileCTA(scrollY > windowHeight * 0.5);
      // Show scroll to top button after scrolling down
      setShowScrollTop(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToQuote = () => {
    const element = document.getElementById("quote");
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <HeroSection />
        <ProblemSolutionSection />
        <ServicesSection />
        <TrustSection />
        <TestimonialsSection />
        <LogisticsSection />
        <QuoteFormSection />
        <FinalCTASection />
      </main>
      <Footer />

      {/* Sticky Mobile CTA Button */}
      <AnimatePresence>
        {showMobileCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
          >
            <Button
              onClick={scrollToQuote}
              className="w-full shadow-lg"
              size="lg"
            >
              Get a Quote
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 z-40 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;

