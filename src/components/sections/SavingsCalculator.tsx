"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calculator, Mail, Loader2, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Assumptions for estimation (Ireland/UK typical)
const AVG_PRICE_PER_KWH = 0.28; // €/kWh
const HOURS_FULL_SUN_EQUIVALENT = 900; // annual full-sun equivalent hours (e.g. Ireland)
const COST_PER_KW_MIN = 1500;
const COST_PER_KW_MAX = 2500;
const ITC_OR_GRANT_FACTOR = 0.7; // assume ~30% back from incentives for payback

const propertyTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
];

const roofOrientations = [
  { value: "south", label: "South (optimal)", factor: 1 },
  { value: "sw_se", label: "South-west / South-east", factor: 0.92 },
  { value: "east_west", label: "East or West", factor: 0.82 },
  { value: "north", label: "North (not recommended)", factor: 0.6 },
];

const shadeOptions = [
  { value: "none", label: "Little or no shade", factor: 1 },
  { value: "some", label: "Some shade (trees, chimneys)", factor: 0.85 },
  { value: "heavy", label: "Heavy shade", factor: 0.65 },
];

const inputSchema = z
  .object({
    inputMode: z.enum(["bill", "kwh"]),
    monthlyBill: z.coerce.number().min(0).optional(),
    monthlyKwh: z.coerce.number().min(0).optional(),
    propertyType: z.string().min(1, "Select property type"),
    roofOrientation: z.string().min(1, "Select roof orientation"),
    shade: z.string().min(1, "Select shade level"),
  })
  .superRefine((data, ctx) => {
    if (data.inputMode === "bill" && (!data.monthlyBill || data.monthlyBill <= 0)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter your monthly bill", path: ["monthlyBill"] });
    }
    if (data.inputMode === "kwh" && (!data.monthlyKwh || data.monthlyKwh <= 0)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter monthly kWh", path: ["monthlyKwh"] });
    }
  });

const emailSchema = z.object({
  name: z.string().trim().min(2, "Name required").max(100, "Name too long"),
  email: z.string().trim().email("Valid email required").max(255, "Email too long"),
  phone: z.string().trim().min(6, "Valid phone required").max(20, "Phone too long"),
});

type InputFormData = z.infer<typeof inputSchema>;
type EmailFormData = z.infer<typeof emailSchema>;

export interface SavingsEstimate {
  annualKwh: number;
  systemSizeKw: number;
  costMin: number;
  costMax: number;
  annualSavings: number;
  paybackYears: number;
}

function computeEstimate(data: InputFormData): SavingsEstimate | null {
  const orientation = roofOrientations.find((r) => r.value === data.roofOrientation);
  const shade = shadeOptions.find((s) => s.value === data.shade);
  if (!orientation || !shade) return null;

  let annualKwh: number;
  if (data.inputMode === "bill" && data.monthlyBill != null && data.monthlyBill > 0) {
    const monthlyKwhFromBill = data.monthlyBill / AVG_PRICE_PER_KWH;
    annualKwh = monthlyKwhFromBill * 12;
  } else if (data.inputMode === "kwh" && data.monthlyKwh != null && data.monthlyKwh > 0) {
    annualKwh = data.monthlyKwh * 12;
  } else {
    return null;
  }

  const productionFactor = orientation.factor * shade.factor;
  const effectiveSunHours = HOURS_FULL_SUN_EQUIVALENT * productionFactor;
  const systemSizeKw = annualKwh / effectiveSunHours;
  const clampedKw = Math.max(1, Math.min(50, systemSizeKw)); // 1–50 kW range
  const costMin = Math.round(clampedKw * COST_PER_KW_MIN);
  const costMax = Math.round(clampedKw * COST_PER_KW_MAX);
  const annualSavings = Math.round(annualKwh * AVG_PRICE_PER_KWH * productionFactor);
  const netCost = (costMin + costMax) / 2 * ITC_OR_GRANT_FACTOR;
  const paybackYears = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : 0;

  return {
    annualKwh: Math.round(annualKwh),
    systemSizeKw: Math.round(clampedKw * 10) / 10,
    costMin,
    costMax,
    annualSavings,
    paybackYears,
  };
}

export function SavingsCalculator() {
  const [estimate, setEstimate] = useState<SavingsEstimate | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const inputForm = useForm<InputFormData>({
    resolver: zodResolver(inputSchema) as any,
    defaultValues: {
      inputMode: "bill",
      monthlyBill: undefined,
      monthlyKwh: undefined,
      propertyType: "",
      roofOrientation: "",
      shade: "",
    },
    mode: "onChange",
  });

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { name: "", email: "", phone: "" },
    mode: "onChange",
  });

  const inputMode = inputForm.watch("inputMode");
  const inputValues = inputForm.watch();

  const currentEstimate = useMemo(
    () => computeEstimate(inputValues),
    [
      inputValues.inputMode,
      inputValues.monthlyBill,
      inputValues.monthlyKwh,
      inputValues.propertyType,
      inputValues.roofOrientation,
      inputValues.shade,
    ]
  );

  const onCalculate = () => {
    inputForm.handleSubmit((data) => {
      const result = computeEstimate(data as InputFormData);
      setEstimate(result ?? null);
      setShowEmailForm(!!result);
      if (!result) {
        toast({
          title: "Enter your details",
          description: "Please fill in monthly bill or kWh and property options.",
          variant: "destructive",
        });
      }
    })();
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    if (!estimate) return;
    setIsSubmitting(true);
    const result = await submitLead({
      source: "savings_calculator",
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        outputs: {
          systemSizeKw: estimate.systemSizeKw,
          costRange: { min: estimate.costMin, max: estimate.costMax },
          annualSavings: estimate.annualSavings,
          paybackYears: estimate.paybackYears,
          annualKwh: estimate.annualKwh,
        },
      },
    });
    setIsSubmitting(false);
    if (result.ok) {
      setEmailSent(true);
      toast({ title: "Estimate sent", description: "We've emailed your savings estimate." });
    } else {
      toast({
        title: "Couldn't send",
        description: result.error ?? "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const displayEstimate = estimate ?? currentEstimate;

  return (
    <section id="savings-calculator" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Solar Savings Calculator
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get a quick estimate of system size, cost range, and payback. Results are illustrative—we'll refine with a site survey.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            <Form {...inputForm}>
              <form className="space-y-6">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="bill"
                      checked={inputMode === "bill"}
                      onChange={() => inputForm.setValue("inputMode", "bill")}
                      className="rounded-full border-primary text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">Monthly bill (€)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="kwh"
                      checked={inputMode === "kwh"}
                      onChange={() => inputForm.setValue("inputMode", "kwh")}
                      className="rounded-full border-primary text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">Monthly kWh</span>
                  </label>
                </div>

                <AnimatePresence mode="wait">
                  {inputMode === "bill" ? (
                    <motion.div
                      key="bill"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      <FormField
                        control={inputForm.control}
                        name="monthlyBill"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average monthly electricity bill (€)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={10}
                                placeholder="e.g. 150"
                                className="min-h-[44px]"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="kwh"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      <FormField
                        control={inputForm.control}
                        name="monthlyKwh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average monthly usage (kWh)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                step={50}
                                placeholder="e.g. 400"
                                className="min-h-[44px]"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <FormField
                  control={inputForm.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyTypes.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={inputForm.control}
                  name="roofOrientation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roof orientation</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roofOrientations.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={inputForm.control}
                  name="shade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shade level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-[44px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shadeOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="button" onClick={onCalculate} className="w-full gap-2" size="lg">
                  <Calculator className="h-5 w-5" />
                  Estimate my savings
                </Button>
              </form>
            </Form>
          </div>

          <AnimatePresence>
            {displayEstimate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 overflow-hidden"
              >
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sun className="h-5 w-5 text-primary" />
                    Your estimate
                  </h3>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Recommended system size</dt>
                      <dd className="font-semibold text-foreground">{displayEstimate.systemSizeKw} kW</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Estimated cost range</dt>
                      <dd className="font-semibold text-foreground">
                        €{displayEstimate.costMin.toLocaleString()} – €{displayEstimate.costMax.toLocaleString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Estimated annual savings</dt>
                      <dd className="font-semibold text-primary">€{displayEstimate.annualSavings.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Typical payback (after incentives)</dt>
                      <dd className="font-semibold text-foreground">~{displayEstimate.paybackYears} years</dd>
                    </div>
                  </dl>
                  <p className="text-xs text-muted-foreground mt-4">
                    Based on typical rates and production. Actual savings depend on usage, tariffs, and site conditions.
                  </p>

                  {!emailSent ? (
                    showEmailForm && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <Label className="text-base font-medium">Email my estimate</Label>
                        <Form {...emailForm}>
                          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="mt-3 space-y-3">
                            <FormField
                              control={emailForm.control}
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
                              control={emailForm.control}
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
                              control={emailForm.control}
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
                            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                              {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                              Email my estimate
                            </Button>
                          </form>
                        </Form>
                      </div>
                    )
                  ) : (
                    <p className="mt-4 text-sm text-primary font-medium">Estimate sent to your email.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
