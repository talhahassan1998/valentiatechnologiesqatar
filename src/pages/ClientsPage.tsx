import { PageHero } from '@/components/ui/Primitives'
import { Clients } from '@/components/sections/Clients'
import { Sectors } from '@/components/sections/Sectors'
import { ContactCta } from '@/components/sections/ContactCta'

export function ClientsPage() {
  return (
    <>
      <title>Clients — Valentia Technologies</title>
      <meta
        name="description"
        content="250 general practices, national ambulance services and community care providers across New Zealand, Australia, the South Pacific, Ireland, South Africa, Qatar and Dubai."
      />
      <PageHero
        eyebrow="Who runs it"
        title={
          <>
            Our customers achieve excellence{' '}
            <span className="text-v-crimson-400">with Valentia.</span>
          </>
        }
        lead="A customer base spanning an extensive range of healthcare disciplines and multiple continents, united by an interest in what modern technology can do for care."
      />

      <Clients />
      <Sectors compact />
      <ContactCta
        title="Join them."
        lead="Tell us what you are running today and what is not working. We will respond with a considered view, not a sales pitch."
      />
    </>
  )
}
