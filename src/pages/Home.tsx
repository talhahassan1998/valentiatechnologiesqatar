import { Hero } from '@/components/hero/Hero'
import { Positioning } from '@/components/sections/Positioning'
import { Solutions } from '@/components/sections/Solutions'
import { Sectors } from '@/components/sections/Sectors'
import { Capabilities } from '@/components/sections/Capabilities'
import { DigitalAnatomy } from '@/components/sections/DigitalAnatomy'
import { Clients } from '@/components/sections/Clients'
import { Partners } from '@/components/sections/Partners'
import { ContactCta } from '@/components/sections/ContactCta'

export function Home() {
  return (
    <>
      <title>Valentia Technologies — Engineering Better Healthcare</title>
      <meta
        name="description"
        content="Valentia Technologies engineers intelligent healthcare software that connects people, data and clinical workflows. Qatar."
      />
      <Hero />
      <Positioning />
      <Solutions />
      <Sectors compact />
      <Capabilities />
      <DigitalAnatomy />
      <Clients />
      <Partners />
      <ContactCta />
    </>
  )
}
