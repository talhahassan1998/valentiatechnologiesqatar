import { PageHero } from '@/components/ui/Primitives'
import { Contact } from '@/components/sections/Contact'
import { ContactDetails } from '@/components/sections/ContactDetails'

export function ContactPage() {
  return (
    <>
      <title>Contact — Valentia Technologies</title>
      <meta
        name="description"
        content="Get in touch with Valentia Technologies about healthcare software, clinical systems and integration work in Qatar and the Gulf."
      />
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Start with the problem,{' '}
            <span className="text-v-crimson-400">not the specification.</span>
          </>
        }
        lead="The most useful first conversation is usually about what is going wrong today, not about which product might fix it."
      />

      <Contact />
      <ContactDetails />
    </>
  )
}
