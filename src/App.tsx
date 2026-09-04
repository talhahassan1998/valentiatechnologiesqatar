import { Route, Routes, useLocation } from 'react-router-dom'
import { Nav } from '@/components/ui/Nav'
import { Preloader } from '@/components/ui/Preloader'
import { Footer } from '@/components/ui/Footer'
import { RouteTransition, useSmoothScroll } from '@/lib/motion'
import { Home } from '@/pages/Home'
import { Services } from '@/pages/Services'
import { SolutionsPage } from '@/pages/SolutionsPage'
import { SectorsPage } from '@/pages/SectorsPage'
import { ClientsPage } from '@/pages/ClientsPage'
import { PartnersPage } from '@/pages/PartnersPage'
import { About } from '@/pages/About'
import { ContactPage } from '@/pages/ContactPage'
import { NotFound } from '@/pages/NotFound'

export default function App() {
  // One Lenis for the app lifetime — recreating it per route would tear down
  // the wheel listeners mid-navigation.
  useSmoothScroll()
  const { pathname } = useLocation()

  return (
    <>
      <Preloader />
      <Nav />
      <RouteTransition />
      {/* Keyed so every section's gsap.context cleanup runs on route change. */}
      <main id="top" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
