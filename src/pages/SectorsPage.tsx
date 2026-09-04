import { PageHero } from '@/components/ui/Primitives'
import { Sectors } from '@/components/sections/Sectors'
import { Clients } from '@/components/sections/Clients'
import { ContactCta } from '@/components/sections/ContactCta'

export function SectorsPage() {
  return (
    <>
      <title>Sectors — Valentia Technologies</title>
      <meta
        name="description"
        content="Primary care, supported living, out of hours care, community care and emergency care — the settings Valentia Technologies builds for, and the platforms that serve each."
      />
      <PageHero
        eyebrow="Where we work"
        title={
          <>
            Every setting has its own{' '}
            <span className="text-v-crimson-400">pressure points.</span>
          </>
        }
        lead="Primary care, supported living, out of hours, community and emergency care. The problems differ in each; so does the platform we bring to them."
      />

      <Sectors />
      <Clients />
      <ContactCta />
    </>
  )
}
