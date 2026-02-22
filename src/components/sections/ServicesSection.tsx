"use client";
import { Sun, Wind, Zap, Wrench, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState } from "react";

const services = [
  {
    icon: Sun,
    title: "Solar PV Systems",
    description: "Grid-tied and off-grid solar installations",
    features: [
      "Rooftop & ground-mounted arrays",
      "Battery storage integration",
      "Net metering setup",
      "Performance monitoring",
    ],
    pricing: "Starting at $15,000",
    detailedInfo: {
      overview: "Complete solar photovoltaic system design and installation for residential and commercial properties.",
      benefits: [
        "Reduce electricity bills by up to 90%",
        "25-year warranty on panels",
        "Federal tax credits available",
        "Increase property value",
      ],
      process: [
        "Site assessment and energy audit",
        "Custom system design",
        "Permit acquisition",
        "Professional installation",
        "System commissioning and monitoring setup",
      ],
      relatedServices: ["Battery Storage", "Net Metering", "System Monitoring"],
    },
  },
  {
    icon: Wind,
    title: "HVAC Systems",
    description: "Heat pumps, cooling, and ventilation solutions",
    features: [
      "Air & ground source heat pumps",
      "Central air conditioning",
      "Mechanical ventilation (MVHR)",
      "System retrofits & upgrades",
    ],
    pricing: "Starting at $8,000",
    detailedInfo: {
      overview: "Modern HVAC solutions designed for maximum efficiency and comfort.",
      benefits: [
        "Up to 40% reduction in heating costs",
        "Improved indoor air quality",
        "Quiet operation",
        "Long-term energy savings",
      ],
      process: [
        "Load calculation and system sizing",
        "Equipment selection",
        "Ductwork design (if needed)",
        "Installation and testing",
        "Maintenance plan setup",
      ],
      relatedServices: ["Solar PV Systems", "Hybrid Energy", "Maintenance Plans"],
    },
  },
  {
    icon: Zap,
    title: "Hybrid Energy",
    description: "Integrated solar and HVAC solutions",
    features: [
      "Solar-powered heat pumps",
      "Smart energy management",
      "Load balancing systems",
      "Maximum efficiency design",
    ],
    pricing: "Starting at $25,000",
    detailedInfo: {
      overview: "Integrated systems that combine solar power with efficient HVAC for maximum energy independence.",
      benefits: [
        "Complete energy independence",
        "Optimal efficiency year-round",
        "Smart load management",
        "Maximum ROI",
      ],
      process: [
        "Comprehensive energy assessment",
        "Integrated system design",
        "Coordinated installation",
        "Smart control system setup",
        "Performance optimization",
      ],
      relatedServices: ["Solar PV Systems", "HVAC Systems", "Battery Storage"],
    },
  },
  {
    icon: Wrench,
    title: "Full-Service",
    description: "End-to-end project delivery",
    features: [
      "Site assessment & design",
      "Permit handling",
      "Professional installation",
      "Ongoing maintenance",
    ],
    pricing: "Custom pricing",
    detailedInfo: {
      overview: "Complete project management from initial consultation through ongoing maintenance.",
      benefits: [
        "Single point of contact",
        "Streamlined process",
        "Guaranteed compliance",
        "Peace of mind",
      ],
      process: [
        "Initial consultation",
        "Site assessment",
        "Design and engineering",
        "Permit acquisition",
        "Installation",
        "Commissioning",
        "Ongoing support",
      ],
      relatedServices: ["All Services", "Maintenance Plans", "System Monitoring"],
    },
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

function ServiceCard({ service, index, isInView }: { service: typeof services[0]; index: number; isInView: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group h-full flex flex-col hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
        <CardHeader>
          <motion.div
            className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <service.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary" />
          </motion.div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {service.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
            {service.description}
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-lg font-bold text-primary">{service.pricing}</div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ul className="space-y-2 flex-1">
            {service.features.map((feature, idx) => (
              <motion.li
                key={idx}
                className="text-sm text-muted-foreground flex items-start gap-2 group-hover:text-foreground/90 transition-colors"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="text-primary mt-1.5 group-hover:scale-110 transition-transform inline-block">
                  •
                </span>
                {feature}
              </motion.li>
            ))}
          </ul>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-border overflow-hidden"
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Additional Details:</h4>
                    <p className="text-xs text-muted-foreground">{service.detailedInfo.overview}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Key Benefits:</h4>
                    <ul className="space-y-1">
                      {service.detailedInfo.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  More
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex-1">
                  <Info className="h-4 w-4 mr-1" />
                  Learn More
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <service.icon className="h-5 w-5 text-primary" />
                    {service.title}
                  </DialogTitle>
                  <DialogDescription>{service.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Overview</h3>
                    <p className="text-sm text-muted-foreground">{service.detailedInfo.overview}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Key Benefits</h3>
                    <ul className="space-y-2">
                      {service.detailedInfo.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Our Process</h3>
                    <ol className="space-y-2">
                      {service.detailedInfo.process.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                            {idx + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Related Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.detailedInfo.relatedServices.map((related, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {related}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="text-lg font-bold text-primary mb-1">{service.pricing}</div>
                    <p className="text-xs text-muted-foreground">
                      Pricing varies based on property size and specific requirements. Contact us for a detailed quote.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive energy solutions engineered for performance and reliability.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

