"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Solar vs heat pumps—which is right for me?",
    answer:
      "It depends on your goals. Solar PV is ideal if you want to slash electricity bills and have good sun exposure. Heat pumps are best for reducing heating/cooling costs and improving comfort year-round. Many homeowners choose both for a hybrid energy system that maximizes savings. We can assess your property and recommend the best approach during a free consultation.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Timelines vary by project. A typical residential solar installation takes 1–3 days once permits are approved; permit acquisition usually adds 2–6 weeks. Heat pump installations can often be completed in 1–2 days. Hybrid or full-service projects may take 1–2 weeks. We provide a detailed timeline during your quote.",
  },
  {
    question: "What maintenance is required for solar and HVAC systems?",
    answer:
      "Solar panels need minimal maintenance—occasional cleaning if they get dusty, and an annual visual check. Most systems run 25+ years with little intervention. Heat pumps benefit from annual servicing to maintain efficiency. We offer maintenance plans to keep your systems performing at their best.",
  },
  {
    question: "Are there incentives or tax credits available?",
    answer:
      "Yes. The federal Investment Tax Credit (ITC) offers up to 30% off solar installations. The Inflation Reduction Act (IRA) also provides heat pump incentives and rebates. Many states and utilities offer additional rebates. We help you identify and apply for all eligible incentives to reduce your upfront cost.",
  },
  {
    question: "Can I finance the project with no money down?",
    answer:
      "Many of our customers use financing with no money down. We work with financing partners that offer 0% APR options and flexible payment plans. Lease vs. purchase options are also available. See our Financing section for details, or get a quote to see if you qualify.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Common questions about solar, heat pumps, incentives, and our process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-4 bg-card data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

