import { PageHero } from '@/components/ui/Primitives'
import { Story } from '@/components/sections/Story'
import { Approach } from '@/components/sections/Approach'
import { Values } from '@/components/sections/Values'
import { Industries } from '@/components/sections/Industries'
import { ContactCta } from '@/components/sections/ContactCta'

export function About() {
  return (
    <>
      <title>About — Valentia Technologies</title>
      <meta
        name="description"
        content="Valentia Technologies is a healthcare software company in Qatar, engineering clinical systems around how care teams actually work. Our story, approach and principles."
      />
      <PageHero
        eyebrow="Who we are"
        title={
          <>
            Healthcare runs on software.{' '}
            <span className="text-v-crimson-400">We build it properly.</span>
          </>
        }
        lead="A Qatar-based software company working exclusively in healthcare — because clinical systems fail in ways general-purpose engineering does not prepare you for."
      />

      <Story />
      <Approach />
      <Values />
      <Industries />
      <ContactCta
        title="Tell us what you are working on."
        lead="We will respond with a considered view, not a sales pitch."
      />
    </>
  )
}
