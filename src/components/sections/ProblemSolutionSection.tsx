"use client";
import { TrendingDown, Gauge, FileQuestion, CheckCircle, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const problems = [
  {
    icon: TrendingDown,
    title: "Rising Energy Costs",
    description: "Utility bills continue to climb while legacy systems drain your budget month after month.",
    data: {
      averageIncrease: "+12%",
      yearlyCost: "$5,400",
      trend: "upward",
    },
  },
  {
    icon: Gauge,
    title: "Inefficient Systems",
    description: "Outdated HVAC and no renewable integration means wasted energy and poor comfort.",
    data: {
      efficiency: "65%",
      waste: "35%",
      trend: "inefficient",
    },
  },
  {
    icon: FileQuestion,
    title: "Unclear Offers",
    description: "Generic quotes with hidden costs make it impossible to compare options or plan budgets.",
    data: {
      hiddenCosts: "20-30%",
      clarity: "Low",
      trend: "unclear",
    },
  },
];

const solutions = [
  "Detailed system assessments with transparent pricing",
  "Engineered solutions tailored to your property",
  "Clear ROI projections and payback timelines",
  "Full compliance with local regulations and standards",
];

const comparisonData = [
  {
    metric: "Energy Costs",
    before: "$450/month",
    after: "$180/month",
    savings: "$270/month",
    percentage: "60%",
  },
  {
    metric: "System Efficiency",
    before: "65%",
    after: "92%",
    savings: "+27%",
    percentage: "42%",
  },
  {
    metric: "Carbon Footprint",
    before: "12,000 lbs/year",
    after: "2,400 lbs/year",
    savings: "9,600 lbs/year",
    percentage: "80%",
  },
  {
    metric: "Maintenance Costs",
    before: "$1,200/year",
    after: "$400/year",
    savings: "$800/year",
    percentage: "67%",
  },
];

const energySavingsData = [
  { month: "Jan", before: 450, after: 180 },
  { month: "Feb", before: 420, after: 160 },
  { month: "Mar", before: 380, after: 150 },
  { month: "Apr", before: 350, after: 140 },
  { month: "May", before: 320, after: 130 },
  { month: "Jun", before: 400, after: 120 },
];

function AnimatedIcon({ Icon, index, isInView }: { Icon: any; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
      transition={{
        delay: index * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4"
    >
      <motion.div
        animate={isInView ? { rotate: [0, -10, 10, -10, 0] } : {}}
        transition={{
          delay: index * 0.2 + 0.6,
          duration: 0.5,
        }}
      >
        <Icon className="h-6 w-6 text-destructive" />
      </motion.div>
    </motion.div>
  );
}

function EnergyChart({ data }: { data: typeof energySavingsData }) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.before, d.after)));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end gap-1 h-full">
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: `${(item.before / maxValue) * 100}%` } : { height: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="w-full bg-destructive/30 rounded-t"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: `${(item.after / maxValue) * 100}%` } : { height: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                className="w-full bg-primary rounded-t"
              />
            </div>
            <span className="text-xs text-muted-foreground mt-1">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive/30 rounded" />
          <span className="text-muted-foreground">Before</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded" />
          <span className="text-muted-foreground">After</span>
        </div>
      </div>
    </div>
  );
}

export function ProblemSolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const solutionRef = useRef(null);
  const solutionInView = useInView(solutionRef, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/25 to-secondary/10">
      <div className="container mx-auto px-4">
        {/* Problems */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            The Challenge
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Property owners face real obstacles when upgrading energy systems.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-6 mb-20">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <AnimatedIcon Icon={problem.icon} index={index} isInView={isInView} />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {problem.description}
              </p>
              {problem.data && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground space-y-1">
                    {problem.data.averageIncrease && (
                      <div>Average Increase: <span className="text-destructive font-semibold">{problem.data.averageIncrease}</span></div>
                    )}
                    {problem.data.efficiency && (
                      <div>Current Efficiency: <span className="text-destructive font-semibold">{problem.data.efficiency}</span></div>
                    )}
                    {problem.data.hiddenCosts && (
                      <div>Hidden Costs: <span className="text-destructive font-semibold">{problem.data.hiddenCosts}</span></div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Transition Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <ArrowRight className="h-6 w-6 text-primary rotate-90" />
          </motion.div>
        </motion.div>

        {/* Solution */}
        <div ref={solutionRef} className="bg-card border border-border rounded-xl p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="text-primary text-xs font-medium uppercase tracking-[0.08em]">
                  The EnergyOps Approach
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Structured. Engineered. Predictable.
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We replace guesswork with precision. Every project starts with a
                thorough assessment and ends with documented performance—so you
                know exactly what you're getting.
              </p>
            </div>

            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={solutionInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  </motion.div>
                  <span className="text-foreground">{solution}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-card border border-border rounded-xl p-8 md:p-12 mb-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Before & After Comparison
            </h3>
            <p className="text-muted-foreground">
              Real results from typical installations
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold text-destructive">Before</th>
                  <th className="text-right py-3 px-4 font-semibold text-primary">After</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Savings</th>
                  <th className="text-right py-3 px-4 font-semibold text-primary">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={solutionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-foreground">{row.metric}</td>
                    <td className="py-4 px-4 text-right text-destructive">{row.before}</td>
                    <td className="py-4 px-4 text-right text-primary font-semibold">{row.after}</td>
                    <td className="py-4 px-4 text-right text-foreground">{row.savings}</td>
                    <td className="py-4 px-4 text-right text-primary font-semibold">{row.percentage}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Energy Savings Chart */}
        <div className="bg-card border border-border rounded-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Monthly Energy Cost Reduction
            </h3>
            <p className="text-muted-foreground">
              See the difference our solutions make
            </p>
          </div>
          <EnergyChart data={energySavingsData} />
        </div>
      </div>
    </section>
  );
}

