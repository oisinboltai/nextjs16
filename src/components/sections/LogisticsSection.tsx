"use client";
import { MapPin, Building, ListChecks, FileText, Users, XCircle } from "lucide-react";

const infoItems = [
  {
    icon: MapPin,
    title: "Service Area",
    description: "We operate across multiple regions with capability for international projects. Contact us to confirm coverage for your location.",
  },
  {
    icon: Building,
    title: "Project Types",
    items: ["Residential homes & apartments", "Commercial buildings", "Industrial facilities", "New construction & retrofits"],
  },
  {
    icon: ListChecks,
    title: "Typical Process",
    items: ["Initial consultation (remote or on-site)", "Site assessment & system design", "Proposal with detailed specifications", "Installation & commissioning", "Handover & documentation"],
  },
  {
    icon: FileText,
    title: "For Your Quote",
    items: ["Property type and location", "Current energy usage (if available)", "Project goals and timeline", "Any existing system details"],
  },
];

const idealFor = [
  "Property owners seeking long-term energy savings",
  "Businesses planning sustainability upgrades",
  "Developers requiring compliant installations",
  "Facility managers optimizing operations",
];

const notFor = [
  "Emergency repairs (we focus on planned projects)",
  "Off-grid cabins requiring minimal systems",
];

export function LogisticsSection() {
  return (
    <section id="logistics" className="py-20 md:py-28 bg-gradient-to-b from-secondary/15 to-secondary/25">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practical information about our process and service scope.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                  {item.items && (
                    <ul className="space-y-1 mt-2">
                      {item.items.map((listItem, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary">•</span>
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Who This Is For */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Ideal For</h3>
                <ul className="space-y-1">
                  {idealFor.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Not For</h3>
                <ul className="space-y-1">
                  {notFor.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-muted-foreground">–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

