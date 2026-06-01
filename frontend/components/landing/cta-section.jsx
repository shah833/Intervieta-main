import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="contact" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-cyan-300/25 bg-gradient-to-r from-cyan-500/15 to-sky-500/15 p-8 text-center shadow-2xl lg:p-12">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">Turn interview anxiety into interview confidence</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-200">
          Start practicing with IntervieTA and walk into your next interview already prepared for the toughest questions.
        </p>
        <Button size="lg" className="mt-8 rounded-full">
          Start Interview Now
        </Button>
      </div>
    </section>
  );
}
