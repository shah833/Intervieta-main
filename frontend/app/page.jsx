import { CtaSection } from "@/components/landing/cta-section";
import { Navbar } from "@/components/Navbar";
import { FeaturesSection } from "@/components/landing/features-section";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      <main>
        {/* Hero */}
        <HeroSection />

        {/* Features */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Pricing */}
        <PricingSection />

        {/* Closing CTA */}
        <CtaSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
