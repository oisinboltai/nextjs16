"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";
import { useRef } from "react";

const heroImage =
  "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1920&q=80";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

function StatCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref}>
      <span className="text-3xl md:text-4xl font-bold text-primary tabular-nums">
        {isInView ? (
          <CountUp start={0} end={end} duration={duration} prefix={prefix} suffix={suffix} />
        ) : (
          <span className="opacity-0" aria-hidden>{prefix}{end}{suffix}</span>
        )}
      </span>
    </div>
  );
}

export function HeroSection() {
  const scrollToQuote = () => {
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20 overflow-hidden">
      {/* Hero image background with parallax (fixed on desktop for depth) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat max-md:bg-scroll md:bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/85"
        aria-hidden
      />
      {/* Parallax overlay: moves slower than content for depth */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent opacity-80"
        aria-hidden
      />

      {/* Grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      {/* Subtle animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30 animate-particle-float"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10"
          >
            <span className="text-primary text-sm font-medium uppercase tracking-[0.08em] badge-uppercase">
              HVAC & Solar PV Solutions
            </span>
          </motion.div>

          {/* Headline - larger and display font */}
          <motion.h1
            variants={item}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.15] mb-8"
          >
            Lower Energy Costs.
            <br />
            <span className="text-primary">Reliable Systems.</span>
            <br />
            Engineered Performance.
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Professional HVAC and Solar PV installations for residential and
            commercial properties. Precise planning, compliant execution,
            measurable ROI.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={scrollToQuote}
              size="lg"
              className="text-base px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:bg-primary/95 transition-all duration-200"
            >
              Get a Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a
              href="#services"
              className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              View Services →
            </a>
          </motion.div>

          {/* Stats with count-up */}
          <motion.div
            variants={item}
            className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-border/50"
          >
            <div>
              <StatCounter end={500} suffix="+" />
              <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Projects Completed
              </div>
            </div>
            <div>
              <StatCounter end={30} suffix="%" />
              <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Avg. Energy Savings
              </div>
            </div>
            <div>
              <StatCounter end={15} suffix="+" />
              <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Years Experience
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

