import { PageHero } from '@/components/ui/Primitives'
import { Partners } from '@/components/sections/Partners'
import { Values } from '@/components/sections/Values'
import { ContactCta } from '@/components/sections/ContactCta'

export function PartnersPage() {
  return (
    <>
      <title>Partners — Valentia Technologies</title>
      <meta
        name="description"
        content="Valentia works with Microsoft, VMware, Fortinet, Zerto, Veeam, Huawei and Rhipe to ensure clients benefit from consistently high-quality and secure services."
      />
      <PageHero
        eyebrow="Who we build on"
        title={
          <>
            Industry-leading technology,{' '}
            <span className="text-v-crimson-400">underneath the care.</span>
          </>
        }
        lead="Clinical systems are only as dependable as the infrastructure carrying them. We partner where it makes our clients' services more secure and more resilient."
      />

      <Partners />
      <Values />
      <ContactCta />
    </>
  )
}
