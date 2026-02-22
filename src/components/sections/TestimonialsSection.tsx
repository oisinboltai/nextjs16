"use client";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

type ServiceType = "all" | "Solar PV" | "HVAC" | "Hybrid" | "Full-Service";

const testimonials = [
  {
    quote:
      "Clear communication from day one. The system was installed on schedule and performs exactly as projected.",
    name: "Michael R.",
    role: "Homeowner",
    project: "Solar PV + Battery",
    serviceType: "Solar PV" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    quote:
      "They handled the entire permit process and delivered a heat pump system that cut our heating costs by 40%.",
    name: "Sarah T.",
    role: "Facility Manager",
    project: "Commercial HVAC Retrofit",
    serviceType: "HVAC" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    quote:
      "Professional, technical, and straightforward. No sales pressure—just a solid proposal and flawless execution.",
    name: "David L.",
    role: "Property Developer",
    project: "Multi-unit Solar Installation",
    serviceType: "Solar PV" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    quote:
      "The ROI on our solar installation exceeded expectations. Energy bills dropped by 60% in the first year.",
    name: "Jennifer K.",
    role: "Business Owner",
    project: "Commercial Solar Array",
    serviceType: "Solar PV" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer",
  },
  {
    quote:
      "Outstanding service from consultation to completion. The hybrid system they designed is incredibly efficient.",
    name: "Robert M.",
    role: "Homeowner",
    project: "Hybrid Solar + HVAC",
    serviceType: "Hybrid" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  },
  {
    quote:
      "The team was incredibly knowledgeable and helped us navigate all the permits and regulations. Couldn't be happier!",
    name: "Lisa P.",
    role: "Homeowner",
    project: "Solar PV System",
    serviceType: "Solar PV" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    quote:
      "Our new HVAC system is whisper-quiet and our energy bills have never been lower. Excellent workmanship throughout.",
    name: "James W.",
    role: "Homeowner",
    project: "HVAC System Upgrade",
    serviceType: "HVAC" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
  {
    quote:
      "From initial assessment to final inspection, EnergyOps managed everything seamlessly. Highly recommend their full-service approach.",
    name: "Patricia H.",
    role: "Property Manager",
    project: "Complete Energy Retrofit",
    serviceType: "Full-Service" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia",
  },
  {
    quote:
      "The hybrid system exceeded all our expectations. We're now energy independent and saving thousands annually.",
    name: "Mark S.",
    role: "Business Owner",
    project: "Hybrid Energy System",
    serviceType: "Hybrid" as ServiceType,
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [filter, setFilter] = useState<ServiceType>("all");

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const filteredTestimonials =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.serviceType === filter);

  const serviceTypes: ServiceType[] = ["all", "Solar PV", "HVAC", "Hybrid", "Full-Service"];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Client Feedback
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Real results from property owners and facility managers.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {serviceTypes.map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFilter(type);
                  setCurrent(0);
                  api?.scrollTo(0);
                }}
                className="capitalize"
              >
                {type === "all" ? "All Reviews" : type}
              </Button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
            key={filter}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {filteredTestimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 flex flex-col"
                  >
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="text-foreground mb-6 leading-relaxed flex-1">
                      "{testimonial.quote}"
                    </p>
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center gap-3 mb-3">
                        <OptimizedImage
                          src={testimonial.avatar}
                          alt={`${testimonial.name}, ${testimonial.role}`}
                          className="w-12 h-12 rounded-full border-2 border-border flex-shrink-0"
                          width={48}
                          height={48}
                          priority={index < 3}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                      <StarRating rating={testimonial.rating} />
                      <div className="text-xs text-primary mt-2 font-medium">
                        {testimonial.project}
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>

          {/* Dots Indicator */}
          {filteredTestimonials.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center",
                    current === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted hover:bg-primary/50"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={current === index ? "step" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

