import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Human-Like AI Interviewer",
    description: "Converse with an interviewer that feels natural, contextual, and role-aware from start to finish.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 2a5 5 0 015 5v3a5 5 0 11-10 0V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20c1.5-3 4.5-4.5 8-4.5s6.5 1.5 8 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Dynamic Follow-Up Questions",
    description: "IntervieTA probes deeper based on your exact answers, mirroring real interviewer behavior.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M4 7h16M4 12h10M4 17h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Resume-Based Interviewing",
    description: "Upload your resume and get personalized questions targeted to your projects, tools, and experience.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M7 3h7l4 4v14H7V3z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 3v4h4M10 12h5M10 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Intelligent Performance Feedback",
    description: "Receive instant scoring on communication, technical clarity, structure, and confidence with clear next steps.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M5 19V9m7 10V5m7 14v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Built for realistic interview practice</h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Every session is designed to reflect real hiring conversations while giving you feedback you can immediately act on.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
