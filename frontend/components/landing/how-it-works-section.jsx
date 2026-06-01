const steps = [
  "Select interview type (HR / Technical)",
  "Answer questions via voice or text",
  "AI adapts questions in real time",
  "Get detailed performance feedback",
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl backdrop-blur lg:p-12">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">How It Works</h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Go from preparation to confidence in one focused workflow designed around real interview conditions.
        </p>

        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-sm font-semibold text-cyan-200">
                {index + 1}
              </span>
              <p className="text-slate-100">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
