import { PageHero } from '@/components/ui/Primitives'
import { ServiceDetail } from '@/components/sections/ServiceDetail'
import { Engagement } from '@/components/sections/Engagement'
import { ContactCta } from '@/components/sections/ContactCta'
import { capabilities } from '@/data/content'

export function Services() {
  return (
    <>
      <title>Services — Valentia Technologies</title>
      <meta
        name="description"
        content="Clinical systems, HL7 and FHIR interoperability, health data and analytics, applied AI, patient platforms, and security and compliance engineering for healthcare providers in Qatar."
      />
      <PageHero
        eyebrow="What we engineer"
        title={
          <>
            Six disciplines that make a healthcare estate{' '}
            <span className="text-v-crimson-400">actually work.</span>
          </>
        }
        lead="Engineered to interoperate rather than to stand alone. Each of these is a practice we run end to end, from the first workflow session to long-term support."
      />

      {capabilities.map((c, i) => (
        <ServiceDetail key={c.id} item={c} flip={i % 2 === 1} />
      ))}

      <Engagement />
      <ContactCta
        title="Not sure which of these you need?"
        lead="Most organisations start with one problem and find it connects to three others. Describe the symptom and we will help map the cause."
      />
    </>
  )
}
