"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Gift, Shield, ArrowRight } from "lucide-react";

const scrollToQuote = () => {
  document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
};

export function FinancingSection() {
  return (
    <section id="financing" className="py-20 md:py-28 bg-gradient-to-b from-secondary/15 to-secondary/25">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Financing, Incentives & Warranties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Flexible payment options, tax credits, rebates, and comprehensive coverage on every installation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="financing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-8">
              <TabsTrigger value="financing" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Financing</span>
              </TabsTrigger>
              <TabsTrigger value="incentives" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Gift className="h-4 w-4" />
                <span className="hidden sm:inline">Incentives</span>
              </TabsTrigger>
              <TabsTrigger value="warranties" className="flex items-center gap-2 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Warranties</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="financing" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Flexible Financing Options
                </h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">0% APR options</strong>—qualify for interest-free payment plans
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">No money down</strong>—start saving without a large upfront payment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">Lease vs. purchase</strong>—choose ownership or lower monthly payments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">Payment plans</strong>—terms from 5 to 25 years to fit your budget
                  </li>
                </ul>
                <Button onClick={scrollToQuote} className="gap-2">
                  See if you qualify
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="incentives" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Tax Credits & Rebates
                </h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">Federal ITC (Investment Tax Credit)</strong>—up to 30% off solar installations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">IRA heat pump incentives</strong>—Inflation Reduction Act rebates for HVAC upgrades
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">State & utility rebates</strong>—additional savings vary by region
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">We help you apply</strong>—we identify and guide you through eligible programs
                  </li>
                </ul>
                <Button onClick={scrollToQuote} className="gap-2">
                  Get a quote to see your savings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="warranties" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Comprehensive Warranties
                </h3>
                <ul className="space-y-3 text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">25-year panel warranty</strong>—industry-leading coverage on solar modules
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">Inverter warranty</strong>—typically 10–25 years depending on equipment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">Workmanship warranty</strong>—our installation is backed by a separate guarantee
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <strong className="text-foreground">HVAC manufacturer coverage</strong>—heat pumps and equipment include factory warranties
                  </li>
                </ul>
                <Button onClick={scrollToQuote} className="gap-2">
                  Get a Quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

