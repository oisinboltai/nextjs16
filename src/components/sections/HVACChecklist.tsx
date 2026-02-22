"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/leadService";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ChevronLeft, ChevronRight, Wind, Mail, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: 1, title: "Property", description: "Size & current heating" },
  { id: 2, title: "Goals", description: "What you want to achieve" },
  { id: 3, title: "Results", description: "Recommendation & next steps" },
];

// Rough sizing: BTU/hr ≈ sq ft * 20–30 for heating; we use 25 as baseline and adjust by climate/insulation
const BTU_PER_SQFT = 25;
const SQFT_PER_TON = 400; // 1 ton ≈ 12,000 BTU, so ~400 sq ft per ton in mild climate

const heatingFuelOptions = [
  { value: "gas", label: "Gas boiler" },
  { value: "oil", label: "Oil heating" },
  { value: "electric", label: "Electric (storage/panel)" },
  { value: "none", label: "No system / new build" },
];

const goalOptions = [
  { value: "replace", label: "Replace failing system" },
  { value: "reduce_bills", label: "Lower energy bills" },
  { value: "cooling", label: "Add cooling / AC" },
  { value: "decarbonise", label: "Decarbonise (heat pump priority)" },
];

const schema = z.object({
  sqFootage: z.coerce.number().min(500, "Enter at least 500 sq ft").max(15000, "Max 15,000 sq ft"),
  heatingFuel: z.string().min(1, "Select current heating"),
  goal: z.string().min(1, "Select your main goal"),
  name: z.string().trim().min(2, "Name required").max(100).optional().or(z.literal("")),
  email: z.string().trim().email("Valid email required").max(255).optional().or(z.literal("")),
  phone: z.string().trim().min(6, "Valid phone required").max(20).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export interface HVACRecommendation {
  systemType: "air_source" | "ground_source";
  systemTypeLabel: string;
  sizingKw: number;
  sizingTons: number;
  sizingGuidance: string;
  notes: string[];
}

function getRecommendation(data: FormData): HVACRecommendation {
  const sqFt = data.sqFootage;
  const tons = sqFt / SQFT_PER_TON;
  const sizingTons = Math.max(1.5, Math.min(10, Math.round(tons * 10) / 10));
  const sizingKw = Math.round(sizingTons * 3.52 * 10) / 10; // 1 ton ≈ 3.52 kW

  // Ground source preferred for large homes, decarbonise goal, or no existing fuel; else air source
  const preferGround =
    sqFt > 3000 ||
    data.goal === "decarbonise" ||
    data.heatingFuel === "none";
  const systemType = preferGround ? "ground_source" : "air_source";
  const systemTypeLabel = preferGround ? "Ground source heat pump" : "Air source heat pump";

  const notes: string[] = [];
  if (sqFt > 2500) notes.push("Larger properties may benefit from zoning or multiple units.");
  if (data.goal === "cooling") notes.push("Heat pumps provide both heating and cooling.");
  if (data.heatingFuel === "oil" || data.heatingFuel === "gas")
    notes.push("Replacing fossil fuel heating typically qualifies for grants and incentives.");
  if (systemType === "ground_source")
    notes.push("Ground source has higher upfront cost but lower running costs and longer lifespan.");
  if (notes.length === 0) notes.push("A site survey will confirm the best system and size for your property.");

  return {
    systemType,
    systemTypeLabel,
    sizingKw,
    sizingTons,
    sizingGuidance: `For ~${sqFt.toLocaleString()} sq ft we typically recommend a ${sizingTons}–${sizingTons + 0.5} ton (${sizingKw}–${sizingKw + 1.5} kW) system. Final sizing depends on insulation and heat loss.`,
    notes,
  };
}

export function HVACChecklist({ onGetQuote }: { onGetQuote?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sqFootage: 0,
      heatingFuel: "",
      goal: "",
      name: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  const sqFootage = form.watch("sqFootage");
  const heatingFuel = form.watch("heatingFuel");
  const goal = form.watch("goal");

  const validateStep = async (step: number): Promise<boolean> => {
    if (step === 1) return form.trigger(["sqFootage", "heatingFuel"]);
    if (step === 2) return form.trigger(["goal"]);
    return true;
  };

  const nextStep = async () => {
    const ok = await validateStep(currentStep);
    if (ok) setCurrentStep((p) => Math.min(p + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const recommendation = currentStep === 3 && sqFootage && heatingFuel && goal
    ? getRecommendation(form.getValues())
    : null;

  const onEmailSubmit = async () => {
    const name = form.getValues("name")?.trim();
    const email = form.getValues("email")?.trim();
    const phone = form.getValues("phone")?.trim();
    if (!email || !name || !phone) {
      toast({
        title: "Contact details required",
        description: "Please enter name, email, and phone.",
        variant: "destructive",
      });
      return;
    }
    if (!recommendation) return;
    setIsSubmitting(true);
    const result = await submitLead({
      source: "hvac_checklist",
      data: {
        name,
        email,
        phone,
        sqFootage: form.getValues("sqFootage"),
        heatingFuel: form.getValues("heatingFuel"),
        goal: form.getValues("goal"),
        outputs: {
          systemType: recommendation.systemType,
          systemTypeLabel: recommendation.systemTypeLabel,
          sizingKw: recommendation.sizingKw,
          sizingTons: recommendation.sizingTons,
          sizingGuidance: recommendation.sizingGuidance,
        },
      },
    });
    setIsSubmitting(false);
    if (result.ok) {
      setEmailSent(true);
      toast({ title: "Results sent", description: "We've emailed your HVAC recommendation." });
    } else {
      toast({
        title: "Couldn't send",
        description: result.error ?? "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                </div>
                <div className="mt-2 text-xs text-center">
                  <div
                    className={`font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${currentStep > step.id ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="sqFootage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property size (sq ft)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={500}
                        max={15000}
                        placeholder="e.g. 2000"
                        className="min-h-[44px]"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heatingFuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current heating fuel</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="min-h-[44px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {heatingFuelOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main goal</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="min-h-[44px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {goalOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {currentStep === 3 && recommendation && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Wind className="h-5 w-5 text-primary" />
                  Recommended: {recommendation.systemTypeLabel}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{recommendation.sizingGuidance}</p>
                <dl className="grid gap-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Sizing</dt>
                    <dd className="font-medium text-foreground">
                      ~{recommendation.sizingTons} ton ({recommendation.sizingKw} kW)
                    </dd>
                  </div>
                </dl>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {recommendation.notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {!emailSent ? (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Get your results by email or request a quote</p>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Name" className="min-h-[44px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="email" placeholder="Email" className="min-h-[44px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="tel" placeholder="Phone" className="min-h-[44px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="button"
                      onClick={onEmailSubmit}
                      disabled={isSubmitting}
                      className="gap-2 flex-1"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      Email my results
                    </Button>
                    {onGetQuote && (
                      <Button type="button" variant="outline" className="flex-1" onClick={onGetQuote}>
                        Get a quote
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-primary font-medium">Results sent to your email.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
