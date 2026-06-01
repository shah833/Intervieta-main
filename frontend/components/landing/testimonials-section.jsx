import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Maya Singh",
    role: "Student",
    quote:
      "IntervieTA made my campus interviews feel familiar. The follow-up questions were so realistic that I stopped freezing during real rounds.",
  },
  {
    name: "Ethan Park",
    role: "Developer",
    quote:
      "I used it before senior frontend interviews. The feedback on structure and clarity helped me answer with much more confidence.",
  },
  {
    name: "Lena Brooks",
    role: "Job Seeker",
    quote:
      "The resume-based practice was exactly what I needed. It challenged me on my own projects the same way recruiters did.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">Trusted by candidates preparing for real stakes</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardHeader>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <p className="text-sm text-cyan-200">{testimonial.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-200">&ldquo;{testimonial.quote}&rdquo;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
