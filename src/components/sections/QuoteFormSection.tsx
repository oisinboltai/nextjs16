"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, ChevronRight, ChevronLeft, HelpCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  projectType: z.string().min(1, "Please select a project type"),
  propertyType: z.string().min(1, "Please select a property type"),
  propertySize: z.string().optional(),
  roofType: z.string().optional(),
  currentSystem: z.string().optional(),
  location: z.string().trim().min(2, "Please enter your location").max(100, "Location is too long"),
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  phone: z.string().trim().min(6, "Please enter a valid phone number").max(20, "Phone number is too long"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, title: "Project Type", description: "What are you looking for?" },
  { id: 2, title: "Property Details", description: "Tell us about your property" },
  { id: 3, title: "Contact Info", description: "How can we reach you?" },
];

export function QuoteFormSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectType: "",
      propertyType: "",
      propertySize: "",
      roofType: "",
      currentSystem: "",
      location: "",
      name: "",
      email: "",
      phone: "",
      budget: "",
      timeline: "",
    },
    mode: "onChange",
  });

  const projectType = form.watch("projectType");
  const propertyType = form.watch("propertyType");

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ["projectType", "propertyType"];
        break;
      case 2:
        fieldsToValidate = ["location"];
        if (projectType === "solar") {
          fieldsToValidate.push("roofType");
        }
        if (projectType === "hvac") {
          fieldsToValidate.push("currentSystem");
        }
        break;
      case 3:
        fieldsToValidate = ["name", "email", "phone"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    toast({
      title: "Quote Request Received",
      description: "We'll be in touch within 1-2 business days.",
    });
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (isSubmitted) {
    return (
      <section id="quote" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
            >
              Thank You
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Your quote request has been submitted. Our team will review your
              details and reach out within 1-2 business days.
            </motion.p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Request a Quote
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Provide your project details and we'll prepare a tailored proposal.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            {/* Progress Indicator */}
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
                        {currentStep > step.id ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="mt-2 text-xs text-center">
                        <div
                          className={`font-medium ${
                            currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </div>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 transition-colors ${
                          currentStep > step.id ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <TooltipProvider>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Project Type */}
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
                          name="projectType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Project Type
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Select the type of energy solution you're interested in</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="solar">Solar PV</SelectItem>
                                  <SelectItem value="hvac">HVAC System</SelectItem>
                                  <SelectItem value="hybrid">Hybrid (Solar + HVAC)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="propertyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Property Type
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Tell us about your property type</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select property" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="residential">Residential</SelectItem>
                                  <SelectItem value="commercial">Commercial</SelectItem>
                                  <SelectItem value="industrial">Industrial</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 2: Property Details */}
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
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Location
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>City, region, or postcode where the project will be located</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="City, Region or Postcode"
                                  {...field}
                                  className="transition-all focus:ring-2 focus:ring-primary/20 min-h-[44px] text-base md:text-sm"
                                  aria-describedby={field.name ? `${field.name}-description` : undefined}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {projectType === "solar" && (
                          <FormField
                            control={form.control}
                            name="roofType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  Roof Type
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Type of roof for solar panel installation</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                      <SelectValue placeholder="Select roof type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="tiled">Tiled</SelectItem>
                                    <SelectItem value="metal">Metal</SelectItem>
                                    <SelectItem value="flat">Flat</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {projectType === "hvac" && (
                          <FormField
                            control={form.control}
                            name="currentSystem"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  Current System
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Your current heating/cooling system</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                      <SelectValue placeholder="Select current system" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="gas">Gas Boiler</SelectItem>
                                    <SelectItem value="electric">Electric Heating</SelectItem>
                                    <SelectItem value="oil">Oil Heating</SelectItem>
                                    <SelectItem value="none">No System</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="propertySize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  Property Size (sq ft)
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Approximate square footage of your property</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="e.g., 2000"
                                    {...field}
                                    className="transition-all focus:ring-2 focus:ring-primary/20 min-h-[44px] text-base md:text-sm"
                                    inputMode="numeric"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  Budget Range
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Your estimated budget range (optional)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                      <SelectValue placeholder="Select range" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                    <SelectItem value="50k-plus">$50,000+</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Contact Information */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Name
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Your full name</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  className="transition-all focus:ring-2 focus:ring-primary/20 min-h-[44px] text-base md:text-sm"
                                  autoComplete="name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  Email
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>We'll send your quote to this email</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    {...field}
                                    className="transition-all focus:ring-2 focus:ring-primary/20 min-h-[44px] text-base md:text-sm"
                                    autoComplete="email"
                                    inputMode="email"
                                  />
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
                                <FormLabel className="flex items-center gap-2">
                                  Phone
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Best number to reach you</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    {...field}
                                    className="transition-all focus:ring-2 focus:ring-primary/20 min-h-[44px] text-base md:text-sm"
                                    autoComplete="tel"
                                    inputMode="tel"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Project Timeline
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>When are you looking to start this project?</p>
                                  </TooltipContent>
                                </Tooltip>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select timeline" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="asap">As soon as possible</SelectItem>
                                  <SelectItem value="1-3months">1-3 months</SelectItem>
                                  <SelectItem value="3-6months">3-6 months</SelectItem>
                                  <SelectItem value="6plus">6+ months</SelectItem>
                                  <SelectItem value="exploring">Just exploring</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TooltipProvider>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="transition-all"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="transition-all"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Request Quote
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  No obligation. We'll respond within 1-2 business days.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

