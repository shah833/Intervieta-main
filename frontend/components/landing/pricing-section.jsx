import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "For first-time users practicing foundational interviews.",
    features: ["3 interviews per month", "Text-based interview mode", "Basic AI feedback"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$19/mo",
    description: "For active job seekers who want faster improvement.",
    features: ["Unlimited interviews", "Voice + text interview mode", "Advanced performance analytics", "Resume-based simulations"],
    cta: "Start Pro Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For universities, bootcamps, and hiring teams.",
    features: ["Team dashboard", "Role-based interview templates", "Dedicated support", "Admin-level reporting"],
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Simple pricing for every stage</h2>
        <p className="mt-4 max-w-2xl text-slate-300">Start free and scale as your interview goals grow.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.featured ? "border-cyan-300/30 bg-cyan-400/5 shadow-cyan-900/40" : ""}
            >
              <CardHeader>
                <p className="text-sm font-medium text-cyan-200">{plan.name}</p>
                <CardTitle className="text-3xl">{plan.price}</CardTitle>
                <p className="text-sm text-slate-300">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-slate-100">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant={plan.featured ? "default" : "secondary"} className="w-full">
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
