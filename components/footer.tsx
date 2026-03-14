import Link from "next/link"
import { Sparkles, Instagram, Facebook, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Sparkles className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              <span className="font-serif text-xl font-bold">
                Blossom Beauty
              </span>
            </Link>
            <p className="text-primary-foreground/70 mb-6">
              Donde cada visita es un viaje hacia descubrir tu ser mas hermoso.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary/30 transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary/30 transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Enlaces Rapidos</h3>
            <ul className="space-y-3">
              {[
                { label: "Inicio", href: "#inicio" },
                { label: "Servicios", href: "#servicios" },
                { label: "Nosotros", href: "#nosotros" },
                { label: "Galeria", href: "#galeria" },
                { label: "Contacto", href: "#contacto" }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Nuestros Servicios</h3>
            <ul className="space-y-3">
              {["Tintes", "Peinados", "Planchados", "Keratinas"].map((service) => (
                <li key={service}>
                  <Link 
                    href="#servicios" 
                    className="text-primary-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Horario de Atencion</h3>
            <ul className="space-y-3 text-primary-foreground/70">
              <li className="flex justify-between">
                <span>Lun - Vie</span>
                <span>9AM - 8PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sabado</span>
                <span>9AM - 8PM</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo</span>
                <span>10AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              2024 Blossom Beauty Salon. Todos los derechos reservados.
            </p>
            <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
              Hecho con <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" /> para almas hermosas
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
