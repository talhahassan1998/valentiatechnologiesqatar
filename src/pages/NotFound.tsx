import { Button, Eyebrow, Section } from '@/components/ui/Primitives'

export function NotFound() {
  return (
    <>
      <title>Page not found — Valentia Technologies</title>
      <meta name="description" content="That page does not exist." />
      <Section className="flex min-h-[70svh] items-center pt-36">
        <div className="max-w-2xl">
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="text-h1 mt-6 text-white">
            That page does not <span className="text-v-crimson-400">exist.</span>
          </h1>
          <p className="text-lead mt-6 text-v-ink-300">
            The link may be out of date, or the address slightly wrong. These will get
            you back.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/">Return Home</Button>
            <Button href="/contact" variant="ghost">
              Contact Us
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
