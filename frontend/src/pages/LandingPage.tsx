import React, { useEffect } from 'react';
import {
  Navbar,
  Hero,
  ProblemSection,
  Introduction,
  FeaturesSection,
  HowItWorks,
  UseCases,
  ProductDemo,
  Comparison,
  PrivacySection,
  FAQ,
  FinalCTA,
  Footer
} from '../components/landing';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Dynamic SEO title & meta description update
    const previousTitle = document.title;
    document.title = 'Digitick — Your Shopping List. Finally Sorted.';

    let metaDesc = document.querySelector('meta[name="description"]');
    let previousDesc = '';
    if (metaDesc) {
      previousDesc = metaDesc.getAttribute('content') || '';
      metaDesc.setAttribute(
        'content',
        'From handwritten notes to organized digital shopping lists. Create, scan, manage, and discover nearby stores — all in one place.'
      );
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute(
        'content',
        'From handwritten notes to organized digital shopping lists. Create, scan, manage, and discover nearby stores — all in one place.'
      );
      document.head.appendChild(metaDesc);
    }

    // Scroll to top upon landing view
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    return () => {
      document.title = previousTitle;
      if (metaDesc && previousDesc) {
        metaDesc.setAttribute('content', previousDesc);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-nature-deep text-nature-text dark:text-nature-offwhite selection:bg-nature-mint selection:text-nature-darkforest overflow-x-hidden transition-colors">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero with Interactive Animated Shopping Flow */}
        <Hero />

        {/* 2. Problem Section & Before/After Comparison */}
        <ProblemSection />

        {/* 3. Introduction & Bento Overview */}
        <Introduction />

        {/* 4. Deep-dive Features Showcase */}
        <FeaturesSection />

        {/* 5. How It Works (4 Connected Steps) */}
        <HowItWorks />

        {/* 6. Practical Household Use Cases */}
        <UseCases />

        {/* 7. In-Browser Interactive Product Sandbox Demo */}
        <ProductDemo />

        {/* 8. Side-by-Side Honest Comparison */}
        <Comparison />

        {/* 9. Privacy, Security & Trust */}
        <PrivacySection />

        {/* 10. Frequently Asked Questions Accordion */}
        <FAQ />

        {/* 11. Final High-Impact CTA */}
        <FinalCTA />
      </main>

      {/* Global Landing Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
