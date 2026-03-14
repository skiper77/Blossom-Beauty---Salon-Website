import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { BeforeAfter } from "@/components/before-after"
import { About } from "@/components/about"
import { Gallery } from "@/components/gallery"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Recommendations } from "@/components/recommendations"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <BeforeAfter />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
      <Recommendations />
      <Footer />
    </main>
  )
}
