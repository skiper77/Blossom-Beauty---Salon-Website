"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, Sparkles, Star, CheckCircle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const recommendations = [
  {
    service: "Tintes",
    icon: "palette",
    title: "Por que hacerte un Tinte?",
    benefits: [
      "Renueva tu imagen y aumenta tu confianza",
      "Cubre las canas de forma natural y elegante",
      "Resalta tus rasgos faciales con el color perfecto",
      "Experimenta con tendencias sin daniar tu cabello",
      "Nuestros productos son de alta calidad y cuidan tu pelo"
    ],
    testimonial: "El color que me hicieron cambio completamente mi look. Me siento 10 anos mas joven!",
    author: "Maria Rodriguez"
  },
  {
    service: "Peinados",
    icon: "scissors",
    title: "Por que hacerte un Peinado?",
    benefits: [
      "Luciras espectacular en eventos especiales",
      "Realza tu belleza natural con estilos unicos",
      "Ahorra tiempo con peinados que duran todo el dia",
      "Expresa tu personalidad a traves de tu cabello",
      "Recibe consejos personalizados de nuestros expertos"
    ],
    testimonial: "Mi peinado de boda fue perfecto. Todas mis amigas me preguntaron donde lo hice!",
    author: "Ana Martinez"
  },
  {
    service: "Planchados",
    icon: "wind",
    title: "Por que hacerte un Planchado?",
    benefits: [
      "Reduce el frizz y logra un cabello manejable",
      "Ahorra tiempo cada manana en tu rutina",
      "Resultados duraderos que lucen naturales",
      "Protege tu cabello del calor excesivo",
      "Ideal para todo tipo de cabello"
    ],
    testimonial: "Ya no paso horas luchando con mi cabello. El planchado cambio mi vida!",
    author: "Carmen Gonzalez"
  },
  {
    service: "Keratinas",
    icon: "sparkles",
    title: "Por que hacerte una Keratina?",
    benefits: [
      "Repara el cabello danado desde adentro",
      "Elimina el frizz por meses",
      "Brillo increible y sedosidad al tacto",
      "Reduce el tiempo de secado a la mitad",
      "Proteccion duradera contra el clima"
    ],
    testimonial: "Mi cabello nunca habia estado tan suave. La keratina es mi tratamiento favorito!",
    author: "Laura Perez"
  },
]

export function Recommendations() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            recommendations.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4 animate-pulse" />
            Recomendaciones
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Por Que Elegirnos?
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubre los beneficios increibles de cada uno de nuestros tratamientos y por que miles de clientas confian en nosotros.
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {recommendations.map((rec, index) => (
            <Card 
              key={index}
              className={`group bg-card border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer ${
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } ${activeCard === index ? "ring-2 ring-primary" : ""}`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <CardContent className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Sparkles className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{rec.service}</span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                      {rec.title}
                    </h3>
                  </div>
                </div>

                {/* Benefits List */}
                <ul className="space-y-3 mb-6">
                  {rec.benefits.map((benefit, i) => (
                    <li 
                      key={i} 
                      className="flex items-start gap-3 text-muted-foreground transition-all duration-300 group-hover:translate-x-1"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Testimonial */}
                <div className="bg-muted/50 rounded-2xl p-4 mb-6">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-2">
                    {`"${rec.testimonial}"`}
                  </p>
                  <p className="text-xs font-medium text-foreground">- {rec.author}</p>
                </div>

                {/* CTA Button */}
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 group-hover:scale-[1.02]">
                  Reservar {rec.service}
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            No esperes mas para transformar tu look. Nuestras expertas te esperan!
          </p>
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full px-10 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
            <Sparkles className="h-5 w-5 mr-2" />
            Reserva Tu Cita Ahora
          </Button>
        </div>
      </div>
    </section>
  )
}
