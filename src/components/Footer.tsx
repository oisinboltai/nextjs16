"use client";
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold text-foreground">
            Energy<span className="text-primary">Ops</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {currentYear} EnergyOps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

