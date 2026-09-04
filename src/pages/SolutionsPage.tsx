import { PageHero } from '@/components/ui/Primitives'
import { ServiceDetail } from '@/components/sections/ServiceDetail'
import { Sectors } from '@/components/sections/Sectors'
import { ContactCta } from '@/components/sections/ContactCta'
import { products, productDetail } from '@/data/content'

export function SolutionsPage() {
  return (
    <>
      <title>Solutions — Valentia Technologies</title>
      <meta
        name="description"
        content="indici, InnovaCare, Spectrum, Vivasta, CareMonX and Maha — six healthcare platforms covering primary care, home care, telehealth, community services, emergency response and oncology."
      />
      <PageHero
        eyebrow="The suite"
        title={
          <>
            Six platforms built for{' '}
            <span className="text-v-crimson-400">where care happens.</span>
          </>
        }
        lead="A cloud EHR, home care management, telehealth and triage, community services, emergency response and anti-cancer therapeutics — engineered to interoperate rather than to stand alone."
      />

      {products.map((p, i) => (
        <ServiceDetail key={p.id} item={p} flip={i % 2 === 1} details={productDetail} />
      ))}

      <Sectors compact />
      <ContactCta
        title="Not sure which platform fits?"
        lead="Describe the setting and the pressure you are under, and we will tell you which of these actually helps."
      />
    </>
  )
}
