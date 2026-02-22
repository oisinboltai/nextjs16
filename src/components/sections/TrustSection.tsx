"use client";
import { Shield, Target, Clock, Award, CheckCircle2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Lightbox } from "@/components/ui/lightbox";

const credentials = [
  {
    icon: Shield,
    title: "Certified & Compliant",
    description:
      "All installations meet or exceed industry standards and local regulatory requirements.",
  },
  {
    icon: Target,
    title: "Precision Engineering",
    description:
      "Data-driven system design with detailed load calculations and performance modeling.",
  },
  {
    icon: Clock,
    title: "Reliable Execution",
    description:
      "On-time delivery with clear milestones and transparent project communication.",
  },
];

const projectImages = [
  {
    url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    title: "Solar Panel Installation",
    description: "Residential rooftop solar array",
  },
  {
    url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
    title: "Commercial Solar Farm",
    description: "Large-scale commercial installation",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    title: "HVAC System Upgrade",
    description: "Modern heat pump installation",
  },
  {
    url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80",
    title: "Hybrid Energy System",
    description: "Integrated solar and HVAC solution",
  },
];

const certifications = [
  { name: "NABCEP Certified", logo: "NABCEP" },
  { name: "EPA Certified", logo: "EPA" },
  { name: "Energy Star Partner", logo: "ENERGY STAR" },
  { name: "BBB A+ Rating", logo: "BBB" },
];

const beforeAfterData = [
  {
    metric: "Energy Costs",
    before: "$450/month",
    after: "$180/month",
    savings: "60% reduction",
  },
  {
    metric: "Carbon Footprint",
    before: "12,000 lbs/year",
    after: "2,400 lbs/year",
    savings: "80% reduction",
  },
  {
    metric: "System Efficiency",
    before: "65%",
    after: "92%",
    savings: "+27% improvement",
  },
];

export function TrustSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="trust" className="py-20 md:py-28 bg-gradient-to-b from-secondary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-primary text-xs font-medium uppercase tracking-[0.08em]">
                About EnergyOps
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Technical Excellence.
              <br />
              Professional Standards.
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              EnergyOps combines deep technical expertise with structured project
              management. We approach every installation as a precision
              engineering challenge—not a sales opportunity. Our methodology
              ensures predictable outcomes and documented performance.
            </p>

            <div className="space-y-6">
              {credentials.map((credential, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <credential.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {credential.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {credential.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Project Gallery Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: false,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {projectImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <button
                      onClick={() => openLightbox(index)}
                      className="relative aspect-square rounded-xl bg-gradient-to-br from-secondary to-card border border-border overflow-hidden group w-full text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      aria-label={`View ${image.title} in lightbox`}
                    >
                      <OptimizedImage
                        src={image.url}
                        alt={`${image.title}: ${image.description}`}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        priority={index < 2}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-card/95 backdrop-blur-sm rounded-lg p-4 border border-border">
                          <div className="text-lg font-bold text-primary mb-1">
                            {image.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {image.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
            <div className="absolute top-6 right-6 bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
              <div className="text-2xl font-bold text-primary">15+ Years</div>
              <div className="text-xs text-muted-foreground">
                Delivering reliable energy solutions
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div ref={ref} className="mb-16">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Certifications & Accreditations
            </h3>
            <p className="text-muted-foreground">
              Recognized by industry leaders for excellence and compliance
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-sm font-semibold text-foreground">
                  {cert.logo}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {cert.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="bg-card border border-border rounded-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Real Results: Before & After
            </h3>
            <p className="text-muted-foreground">
              Average improvements from our installations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {beforeAfterData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-background border border-border rounded-lg p-6"
              >
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {item.metric}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Before:</span>
                    <span className="text-lg font-semibold text-destructive">
                      {item.before}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">After:</span>
                    <span className="text-lg font-semibold text-primary">
                      {item.after}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        {item.savings}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={projectImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}

