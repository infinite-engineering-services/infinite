import { Film } from "@/components/three/film/film";
import { DeliverableTabs } from "@/components/sections/deliverable-tabs";
import { ScrollBand } from "@/components/sections/scroll-band";
import { WorkPreview } from "@/components/sections/work-preview";
import { DataPricing } from "@/components/sections/data-pricing";
import { Faq, faqLd, homeFaqs } from "@/components/sections/faq";
import { PilotCTA } from "@/components/sections/pilot-cta";
import { PageTransition } from "@/components/motion/transitions";
import { JsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <PageTransition>
      <div>
        <Film />
        <ScrollBand />
        <DeliverableTabs />
        <WorkPreview />
        <DataPricing />
        <Faq items={homeFaqs} />
        <PilotCTA />
        <JsonLd data={faqLd(homeFaqs) as never} />
      </div>
    </PageTransition>
  );
}
